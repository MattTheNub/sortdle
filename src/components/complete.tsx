import { FunctionComponent, useContext, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { loadState } from '..'
import { StateContext } from '../context'
import GameState from '../state'
import Custom from './custom'
import ShareButton from './share-button'
import WordList from './word-list'

const Complete: FunctionComponent = () => {
	const state = useContext(StateContext)
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
					<WordList />
					<Custom type="button" onPlay={handleClose}>
						Play Custom
					</Custom>
					{state.prefix === 'daily' && <ShareButton />}
				</Modal.Body>
			</Modal>
		</>
	)
}

export default Complete
