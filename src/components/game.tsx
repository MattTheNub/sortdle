import { FunctionComponent } from 'react'
import { StateContext } from '../context'
import GameState from '../state'
import Board from './board'
import Complete from './complete'
import Custom from './custom'
import Fail from './fail'
import Guess from './guess'
import Keyboard from './keyboard'
import SortdleNav from './nav'
import { update } from '..'

const Game: FunctionComponent<{ state: GameState }> = ({ state }) => (
	<StateContext.Provider value={state}>
		<SortdleNav mode="top" />
		<Complete />
		<Fail />
		<Custom type="onLoad" />
		<div className="game">
			{state.boards.map((board, i) => {
				const guesses = []

				for (let j = 0; j < 11; j++) {
					if (
						!board.guesses[j] &&
						(j == 0 || board.guesses[j - 1]) &&
						board.active
					) {
						guesses.push(
							<Guess
								key={j}
								data={[...state.curGuess].map(letter => ({
									letter,
									color: null,
								}))}
								active
							/>,
						)
					} else {
						guesses.push(
							<Guess
								key={j}
								hidden={board.isHidden(j)}
								data={board.guesses[j]}
								toggleHidden={() => {
									if (board.guesses[j]) {
										board.toggleGuess(j)
										update()
									}
								}}
							/>,
						)
					}
				}

				return <Board key={i}>{guesses}</Board>
			})}
			<SortdleNav mode="grid" />
		</div>
		<Keyboard />
	</StateContext.Provider>
)

export default Game
