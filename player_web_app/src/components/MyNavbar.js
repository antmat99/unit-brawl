import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Button } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { PLAYERPREFIX } from '../utils';

function MyNavbar(props) {

    return (
        <Navbar className='navbar color-nav py-1' variant='dark' expand='sm' fixed='top' >
            <Link to={PLAYERPREFIX + '/'} className='navbar-title'>
                <Navbar.Brand>
                    Unit Brawl
                </Navbar.Brand>
            </Link>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    {
                        props.loggedIn ?
                            <>
                                <NavLink to={PLAYERPREFIX + '/leaderboard'} className='navbar-menu-item'>Leaderboard</NavLink>
                                <NavLink to={PLAYERPREFIX + '/labs'} className='navbar-menu-item'>Labs</NavLink>
                                <NavLink to={PLAYERPREFIX + '/shop'} className='navbar-menu-item'>Shop</NavLink>
                            </>
                            :
                            ''
                    }
                    <NavLink to={PLAYERPREFIX + '/about'} className='navbar-menu-item'>About</NavLink>
                    {
                        props.loggedIn ?
                            <NavLink to={PLAYERPREFIX + '/profile'} className='navbar-menu-item'>Profile</NavLink>
                            :
                            ''
                    }
                </Navbar.Text>
                {
                    props.loggedIn ?
                        <Button onClick={() => props.doLogOut()} className='margin-right'>Logout</Button> :
                        <Button href={PLAYERPREFIX + '/login'} className='margin-right'>Login</Button>

                }
            </Navbar.Collapse>
        </Navbar>
    );

}

export default MyNavbar;