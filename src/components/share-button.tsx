import { FunctionComponent, useContext, useState } from 'react'
import { Button } from 'react-bootstrap'
import { StateContext } from '../context'
import GameState, { LetterColor } from '../state'
import { isMobile } from '../util'

function generateText(state: GameState) {
	let text = ''
	for (let i = 0; i < state.guessCount(); i++) {
		for (const board of state.boards) {
			for (const letter of board.guesses[i] ?? new Array(5)) {
				switch (letter?.color) {
					case undefined:
						text += '⬛'
						break

					case LetterColor.Grey:
					case LetterColor.Blue:
						text += '⬜'
						break

					case LetterColor.Yellow:
						text += '🟨'
						break

					case LetterColor.Green:
						text += '🟩'
						break
				}
			}
			text += ' '
		}
		text += '\n'
	}

	return text
}

function generateImage(state: GameState) {
	const TEXT_HEIGHT = 36
	return new Promise<Blob | null>(resolve => {
		const canvas = document.createElement('canvas')
		canvas.width = 35 * 5 * 5 - 15
		canvas.height = 32 * state.guessCount() + 5 + TEXT_HEIGHT
		const ctx = canvas.getContext('2d')

		if (!ctx) {
			resolve(null)
			return
		}

		state.boards.forEach((board, i) => {
			board.guesses.forEach((guess, j) => {
				guess.forEach((letter, k) => {
					switch (letter?.color) {
						case undefined:
							return

						case LetterColor.Grey:
						case LetterColor.Blue:
							ctx.fillStyle = '#444'
							break

						case LetterColor.Yellow:
							ctx.fillStyle = '#f5b811'
							break

						case LetterColor.Green:
							ctx.fillStyle = '#4ba118'
							break
					}

					ctx.fillRect(
						i * 35 * 5 + k * 32 + 2,
						j * 32 + 2 + TEXT_HEIGHT,
						28,
						28,
					)
				})
			})
		})

		const text = `Daily Sortdle #${state.dailyNumber}`
		ctx.fillStyle = 'white'
		ctx.strokeStyle = 'black'
		ctx.font = '24px sans-serif'
		ctx.fillText(text, 0, 24)
		ctx.strokeText(text, 0, 24)

		canvas.toBlob(blob => {
			resolve(blob)
		}, 'image/png')
	})
}

const Share: FunctionComponent = () => {
	const state = useContext(StateContext)
	const [text, setText] = useState<string | null>(null)
	const [image, setImage] = useState<Blob | null>(null)

	if (!image) {
		generateImage(state).then(image => setImage(image))
	}

	const shareText = () => {
		const text = generateText(state)
		const shareData = { title: `Daily Sortdle #${state.dailyNumber}`, text }
		if (isMobile() && navigator.share) {
			navigator.share(shareData).catch(console.error)
		}

		setText(text)
	}
	const shareImage = () => {
		if (!image) return

		const shareData = {
			title: `Daily Sortdle #${state.dailyNumber}`,
			files: [new File([image], `sortdle-${state.dailyNumber}.png`)],
		}
		if (navigator.share) {
			navigator.share(shareData).catch(console.error)
		}
	}

	return (
		<>
			<Button onClick={shareText}>Share Text</Button>
			{image && <Button onClick={shareImage}>Share Image</Button>}
			{image && (
				<Button as="a" href={URL.createObjectURL(image)} download="sortdle.png">
					Save Image
				</Button>
			)}
			{text && (
				<pre className="share-text">
					Daily Sortdle #{state.dailyNumber}
					{'\n'}
					{text}
				</pre>
			)}
		</>
	)
}

export default Share
