import { FunctionComponent, useContext } from 'react'
import { BANNED_LETTERS } from '../constants'
import { StateContext } from '../context'
import { LetterColor } from '../state'
import { getColorClass } from '../util'

const Letter: FunctionComponent<{
	color: LetterColor | null
	red?: boolean
	active?: boolean
}> = ({ red, color, children, active }) => {
	const state = useContext(StateContext)

	return (
		<div
			className={`letter-container ${getColorClass(color)} ${
				active ? 'active' : ''
			}`}
		>
			<span
				className={`letter ${
					red
						? 'typing-letter-red'
						: color == null &&
						  children &&
						  state.settings.blues &&
						  BANNED_LETTERS.has(children.toString())
						? 'typing-letter-blue'
						: ''
				}`}
			>
				{children}
			</span>
		</div>
	)
}

export default Letter
