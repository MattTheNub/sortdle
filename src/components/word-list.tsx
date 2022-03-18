import { FunctionComponent, useState } from 'react'
import GameState from '../state'

const WordList: FunctionComponent<{ state: GameState }> = ({ state }) => {
	if (!state.boards[0].guesses.length) {
		return <></>
	}

	return (
		<>
			{state.boards.map((board, i) => (
				<p
					key={i}
					className={`answer ${
						board.active ? 'answer-incorrect' : 'answer-correct'
					}`}
				>
					{board.loadedWord}
				</p>
			))}
		</>
	)
}

export default WordList
