import { FunctionComponent, useState } from 'react'
import { Modal, Nav } from 'react-bootstrap'
import { BANNED_LETTERS } from '../constants'
import { LetterColor } from '../state'
import Letter from './letter'

const Help: FunctionComponent = () => {
	const [show, setShow] = useState(false)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	if (localStorage.getItem('seenTutorial') !== 'true') {
		localStorage.setItem('seenTutorial', 'true')
		setShow(true)
	}

	return (
		<>
			<Nav.Link onClick={handleShow}>Help</Nav.Link>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>How to Play Sortdle</Modal.Header>
				<Modal.Body>
					<p>
						In Sortdle, your aim is to guess five different five-letter words
						simultaneously. You get 11 tries to do this. On each try, you can
						make <strong>one</strong> guess. The same guess appears on{' '}
						<strong>all five</strong> boards, showing you how close you were to
						each word.
					</p>
					<h3>Normal Letters</h3>
					<p>For most letters, they will appear as one of:</p>
					<ul>
						<li>
							<strong>Grey:</strong> The letter is not anywhere in the word
						</li>
						<li>
							<strong>Yellow:</strong> The letter is in the word, but in the
							wrong spot
						</li>
						<li>
							<strong>Green:</strong> The letter is in the correct spot
						</li>
					</ul>
					<h3>
						Blue Letters:{' '}
						<div style={{ display: 'inline-flex', flexFlow: 'row' }}>
							{[...BANNED_LETTERS.values()].map((val, i) => (
								<Letter key={i} color={LetterColor.Blue}>
									{val}
								</Letter>
							))}
						</div>
					</h3>
					<p>
						For the six letters listed above, they will still appear as green if
						they are in the correct spot, but both grey and yellow hints are
						replaced with blue. A blue color does not tell you whether a letter
						is in the word; it only tells you that if it is, it is definitely in
						the wrong spot.
					</p>
					<p>
						You can guess as many blue letters as you want, but an answer will
						never contain more than <strong>three</strong> blue letters.
					</p>
					<h3>Example</h3>
					<div style={{ display: 'inline-flex', flexFlow: 'row' }}>
						<Letter color={LetterColor.Green}>A</Letter>
						<Letter color={LetterColor.Grey}>M</Letter>
						<Letter color={LetterColor.Yellow}>P</Letter>
						<Letter color={LetterColor.Green}>L</Letter>
						<Letter color={LetterColor.Blue}>E</Letter>
					</div>
					<p>
						In this example, we know that the two green letters are in the
						correct positions. The letter M is not in the word, while the letter
						P is. We do not know if the letter E is in the word, but the word
						definitely does not end with an E.
					</p>
					<h3>Swaps</h3>
					<p>
						To make the game more interesting, each time you make a guess, two
						words will swap at random (this always happens when at least 3
						boards are left, and happens half the time if only 2 are left). When
						a word swaps, a board will start displaying hints for its new word
						for future guesses, but its old hints will not change.
					</p>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default Help
