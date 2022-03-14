import { FunctionComponent } from 'react'
import GameState from '../state'
import Board from './board'
import Complete from './complete'
import Fail from './fail'
import Guess from './guess'
import Keyboard from './keyboard'
import SortdleNav from './nav'

const Game: FunctionComponent<{ state: GameState }> = ({ state }) => (
	<>
		<SortdleNav mode="top" />
		<Complete state={state} />
		<Fail state={state} />
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
						guesses.push(<Guess key={j} data={board.guesses[j]} />)
					}
				}

				return <Board key={i}>{guesses}</Board>
			})}
			<SortdleNav mode="grid" />
		</div>
		<Keyboard state={state} />
	</>
)

export default Game
