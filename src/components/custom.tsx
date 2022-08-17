import { FormEvent, FunctionComponent, useContext, useState } from 'react'
import { Button, Form, Modal, Nav, ToggleButton } from 'react-bootstrap'
import { setGameState, update } from '..'
import { StateContext } from '../context'
import { dailyNumber, getDailySeed } from '../state'

function tryParseURL() {
	const params = new URLSearchParams(window.location.hash.slice(1))

	if (params.has('seed')) {
		return {
			seed: params.get('seed') as string,
			blues: params.get('blues') !== '0',
			swaps: params.get('swaps') !== '0',
		}
	} else {
		return null
	}
}

const PastDaily: FunctionComponent<{ disabled: boolean | undefined }> = ({
	disabled,
}) => {
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
			disabled={disabled}
			onClick={() => {
				if (!disabled) {
					;(
						document.querySelector('#past-daily-word') as HTMLInputElement
					).checked = true
				}
			}}
		>
			{items}
		</Form.Select>
	)
}
const Custom: FunctionComponent<{
	type: 'nav' | 'button' | 'onLoad'
	onPlay?: (() => any) | null | undefined
}> = ({ type, onPlay, children }) => {
	const linkData = type === 'onLoad' ? tryParseURL() : null
	const [show, setShow] = useState(linkData !== null)
	const [showContinue, setShowContinue] = useState(false)
	const [link, setLink] = useState<null | string>(null)

	const updateLink = () => {
		setLink(
			`${window.location.href.split('#')[0]}#seed=${encodeURIComponent(
				(
					document.querySelector('#seed-input') as HTMLInputElement
				).value.toLowerCase(),
			).trim()}&blues=${
				(document.querySelector('#blue-letter-toggle') as HTMLInputElement)
					.checked
					? 1
					: 0
			}&swaps=${
				(document.querySelector('#swap-toggle') as HTMLInputElement).checked
					? 1
					: 0
			}`,
		)
	}

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
			{type === 'nav' ? (
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
				type === 'button' && <Button onClick={handleShow}>{children}</Button>
			)}
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					{type === 'onLoad' ? 'Shared Sortdle' : 'Custom Sortdle'}
				</Modal.Header>
				<Modal.Body>
					{showContinue &&
						(type === 'onLoad' ? (
							<span className="custom-overwrite-warning">
								WARNING: This will overwrite your current custom Sortdle.
							</span>
						) : (
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
						))}
					<Form onSubmit={handleSubmit}>
						<Form.Group>
							<Form.Label as="h3">Words</Form.Label>
							<Form.Check
								name="words"
								id="random-word"
								type="radio"
								label="Random"
								defaultChecked={type !== 'onLoad'}
								onClick={() => setLink(null)}
								disabled={type === 'onLoad'}
							/>
							<Form.Check
								name="words"
								id="past-daily-word"
								type="radio"
								disabled={type === 'onLoad'}
								onClick={() => setLink(null)}
								label={
									<>
										Past Daily: <PastDaily disabled={type === 'onLoad'} />
									</>
								}
							/>
							<Form.Check
								name="words"
								id="seeded-word"
								type="radio"
								defaultChecked={type === 'onLoad'}
								label={
									<>
										Seed:{' '}
										<Form.Control
											type="text"
											id="seed-input"
											disabled={type === 'onLoad'}
											onClick={() =>
												((
													document.querySelector(
														'#seeded-word',
													) as HTMLInputElement
												).checked = true)
											}
											onChange={() => {
												if (link) updateLink()
											}}
											defaultValue={
												linkData?.seed ??
												Math.floor(Math.random() * 1e10).toString()
											}
										/>
										{type !== 'onLoad' && (
											<>
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
														).value = Math.floor(
															Math.random() * 1e10,
														).toString()
														if (link) updateLink()
													}}
												>
													Randomize
												</Button>
												<Button
													variant="secondary"
													onClick={() => {
														;(
															document.querySelector(
																'#seeded-word',
															) as HTMLInputElement
														).checked = true

														if (link) {
															setLink(null)
														} else {
															updateLink()
														}
													}}
												>
													{link ? 'Hide' : 'Show'} Link
												</Button>
												{link && (
													<>
														<Form.Control
															type="text"
															id="seed-link"
															disabled
															value={link as string}
														/>
														<Button
															variant="secondary"
															onClick={() => {
																navigator.clipboard.writeText(link)
															}}
														>
															Copy
														</Button>
													</>
												)}
											</>
										)}
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
								defaultChecked={linkData?.blues ?? defaultSettings.blues}
								disabled={type === 'onLoad'}
								onClick={() => {
									if (link) updateLink()
								}}
							/>
							<Form.Check
								id="swap-toggle"
								type="switch"
								label="Swaps"
								defaultChecked={linkData?.swaps ?? defaultSettings.swaps}
								disabled={type === 'onLoad'}
								onClick={() => {
									if (link) updateLink()
								}}
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
