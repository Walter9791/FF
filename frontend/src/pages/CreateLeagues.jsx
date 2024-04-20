import React, { useState, useEffect, useContext } from 'react';
import useAxios from "../utils/useAxios";
// import AuthContext from '../context/authContext';
import Layout from '../components/layout';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col, Alert } from 'react-bootstrap';

const CreateLeague = () => {
  const [leagues, setLeagues] = useState([]);
  const [leagueName, setLeagueName] = useState('');
  const [ownersCount, setOwnersCount] = useState('');
  const [error, setError] = useState('');
  const [description, setDescription] = useState('');
  const [leaguePassword, setLeaguePassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(true); // Default to public
  const api = useAxios();

  const handleCreateLeague = async (e) => {
    e.preventDefault();
    const payload = {
        name: leagueName,
        owners_count: parseInt(ownersCount, 10),
        description: description,
        is_public: isPublic,
    };
    // Only add password to payload if the league is private
    if (!isPublic && leaguePassword) {
        payload.league_password = leaguePassword;
    }

    try {
      console.log("Sending payload:", payload);
      const response = await api.post("/leagues/", payload);
      setLeagues([...leagues, response.data]);
      // Reset form fields
      setLeagueName('');
      setOwnersCount('');
      setDescription('');
      setLeaguePassword('');
      setIsPublic(true); 
      setSuccessMessage("League created successfully!");
      setError("");
      navigate('/my-leagues');
    } catch (err) {
      console.error("Error creating league:", err);
      setError("Error creating the league. Please try again.");
    }
};


 

  return (
    <Layout>
       <Container className="mt-3">
        <Card>
          <Card.Body>
            <Card.Title className='text-center'>Create Your League</Card.Title>
            <Form onSubmit={handleCreateLeague}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="leagueName">
                    <Form.Label>League Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter league name"
                      value={leagueName}
                      onChange={(e) => setLeagueName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="ownersCount">
                    <Form.Label>Owners Count</Form.Label>
                    <Form.Control
                      as="select"
                      value={ownersCount}
                      onChange={(e) => setOwnersCount(e.target.value)}
                    >
                      <option value="">Select Owners Count</option>
                      <option value="8">8</option>
                      <option value="10">10</option>
                      <option value="12">12</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="leagueType">
                <Form.Label>League Type</Form.Label>
                <Form.Control
                  as="select"
                  value={isPublic ? "public" : "private"}
                  onChange={(e) => setIsPublic(e.target.value === "public")}
                >
                  <option value="public">Public League</option>
                  <option value="private">Private League</option>
                </Form.Control>
              </Form.Group>
              {!isPublic && (
                <Form.Group className="mb-3" controlId="leaguePassword">
                  <Form.Label>League Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter a password for your league"
                    value={leaguePassword}
                    onChange={(e) => setLeaguePassword(e.target.value)}
                  />
                </Form.Group>
              )}
              <div className="d-flex justify-content-center">
              <Button  variant="primary" type="submit">Create League</Button>
              {error && <Alert variant="danger">{error}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
 );
}

export default CreateLeague;        
