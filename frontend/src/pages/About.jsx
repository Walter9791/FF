import React from 'react'
import Layout from '../components/layout'
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutPage = () => {
    return (
      <Layout>
        <Container style={{ marginTop: '10px' }}>
            <h1 className="text-center text-white" style={{ marginBottom: '20px' }}>About DOPP</h1>
            
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title className='text-center'>Welcome to Director of Player Personnel</Card.Title>
                            <Card.Text>
                               Dopp is.....
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-md-center" style={{ marginTop: '20px'}}>
                <Col md={8}>
                    <Card class>
                        <Card.Body>
                            <Card.Title className='text-center'>Current Features</Card.Title>
                            <Card.Text>
                                <ul>
                                    <div><strong>Create and Join Leagues</strong> Track your team's progress with live updates and detailed statistics.</div>
                                    <div><strong>Custom Scoring for ALL players</strong> Every player on the field contributes to team totals!</div>
                                    <div><strong>Other</strong> ...</div>
                                </ul>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-md-center" style={{ marginTop: '20px' }}>
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title className='text-center'>Upcoming Features</Card.Title>
                            <Card.Text>
                                Player salaries and league salary caps.
                                <br />
                                Customizable league settings.
                                <br />
                                Larger league memebership.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-md-center" style={{ marginTop: '40px', marginBottom: '20px' }}>
                <Col md={8} className="text-center text-white ">
                    <p>closing text ....</p>
                </Col>
            </Row>
        </Container>
      </Layout>
    );
}

export default AboutPage;