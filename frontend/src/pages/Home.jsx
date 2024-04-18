import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/authContext'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Layout from '../components/layout';
import { jwtDecode } from 'jwt-decode'
import Card from 'react-bootstrap/Card';
import { Container, Row, Col } from 'react-bootstrap';



const Home = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");

  let user_id = null;
  if (user) {
    const decoded = jwtDecode(token);
    user_id = decoded.user_id;
  }

  return (
    <Layout>
      <div className="hero-section text-white p-3">
        <h1>Director of Player Personnel</h1>
        <p>Manage all players on a football field while playing in highly competetive leagues!</p>
      </div>
      <div className='form-container'>
        {user ? (
          <>
            <h2>Hello, {user.username}!</h2>
            <p>Welcome back to your Fantasy Football Dashboard.</p>
            <Link to="/profile" className="btn btn-info">Go to Profile</Link>
            <button onClick={logoutUser} className="btn btn-danger mx-2">Logout</button>
          </>
        ) : (
          <>
            <h2></h2>
            
            <p>Create your account today to get access to our features.</p>
            <Link to="/signup" className="btn btn-primary m-2">Sign Up</Link>
            <p>Already have an account?</p>
            <Link to="/login" className="btn btn-success m-2">Login</Link>
            
          </>
        )}
      </div>
      <div className="features-section my-5 text-white">
      <Container>
        <Row className="text-center">
          <Col md={4} className="p-3">
            <Card className="text-white">
              <Card.Body>
                <Card.Title>Scoring for ALL Players</Card.Title>
                <Card.Text>
                  Every player in an NFL game contributes to your team's total score.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="p-3">
            <Card className="text-white">
              <Card.Body>
                <Card.Title>Public or Private Leagues</Card.Title>
                <Card.Text>
                  Compete against friends or other players around the globe for the top spot in the league.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="p-3">
            <Card className="text-white">
              <Card.Body>
                <Card.Title>Full Control</Card.Title>
                <Card.Text>
                  Manage your roster, make trades, and set your starters with full control over your lineup.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>      
    </Layout>
  );
}

export default Home;


