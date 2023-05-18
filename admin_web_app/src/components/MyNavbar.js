import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar,Button } from 'react-bootstrap';
import { Link,NavLink } from 'react-router-dom';
import './../App.css';
import { ADMINPREFIX  } from './utils';

function MyNavbar(props) {
    return (
        <Navbar className='color-nav py-1' variant='dark' expand='sm' fixed='top' >
            <Link to={ADMINPREFIX + '/'} className='navbar-title'>
                <Navbar.Brand>
                    Unit Brawl (admin)
                </Navbar.Brand>
            </Link>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    {
                        props.loggedIn ?
                            <>
                                <NavLink to={ADMINPREFIX + '/leaderboard'} className='navbar-menu-item'>Leaderboard</NavLink>
                                <NavLink to={ADMINPREFIX + '/labs'} className='navbar-menu-item'>Labs</NavLink>
                                <NavLink to={ADMINPREFIX + '/avatars'} className='navbar-menu-item'>Avatars</NavLink>
                                <NavLink to={ADMINPREFIX + '/reports'} className='navbar-menu-item'>Reports</NavLink>
                            </>
                            :
                            ''
                    }
                </Navbar.Text>
                {
                    props.loggedIn ?
                        <Button onClick={() => props.doLogOut()}>Logout</Button> :
                        <Button href={ADMINPREFIX + '/login'}>Login</Button>

                }
            </Navbar.Collapse>
        </Navbar >
    );
}

export default MyNavbar;