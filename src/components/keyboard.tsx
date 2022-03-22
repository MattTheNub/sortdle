import { FunctionComponent, useState } from 'react'
import { Button, CloseButton } from 'react-bootstrap'
import { update } from '..'
import { BANNED_LETTERS } from '../constants'
import GameState, { LetterColor } from '../state'
import Guess from './guess'

const Keyboard: FunctionComponent<{ state: GameState }> = ({ state }) => {
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
						<div className="keyboard-row">
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
							{[...row].map(letter => {
								let colorClass = ''

								if (BANNED_LETTERS.has(letter)) {
									colorClass = 'key-blue'
								} else {
									// check all letters were grey the last time
									// this letter was guessed
									const guesses = state.guesses()

									outer: for (let i = guesses.length - 1; i >= 0; i--) {
										if (guesses[i].includes(letter)) {
											for (const board of state.boards) {
												if (
													board.guesses[i]?.some(
														guess =>
															guess.letter === letter &&
															guess.color !== LetterColor.Grey,
													)
												) {
													break outer
												}
											}
											colorClass = 'key-inactive'
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
									onClick={async () => {
										if (await state.submit()) {
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
