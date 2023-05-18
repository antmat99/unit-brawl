import logo from './logo.svg';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MyNavbar from './components/MyNavbar';
import HomePage from './components/HomePage';
import Labs from './components/labs/Labs';
import Avatars from './components/avatars/Avatars';
import Reports from './components/reports/Reports';
import Leaderboard from './components/common/Leaderboard';
import LeaderboardSection from './components/leaderboard/LeaderboardSection';
import { useState,useEffect } from 'react';
import API from './API';
import LoginPage from './components/login/LoginPage'

import { ADMINPREFIX } from './components/utils';



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
      navigate(ADMINPREFIX + '/');
    } catch (e) {
      throw e; //catch in LoginPage
    }

  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    navigate('/');
  }

  // check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here there are user info, if already logged in
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        console.log(err.error);
      }
    };
    checkAuth();
  }, []);

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
                  <Route path={ADMINPREFIX + '/'} element={
                    <HomePage />
                  } />
                  <Route path={ADMINPREFIX + '/leaderboard'} element={
                    <LeaderboardSection />
                  } />
                  <Route path={ADMINPREFIX + '/labs'} element={
                    <Labs />
                  } />
                  <Route path={ADMINPREFIX + '/avatars'} element={
                    <Avatars />
                  } />
                  <Route path={ADMINPREFIX + '/reports'} element={
                    <Reports />
                  } />
                </>
                :
                <>
                  <Route path={ADMINPREFIX + '/'} element={
                    <HomePage />
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