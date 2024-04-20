import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAxios from "../utils/useAxios";
import Layout from '../components/layout';
import { Card, Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';

const JoinLeague = () => {
  const [leagues, setLeagues] = useState([]);
  const [error, setError] = useState('');
  const api = useAxios();
  const [leaguePassword, setLeaguePassword] = useState({});
  const [joinedLeagues, setJoinedLeagues] = useState(new Set());


  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await api.get("/leagues/");
        setLeagues(response.data);
      } catch (err) {
        console.error("Error fetching leagues:", err);
        setError("Error fetching leagues. Please try again later.");
      }
    };
  
    fetchLeagues();
  }, []);

  const handleJoinLeague = async (league) => {
    try {
      let data = {};
      if (!league.is_public) {
        data = { password: leaguePassword[league.id] };
      }
  
      const response = await api.post(`/leagues/join/${league.id}/`, data);
      if (response.status === 200 || response.status === 201) {

        setLeagues(leagues => leagues.filter(l => l.id !== league.id));
  
    
        setJoinedLeagues(prev => new Set([...prev, league.id]));
        alert('Successfully joined the league');
      }
    } catch (err) {
      console.error("Failed to join league:", err);
      setError("Failed to join league. Check the password for private leagues.");
    }
  };
  
  return (
    <Layout >
      <Container>
        <h2 className='text-center mb-4'>Join a League</h2>
        {/* <Row xs={1} md={2} lg={3} className="g-4"> */}
          {leagues.map((league) => (
            <Col key={league.id}>
              <Card>
                <Card.Body>
                  <Card.Title className='card-title text-center'>{league.name}</Card.Title>
                  <Card.Text className='card-text'>
                    {league.description}
                  </Card.Text>
                  {!joinedLeagues.has(league.id) && (
                    league.is_public ? (
                      <Button variant="primary" onClick={() => handleJoinLeague(league)}>Join League</Button>
                    ) : (
                      <Form>
                        <Form.Group>
                          <Form.Control 
                            type="password" 
                            placeholder="League Password" 
                            onChange={(e) => setLeaguePassword({ ...leaguePassword, [league.id]: e.target.value })}
                          />
                        </Form.Group>
                        <div className="d-flex justify-content-center mt-2">
                        <Button variant="success align-center" onClick={() => handleJoinLeague(league)}>Join Private League</Button>
                        </div>
                      </Form>
                    )
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        {/* </Row> */}
        {error && <Alert variant="danger">{error}</Alert>}
      </Container>
    </Layout>
  );
};
export default JoinLeague;

