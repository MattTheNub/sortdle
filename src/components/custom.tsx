import { FormEvent, FunctionComponent, useContext, useState } from 'react'
import { Button, Form, Modal, Nav, ToggleButton } from 'react-bootstrap'
import { setGameState, update } from '..'
import { StateContext } from '../context'
import { dailyNumber, getDailySeed } from '../state'

const PastDaily: FunctionComponent = () => {
	const items = []
	for (let i = 1; i < dailyNumber(); i++) {
		items.push(
			<option key={i} value={i}>
				Daily Sortdle #{i}
			</option>,
		)
	}

	return (
		<Form.Select
			id="past-daily-word-select"
			onClick={() =>
				((
					document.querySelector('#past-daily-word') as HTMLInputElement
				).checked = true)
			}
		>
			{items}
		</Form.Select>
	)
}

const Custom: FunctionComponent = () => {
	const [show, setShow] = useState(false)
	const [showContinue, setShowContinue] = useState(false)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const { default: GameState } = await import('../state')

		const settings = {
			blues: (document.querySelector('#blue-letter-toggle') as HTMLInputElement)
				.checked,
			swaps: (document.querySelector('#swap-toggle') as HTMLInputElement)
				.checked,
		}

		if (
			(document.querySelector('#past-daily-word') as HTMLInputElement).checked
		) {
			setGameState(
				await GameState.custom(
					settings,
					getDailySeed(
						parseInt(
							(
								document.querySelector(
									'#past-daily-word-select',
								) as HTMLInputElement
							).value,
						),
					).toString(),
				),
			)
		} else {
			setGameState(await GameState.custom(settings))
		}
		handleClose()
		history.replaceState(null, '', `${window.location.pathname}#custom`)
	}

	if (localStorage.getItem('customSeed') !== null) {
		import('../state').then(async ({ default: GameState }) => {
			const state = await GameState.load('custom')

			if (showContinue !== state.active()) {
				setShowContinue(state.active())
			}
		})
	}

	let defaultSettings = {
		blues: true,
		swaps: true,
	}
	if (localStorage.getItem('customSettings') !== null) {
		defaultSettings = JSON.parse(
			localStorage.getItem('customSettings') as string,
		)
	}

	return (
		<>
			<Nav.Link
				onClick={handleShow}
				active={window.location.hash === '#custom'}
			>
				Custom
			</Nav.Link>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>Custom Sortdle</Modal.Header>
				<Modal.Body>
					{showContinue && (
						<Button variant="primary" href="#custom" onClick={handleClose}>
							Continue Previous
						</Button>
					)}
					<Form onSubmit={handleSubmit}>
						<Form.Group>
							<Form.Label as="h3">Words</Form.Label>
							<Form.Check
								name="words"
								id="random-word"
								type="radio"
								label="Random"
								defaultChecked
							/>
							<Form.Check
								name="words"
								id="past-daily-word"
								type="radio"
								label={
									<>
										Past Daily: <PastDaily />
									</>
								}
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label as="h3">Rules</Form.Label>
							<Form.Check
								id="blue-letter-toggle"
								type="switch"
								label="Blue Letters"
								defaultChecked={defaultSettings.blues}
							/>
							<Form.Check
								id="swap-toggle"
								type="switch"
								label="Swaps"
								defaultChecked={defaultSettings.swaps}
							/>
						</Form.Group>

						<Form.Group>
							<Button type="submit" variant="success">
								Create
							</Button>
							<Button onClick={handleClose} variant="danger">
								Cancel
							</Button>
						</Form.Group>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default Custom
