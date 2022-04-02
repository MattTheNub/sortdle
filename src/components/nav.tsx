import { FunctionComponent } from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import Help from './help'
import Custom from './custom'
// @ts-ignore
import icon from '../../assets/icon.png'
// @ts-ignore
import githubMark from '../../assets/github-mark.png'

const SortdleNav: FunctionComponent<{ mode: 'top' | 'grid' }> = ({ mode }) => (
	<Navbar
		className={`${mode}-nav`}
		{...(mode === 'top' && { sticky: 'top' })}
		variant="dark"
		bg="dark"
		expand
	>
		<Container>
			<Navbar.Brand href="#daily">
				<img className="icon" src={icon} />
				Sortdle
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse style={{ flexGrow: 1 }} id="basic-navbar-nav">
				<Nav style={{ flexGrow: 1 }}>
					<Nav.Link
						href="#daily"
						active={!['#random', '#custom'].includes(window.location.hash)}
					>
						Daily
					</Nav.Link>
					<Nav.Link href="#random" active={window.location.hash === '#random'}>
						Random
					</Nav.Link>
					<Custom />
					<Help />
					<div className="nav-right">
						<Nav.Link
							target="_blank"
							href="https://github.com/MattTheNub/sortdle"
						>
							<img style={{ height: '1.5rem' }} src={githubMark}></img>
						</Nav.Link>
					</div>
				</Nav>
			</Navbar.Collapse>
		</Container>
	</Navbar>
)

export default SortdleNav
