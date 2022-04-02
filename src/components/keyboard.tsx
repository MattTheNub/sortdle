import { FunctionComponent, useContext, useState } from 'react'
import { Button, CloseButton } from 'react-bootstrap'
import { update } from '..'
import { BANNED_LETTERS } from '../constants'
import { StateContext } from '../context'
import GameState, { LetterColor } from '../state'
import Guess from './guess'

const Keyboard: FunctionComponent = () => {
	const state = useContext(StateContext)
	const [show, setShow] = useState(false)

	return (
		<>
			<Button
				className="keyboard-btn"
				variant="outline-light"
				onClick={() => setShow(true)}
			>
				Keyboard
			</Button>

			<div
				className={`keyboard-popup ${show ? 'keyboard-show' : 'keyboard-hide'}`}
			>
				<CloseButton onClick={() => setShow(false)} />
				<div className="keyboard-input">
					<Guess
						data={[...state.curGuess].map(letter => ({
							letter,
							color: null,
						}))}
						active
					/>
				</div>
				<div className="keyboard">
					{['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].map((row, i) => (
						<div className="keyboard-row" key={i}>
							{i === 2 && (
								<Button
									variant="secondary"
									className="keyboard-key"
									size="sm"
									onClick={() => {
										state.curGuess = state.curGuess.slice(
											0,
											state.curGuess.length - 1,
										)
										update()
									}}
								>
									Del
								</Button>
							)}
							{[...row].map((letter, j) => {
								let colorClass = ''

								if (state.settings.blues && BANNED_LETTERS.has(letter)) {
									colorClass = 'key-blue'
								} else {
									// check all letters were grey the last time
									// this letter was guessed
									const guesses = state.guesses()

									for (let i = guesses.length - 1; i >= 0; i--) {
										if (guesses[i].includes(letter)) {
											let greenYellow = 0
											let grey = 0
											for (const board of state.boards) {
												if (
													board.guesses[i]?.some(
														guess =>
															guess.letter === letter &&
															guess.color !== LetterColor.Grey,
													)
												) {
													greenYellow++
												} else if (
													board.guesses[i]?.some(
														guess =>
															guess.letter === letter &&
															guess.color === LetterColor.Grey,
													)
												) {
													grey++
												}
												if (
													board.guesses[i] &&
													!board.active &&
													board.word.includes(letter)
												) {
													greenYellow--
												}
											}

											if (greenYellow > 0) {
												colorClass = 'key-green-yellow'
											} else if (grey > 0) {
												colorClass = 'key-inactive'
											}
											break
										}
									}
								}

								return (
									<Button
										variant="secondary"
										className={`keyboard-key ${colorClass}`}
										size="sm"
										onClick={() => {
											if (state.curGuess.length < 5) {
												state.curGuess += letter
												update()
											}
										}}
										key={j}
									>
										{letter}
									</Button>
								)
							})}
							{i === 2 && (
								<Button
									variant="secondary"
									className="keyboard-key"
									size="sm"
									onClick={() => {
										if (state.submit()) {
											setShow(false)
										}
										update()
									}}
								>
									Enter
								</Button>
							)}
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default Keyboard
