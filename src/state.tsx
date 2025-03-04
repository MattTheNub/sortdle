import { BANNED_LETTERS } from './constants'
import seedrandom from 'seedrandom'

export function getDailySeed(number = dailyNumber()) {
	return number + 19062
}
export function dailyNumber() {
	return Math.floor((Date.now() / 1000 / 60 / 60 - 4) / 24) - 19062
}

const assets = import('./assets')
const answers = assets.then(assets => assets.answers)
const allowedWords = assets.then(assets => assets.allowedWords)

export default class GameState {
	boards: BoardState[] = []
	swaps: [number, number][] = []
	curGuess: string = ''
	wantsCompleteDialog = false
	wantsFailDialog = false
	dailyNumber: number | null = null

	constructor(
		public readonly seed: string,
		public readonly prefix: string,
		public allowedWords: Set<string>,
		answers: string[],
		public settings: Settings = {
			blues: true,
			swaps: true,
		},
	) {
		const rng = seedrandom(seed)

		if (prefix === 'daily') {
			this.dailyNumber = dailyNumber()
		}

		for (let i = 0; i < 5; i++) {
			let answer: string
			do {
				answer = answers[Math.abs(rng.int32()) % answers.length]
			} while (this.boards.some(board => board.word === answer))
			this.boards.push(new BoardState(answer))
		}
	}

	static async random() {
		return new GameState(
			Math.random().toString(),
			'random',
			await allowedWords,
			await answers,
		)
	}
	static async daily() {
		return new GameState(
			getDailySeed().toString(),
			'daily',
			await allowedWords,
			await answers,
		)
	}
	static async custom(settings: Settings, seed = Math.random().toString()) {
		return new GameState(
			seed,
			'custom',
			await allowedWords,
			await answers,
			settings,
		)
	}
	static async load(prefix: string) {
		let state = new GameState(
			localStorage.getItem(`${prefix}Seed`) as string,
			prefix,
			await allowedWords,
			await answers,
			prefix === 'custom'
				? JSON.parse(localStorage.getItem('customSettings') as string)
				: undefined,
		)

		// load the previous guesses and hints
		;(
			JSON.parse(
				localStorage.getItem(`${prefix}State`) as string,
			) as BoardState[]
		).forEach((board, i) => {
			state.boards[i].active = board.active
			state.boards[i].guesses = board.guesses
			state.boards[i].hiddenGuesses = board.hiddenGuesses
		})
		state.swaps = JSON.parse(localStorage.getItem(`${prefix}Swaps`) as string)
		// simulate each swap
		for (const swap of state.swaps) {
			state.swap(swap[0], swap[1], false)
		}

		return state
	}

	submit() {
		if (
			this.guessCount() < 11 &&
			this.curGuess.length === 5 &&
			this.allowedWords.has(this.curGuess)
		) {
			const activeBoards = [0, 1, 2, 3, 4].filter(i => this.boards[i].active)

			if (this.settings.swaps) {
				// swap two boards at random
				// swaps happen always with three or more boards, and half of the
				// time when there are only two boards
				if (
					activeBoards.length > 2 ||
					(activeBoards.length === 2 && Math.random() < 0.5)
				) {
					let first = Math.floor(Math.random() * activeBoards.length)
					let second
					do {
						second = Math.floor(Math.random() * activeBoards.length)
					} while (second === first)
					this.swap(activeBoards[first], activeBoards[second])
				}
			}
			for (const i of activeBoards) {
				this.boards[i].guess(this.curGuess, this.settings.blues)
			}
			this.curGuess = ''

			// check if there are any active boards left,
			// and if there are guesses left
			this.dialogCheck()
			return true
		}
		return false
	}

	save() {
		localStorage.setItem(
			`${this.prefix}State`,
			JSON.stringify(this.boards.map(board => ({ ...board, word: undefined }))),
		)
		localStorage.setItem(`${this.prefix}Swaps`, JSON.stringify(this.swaps))
		localStorage.setItem(`${this.prefix}Seed`, this.seed)

		if (this.prefix === 'custom') {
			localStorage.setItem('customSettings', JSON.stringify(this.settings))
		}
	}

	swap(first: number, second: number, log: boolean = true) {
		const temp = this.boards[first].word
		this.boards[first].word = this.boards[second].word
		this.boards[second].word = temp

		if (log) {
			this.swaps.push([first, second])
		}
	}

	guessCount() {
		return this.boards.reduce(
			(prev, cur) => Math.max(prev, cur.guesses.length),
			0,
		)
	}

	guesses() {
		const longest = this.boards.reduce((prev, cur) =>
			prev.guesses.length > cur.guesses.length ? prev : cur,
		)

		return longest.guesses.map(guess =>
			guess.map(letter => letter.letter).join(''),
		)
	}

	dialogCheck() {
		if (!this.boards.some(board => board.active)) {
			this.wantsCompleteDialog = true
		} else if (this.guessCount() >= 11) {
			this.wantsFailDialog = true
		}
	}

	active() {
		return this.boards.some(board => board.active) && this.guessCount() < 11
	}

	correctCount() {
		return this.boards.reduce((prev, cur) => prev + (cur.active ? 0 : 1), 0)
	}
}

export class BoardState {
	hiddenGuesses: number[] | undefined
	guesses: LetterGuess[][] = []
	active = true

	constructor(public word: string) {}

	guess(guess: string, blues: boolean) {
		const word = this.word
		const letters = []
		const unusedLetters = [...word] // for double letters

		for (let i = 0; i < guess.length; i++) {
			if (word[i] == guess[i]) {
				delete unusedLetters[unusedLetters.indexOf(guess[i])]
			}
		}

		for (let i = 0; i < guess.length; i++) {
			const letter = guess[i]
			let color
			if (word[i] === letter) {
				color = LetterColor.Green
			} else if (blues && BANNED_LETTERS.has(letter)) {
				color = LetterColor.Blue
			} else if (unusedLetters.includes(letter)) {
				color = LetterColor.Yellow
				delete unusedLetters[unusedLetters.indexOf(letter)]
			} else {
				color = LetterColor.Grey
			}

			letters.push({
				letter,
				color,
			})
		}

		this.guesses.push(letters)

		if (word === guess) {
			this.active = false
		}
	}

	toggleGuess(row: number) {
		if (this.hiddenGuesses === undefined) {
			this.hiddenGuesses = []
		}

		if (this.hiddenGuesses.includes(row)) {
			this.hiddenGuesses.splice(this.hiddenGuesses.indexOf(row), 1)
		} else {
			this.hiddenGuesses.push(row)
		}
	}

	isHidden(row: number) {
		if (this.hiddenGuesses === undefined) {
			return false
		}
		return this.hiddenGuesses.includes(row)
	}
}

export type LetterGuess = {
	letter: string
	color: LetterColor
}

export enum LetterColor {
	Blue,
	Grey,
	Yellow,
	Green,
}

export type Settings = {
	swaps: boolean
	blues: boolean
}
