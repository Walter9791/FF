import React, { useState, useEffect } from 'react';
import useAxios from "../utils/useAxios";
import Layout from '../components/layout';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';

const MyLeagues = () => {
  const [pendingLeagues, setPendingLeagues] = useState([]);
  const [joinedLeagues, setJoinedLeagues] = useState([]);
  const [error, setError] = useState('');
  const api = useAxios();

  useEffect(() => {
    const fetchJoinedLeagues = async () => {
      try {
        const response = await api.get("/leagues/myleagues/");
        setJoinedLeagues(response.data);
      } catch (err) {
        console.error("Error fetching joined leagues:", err);
        setError("Error fetching joined leagues. Please try again later.");
      }
    };
  
    fetchJoinedLeagues();
  }, []);

  return (
    <Layout>
      <Container>
        <h2 className="text-center mb-4">My Leagues</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row xs={1} md={2} lg={3} className="g-4">
          {joinedLeagues.map((league) => (
            <Col key={league.id}>
              <Card className='my-league-container'>
                <Card.Body>
                  <Card.Title className='card-title'>{league.name}</Card.Title>
                  <Card.Text className='card-text'>{league.description}</Card.Text>
                  <Button variant="success" as={Link} to={`/my-leagues/${league.id}`}>
                    View League
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  );
}

export default MyLeagues;