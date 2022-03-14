import { FunctionComponent } from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import Help from './help'

const SortdleNav: FunctionComponent<{ mode: 'top' | 'grid' }> = ({ mode }) => (
	<Navbar
		className={`${mode}-nav`}
		{...(mode === 'top' && { sticky: 'top' })}
		variant="dark"
		bg="dark"
		expand
	>
		<Container>
			<Navbar.Brand href="#daily">Sortdle</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav>
					<Nav.Link href="#daily" active={window.location.hash !== '#random'}>
						Daily
					</Nav.Link>
					<Nav.Link href="#random" active={window.location.hash === '#random'}>
						Random
					</Nav.Link>
					<Help />
				</Nav>
			</Navbar.Collapse>
		</Container>
	</Navbar>
)

export default SortdleNav
