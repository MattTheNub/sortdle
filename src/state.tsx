import { allowedWords, answers } from './assets'
import { BANNED_LETTERS } from './constants'
import seedrandom from 'seedrandom'

export function getDailySeed() {
	return Math.floor((Date.now() / 1000 / 60 / 60 - 4) / 24)
}

export default class GameState {
	boards: BoardState[] = []
	swaps: [number, number][] = []
	curGuess: string = ''
	wantsCompleteDialog = false
	wantsFailDialog = false

	constructor(public readonly seed: string, public readonly prefix: string) {
		const rng = seedrandom(seed)

		for (let i = 0; i < 5; i++) {
			this.boards.push(
				new BoardState(answers[Math.abs(rng.int32()) % answers.length]),
			)
		}
	}

	static random() {
		return new GameState(Math.random().toString(), 'random')
	}
	static daily() {
		return new GameState(getDailySeed().toString(), 'daily')
	}
	static load(prefix: string) {
		let state = new GameState(
			localStorage.getItem(`${prefix}Seed`) as string,
			prefix,
		)

		// load the previous guesses and hints
		;(
			JSON.parse(
				localStorage.getItem(`${prefix}State`) as string,
			) as BoardState[]
		).forEach((board, i) => {
			state.boards[i].active = board.active
			state.boards[i].guesses = board.guesses
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
			allowedWords.has(this.curGuess)
		) {
			const activeBoards = [0, 1, 2, 3, 4].filter(i => this.boards[i].active)

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
			for (const i of activeBoards) {
				this.boards[i].guess(this.curGuess)
			}
			this.curGuess = ''

			// check if there are any active boards left,
			// and if there are guesses left
			if (!activeBoards.some(i => this.boards[i].active)) {
				this.wantsCompleteDialog = true
			} else if (this.guessCount() >= 11) {
				this.wantsFailDialog = true
			}
		}
	}

	save() {
		localStorage.setItem(
			`${this.prefix}State`,
			JSON.stringify(this.boards.map(board => ({ ...board, word: undefined }))),
		)
		localStorage.setItem(`${this.prefix}Swaps`, JSON.stringify(this.swaps))
		localStorage.setItem(`${this.prefix}Seed`, this.seed)
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
}

export class BoardState {
	guesses: LetterGuess[][] = []
	active = true

	constructor(public word: string) {}

	guess(guess: string) {
		const letters = []
		const unusedLetters = [...this.word] // for double letters

		for (let i = 0; i < guess.length; i++) {
			if (this.word[i] == guess[i]) {
				delete unusedLetters[unusedLetters.indexOf(guess[i])]
			}
		}

		for (let i = 0; i < guess.length; i++) {
			const letter = guess[i]
			let color
			if (this.word[i] === letter) {
				color = LetterColor.Green
			} else if (BANNED_LETTERS.has(letter)) {
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

		if (this.word === guess) {
			this.active = false
		}
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
