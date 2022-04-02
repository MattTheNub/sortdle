import { FunctionComponent, useContext, useState } from 'react'
import { StateContext } from '../context'
import GameState from '../state'

const WordList: FunctionComponent = () => {
	const state = useContext(StateContext)
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
					{board.word}
				</p>
			))}
		</>
	)
}

export default WordList
