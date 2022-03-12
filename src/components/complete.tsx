import { FunctionComponent, useState } from 'react'
import { Button, Modal, Nav } from 'react-bootstrap'
import { loadState } from '..'
import GameState, { LetterColor } from '../state'
import Letter from './letter'
import WordList from './word-list'

const Complete: FunctionComponent<{ state: GameState }> = ({ state }) => {
	const [show, setShow] = useState(false)

	const handleClose = () => setShow(false)

	if (state.wantsCompleteDialog) {
		state.wantsCompleteDialog = false
		setShow(true)
	}

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					{state.prefix === 'daily' && 'Daily '}Sortdle Complete!
				</Modal.Header>
				<Modal.Body>
					<WordList state={state} />
					<Button
						onClick={() => {
							handleClose()
							loadState()
						}}
						href="#random"
					>
						Play Random
					</Button>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default Complete
