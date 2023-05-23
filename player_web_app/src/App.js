import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import MyNavbar from './components/MyNavbar';
import Profile from './components/profile/Profile';
import HomePage from './components/HomePage';
import Shop from './components/shop/Shop';
import Labs from './components/labs/Labs';
import LeaderboardSection from './components/leaderboard/LeaderboardSection';
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/login/RegisterPage';
import About from './components/About'
import { useState, useEffect } from 'react';
import API from './API';

import { PLAYERPREFIX } from './utils';

function App() {

  return (
    <Router>
      <Main />
    </Router>
  );
}



function Main() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials)
      setLoggedIn(true);
      setUser(user);
      navigate(PLAYERPREFIX + '/');
    } catch (e) {
      throw e; //catch in LoginPage
    }

  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    navigate(PLAYERPREFIX + '/');
  }

  const doRegister = async (user) => {
    await API.register(user);
    setLoggedIn(false);
    setUser({});
    navigate(PLAYERPREFIX + '/login');
  }

  // check if user is authenticated
/*   useEffect(() => {
    const checkAuth = async () => {
      try {
        // here we have the user info, if already logged in
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        console.log(err.error);
      }
    }; 
    checkAuth();
  }, []); */

  return (
    <Container fluid>
      <Row>
        <Col>
          <MyNavbar loggedIn={loggedIn} doLogOut={doLogOut} />
        </Col>
      </Row>
      <Row className='below-nav'>
        <Col>
          <Routes>
            {
              loggedIn ?
                <>
                  <Route path={PLAYERPREFIX + '/'} element={
                    <HomePage loggedIn={loggedIn}/>
                  } />
                  <Route path={PLAYERPREFIX + '/profile'} element={
                    <Profile />
                  } />
                  <Route path={PLAYERPREFIX + '/shop'} element={
                    <Shop />
                  } />
                  <Route path={PLAYERPREFIX + '/labs'} element={
                    <Labs />
                  } />
                  <Route path={PLAYERPREFIX + '/leaderboard'} element={
                    <LeaderboardSection />
                  } />
                  <Route path={PLAYERPREFIX + '/about'} element={
                    <About/>
                  } />
                </>
                :
                <>
                  <Route path={PLAYERPREFIX + '/'}element={
                    <HomePage />
                  } />
                  <Route path={PLAYERPREFIX + '/about'} element={
                    <About/>
                  } />
                  <Route path={PLAYERPREFIX + '/register'} element={
                    <RegisterPage doRegister={doRegister}/>
                  } />
                  <Route
                    path="*"
                    element={
                      <LoginPage doLogIn={doLogIn} />
                    }
                  />
                </>
            }

          </Routes>
        </Col>
      </Row>
    </Container>
  )


}


export default App;
