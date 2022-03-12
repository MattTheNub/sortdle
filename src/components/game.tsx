import { FunctionComponent } from 'react'
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { loadState } from '..'
import GameState from '../state'
import Board from './board'
import Complete from './complete'
import Fail from './fail'
import Guess from './guess'
import Help from './help'

const Game: FunctionComponent<{ state: GameState }> = ({ state }) => (
	<>
		<Navbar sticky="top" variant="dark" bg="dark" expand>
			<Container>
				<Navbar.Brand href="#daily">Sortdle</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav>
						<Nav.Link href="#daily" active={window.location.hash !== '#random'}>
							Daily
						</Nav.Link>
						<Nav.Link
							href="#random"
							active={window.location.hash === '#random'}
						>
							Random
						</Nav.Link>
						<Help />
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
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
		</div>
	</>
)

export default Game
