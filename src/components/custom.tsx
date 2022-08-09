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
const Custom: FunctionComponent<{
	type: 'nav' | 'button'
	onPlay?: (() => any) | null | undefined
}> = ({ type, onPlay, children }) => {
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
		} else if (
			(document.querySelector('#seeded-word') as HTMLInputElement).checked
		) {
			setGameState(
				await GameState.custom(
					settings,
					(document.querySelector('#seed-input') as HTMLInputElement).value
						.toLowerCase()
						.trim(),
				),
			)
		} else {
			setGameState(await GameState.custom(settings))
		}
		if (onPlay) {
			onPlay()
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
			{type == 'nav' ? (
				<Nav.Link
					onClick={e => {
						;(e.target as HTMLInputElement)?.blur()
						handleShow()
					}}
					active={window.location.hash === '#custom'}
				>
					{children}
				</Nav.Link>
			) : (
				<Button onClick={handleShow}>{children}</Button>
			)}
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>Custom Sortdle</Modal.Header>
				<Modal.Body>
					{showContinue && (
						<Button
							variant="primary"
							href="#custom"
							onClick={() => {
								if (onPlay) {
									onPlay()
								}
								handleClose()
							}}
						>
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
							<Form.Check
								name="words"
								id="seeded-word"
								type="radio"
								label={
									<>
										Seed:{' '}
										<Form.Control
											type="text"
											id="seed-input"
											onClick={() =>
												((
													document.querySelector(
														'#seeded-word',
													) as HTMLInputElement
												).checked = true)
											}
											defaultValue={Math.floor(Math.random() * 1e10).toString()}
										/>
										<Button
											variant="secondary"
											onClick={() => {
												;(
													document.querySelector(
														'#seeded-word',
													) as HTMLInputElement
												).checked = true
												;(
													document.querySelector(
														'#seed-input',
													) as HTMLInputElement
												).value = Math.floor(Math.random() * 1e10).toString()
											}}
										>
											Randomize
										</Button>
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
