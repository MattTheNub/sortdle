import { FunctionComponent, useState } from 'react'
import { Modal, Nav } from 'react-bootstrap'
import { BANNED_LETTERS } from '../constants'
import { LetterColor } from '../state'
import Letter from './letter'

const Help: FunctionComponent = () => {
	const [show, setShow] = useState(false)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	return (
		<>
			<Nav.Link onClick={handleShow}>Help</Nav.Link>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>Sortdle</Modal.Header>
				<Modal.Body>
					<h3>Normal Hints</h3>
					<div style={{ display: 'inline-flex', flexFlow: 'row' }}>
						<Letter color={LetterColor.Green}>B</Letter>
						<Letter color={LetterColor.Yellow}>U</Letter>
						<Letter color={LetterColor.Yellow}>L</Letter>
						<Letter color={LetterColor.Grey}>K</Letter>
						<Letter color={LetterColor.Grey}>Y</Letter>
					</div>
					<p>
						In this example, the letter B is green, meaning it is in the correct
						position. The letters U and L yellow, meaning they are in the word,
						but in the wrong positions. The letters K and Y are grey, meaning
						they are not in the word.
					</p>
					<h3>
						Blue letters:{' '}
						<div style={{ display: 'inline-flex', flexFlow: 'row' }}>
							{[...BANNED_LETTERS.values()].map((val, i) => (
								<Letter key={i} color={LetterColor.Blue}>
									{val}
								</Letter>
							))}
						</div>
					</h3>
					<p>
						These letters appear as blue instead of grey or yellow. This means
						that they <em>might</em> be in the word, but if they are, they are
						not in the correct position. No more than <strong>three</strong>{' '}
						blue letters will appear in any word.
					</p>
					<h3>Swaps</h3>
					<p>
						Every time you make a guess, two words will swap at random without
						your knowledge (if you only have two words left, this only happens
						50% of the time). This means a board might start displaying new
						hints that are inconsistent with its previous hints.
					</p>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default Help
