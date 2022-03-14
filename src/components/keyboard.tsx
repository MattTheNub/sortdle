import { FunctionComponent, useState } from 'react'
import { Button, CloseButton } from 'react-bootstrap'
import { update } from '..'
import GameState from '../state'
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
							{[...row].map(letter => (
								<Button
									variant="secondary"
									className="keyboard-key"
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
							))}
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
