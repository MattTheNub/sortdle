import { FunctionComponent, useContext, useState } from 'react'
import { BANNED_LETTERS } from '../constants'
import { StateContext } from '../context'
import { LetterColor } from '../state'
import Letter from './letter'

let allowedWords: Set<string> | null = null
import('../assets').then(assets => {
	allowedWords = assets.allowedWords
})

const Guess: FunctionComponent<{
	data?: { letter: string; color: LetterColor | null }[]
	active?: boolean
	hidden?: boolean
	toggleHidden?: () => void
}> = ({ data, active, hidden, toggleHidden }) => {
	const state = useContext(StateContext)
	const letters: JSX.Element[] = []
	const guess = data?.map(e => e.letter).join('')

	for (let i = 0; i < 5; i++) {
		if (data?.[i]) {
			const red =
				guess?.length === 5 && allowedWords !== null && !allowedWords.has(guess)

			let inactive = false
			if (active && !BANNED_LETTERS.has(data[i].letter)) {
				const guesses = state.guesses()
				for (let j = guesses.length - 1; j >= 0; j--) {
					if (guesses[j].includes(data[i].letter)) {
						let greenYellow = 0
						let grey = 0
						for (const board of state.boards) {
							if (
								board.guesses[j]?.some(
									guess =>
										guess.letter === data[i].letter &&
										guess.color !== LetterColor.Grey,
								)
							) {
								greenYellow++
							} else if (
								board.guesses[j]?.some(
									guess =>
										guess.letter === data[i].letter &&
										guess.color === LetterColor.Grey,
								)
							) {
								grey++
							}
							if (
								board.guesses[j] &&
								!board.active &&
								board.word.includes(data[i].letter)
							) {
								greenYellow--
							}
						}

						if (greenYellow === 0 && grey > 0) {
							inactive = true
						}
						break
					}
				}
			}
			letters.push(
				<Letter
					key={i}
					color={data[i].color}
					red={red}
					active={active}
					inactive={inactive}
				>
					{data[i].letter}
				</Letter>,
			)
		} else {
			letters.push(<Letter key={i} color={null} active={active} />)
		}
	}

	return (
		<div
			className={`guess ${active ? 'active' : ''} ${
				hidden ? 'guess-hidden' : ''
			}`}
			onDoubleClick={toggleHidden}
		>
			{letters}
		</div>
	)
}

export default Guess
