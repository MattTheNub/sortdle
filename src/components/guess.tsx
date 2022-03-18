import { FunctionComponent } from 'react'
import { LetterColor } from '../state'
import Letter from './letter'

let allowedWords: Set<string> | null = null
import('../assets').then(assets => {
	allowedWords = assets.allowedWords
})

const Guess: FunctionComponent<{
	data?: { letter: string; color: LetterColor | null }[]
	active?: boolean
}> = ({ data, active }) => {
	const letters: JSX.Element[] = []
	const guess = data?.map(e => e.letter).join('')

	for (let i = 0; i < 5; i++) {
		if (data?.[i]) {
			letters.push(
				<Letter
					key={i}
					color={data[i].color}
					red={
						guess?.length === 5 &&
						allowedWords !== null &&
						!allowedWords.has(guess)
					}
					active={active}
				>
					{data[i].letter}
				</Letter>,
			)
		} else {
			letters.push(<Letter key={i} color={null} active={active} />)
		}
	}

	return <div className={`guess ${active ? 'active' : ''}`}>{letters}</div>
}

export default Guess
