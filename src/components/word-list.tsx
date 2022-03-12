import { FunctionComponent, useState } from 'react'
import { Button, Modal, Nav } from 'react-bootstrap'
import GameState, { LetterColor } from '../state'
import Letter from './letter'

const WordList: FunctionComponent<{ state: GameState }> = ({ state }) => {
	return (
		<>
			{state.boards.map((board, i) => (
				<p
					key={i}
					className={`answer ${
						board.active ? 'answer-incorrect' : 'answer-correct'
					}`}
				>
					{board.word}
				</p>
			))}
		</>
	)
}

export default WordList
