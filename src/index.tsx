import './stylesheets/index.scss'
import { render } from 'react-dom'
import GameState, { getDailySeed } from './state'
import Game from './components/game'
import { LETTERS } from './constants'

let state: GameState

export function loadState() {
	switch (window.location.hash.toLowerCase()) {
		case '#random':
			if (localStorage.getItem('randomSeed') !== null) {
				state = GameState.load('random')
				if (
					!state.boards.some(board => board.active) ||
					state.guessCount() >= 11
				) {
					state = GameState.random()
				}
			} else {
				state = GameState.random()
			}
			break

		default:
			if (localStorage.getItem('dailySeed') === getDailySeed().toString()) {
				state = GameState.load('daily')
			} else {
				state = GameState.daily()
			}
	}

	update()
}

loadState()
window.addEventListener('hashchange', loadState)

export function update() {
	state.save()
	render(
		<Game state={state} />,
		document.querySelector('#app') as HTMLDivElement,
	)
}

document.addEventListener('keypress', event => {
	if (LETTERS.has(event.key.toLowerCase()) && state.curGuess.length < 5) {
		state.curGuess += event.key.toLowerCase()
		update()
	}
})
document.addEventListener('keydown', event => {
	if (event.key === 'Backspace') {
		state.curGuess = state.curGuess.slice(0, state.curGuess.length - 1)
		update()
	} else if (event.code === 'Enter') {
		state.submit()
		update()
	}
})
