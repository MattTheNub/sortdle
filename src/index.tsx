import './stylesheets/index.scss'
import { render } from 'react-dom'
import GameState from './state'
import { LETTERS } from './constants'
import Game from './components/game'
;(globalThis as any).state = null
declare var state: GameState

export function setGameState(newState: GameState) {
	state = newState
	update()
}

export async function loadState() {
	const { default: GameState, getDailySeed } = await import('./state')

	switch (window.location.hash.toLowerCase()) {
		case '#random':
			if (localStorage.getItem('randomSeed') !== null) {
				state = await GameState.load('random')
				if (!state.active()) {
					state = await GameState.random()
				}
			} else {
				state = await GameState.random()
			}
			break

		case '#custom':
			if (localStorage.getItem('customSeed') !== null) {
				state = await GameState.load('custom')
				if (!state.active()) {
					state = await GameState.custom(state.settings)
				}
			} else {
				window.location.replace('/')
			}
			break

		default:
			if (localStorage.getItem('dailySeed') === getDailySeed().toString()) {
				if (state?.prefix !== 'daily') {
					state = await GameState.load('daily')
					state.dialogCheck()
				}
			} else {
				state = await GameState.daily()
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
		if (event.ctrlKey) {
			state.curGuess = ''
		} else {
			state.curGuess = state.curGuess.slice(0, state.curGuess.length - 1)
		}
		update()
	} else if (event.code === 'Enter') {
		state.submit()
		update()
	}
})
