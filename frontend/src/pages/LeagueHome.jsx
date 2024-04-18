import React, { useState, useEffect } from 'react';
import useAxios from "../utils/useAxios";
import Layout from '../components/layout';
import { useParams } from 'react-router-dom';
import { useLeague } from '../context/LeagueContext';
import { Card, ListGroup, Table, Row, Col, Container } from 'react-bootstrap';

const LeagueHomePage = () => {
  const [league, setLeague] = useState(null);
  const [error, setError] = useState('');
  const { leagueId } = useParams();
  const api = useAxios();
  const { leagueId: currentLeagueId, teamId: currentTeamId, updateLeagueAndTeam } = useLeague();

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        const response = await api.get(`/leagues/myleagues/${leagueId}/`);
        console.log("Backend response:", response.data);
        const fetchedTeamId = response.data.user_team_id;
        console.log(`League ID: ${leagueId}, Fetched Team ID: ${fetchedTeamId}`);

      
        if (leagueId !== currentLeagueId || fetchedTeamId !== currentTeamId) {
          updateLeagueAndTeam(leagueId, fetchedTeamId);
        }

        setLeague(response.data);
      } catch (err) {
        console.error("Error fetching league data:", err);
        setError("Error fetching league data. Please try again later.");
      }
    };

    fetchLeagueData();
  }, [updateLeagueAndTeam]);

  if (!league) {
    return <div>No league details...</div>;
  }

  return (
    <Layout showLeagueNavbar={true} teamId={league.user_team_id}>
     <Container className="mt-3 my-league-container">
        <Card>
          <Card.Body>
            <Card.Title>{league.name}</Card.Title>
            <Card.Text>
              League Description: {league.description}
              <br />
              Commissioner: {league.commissioner_name}
            </Card.Text>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Wins</th>
                  <th>Losses</th>
                  <th>Points For</th>
                  <th>Points Against</th>
                </tr>
              </thead>
              <tbody>
                {league.team_names?.map((team, index) => (
                  <tr key={index}>
                    <td>{team}</td>
                    <td>{/* Wins data placeholder */}</td>
                    <td>{/* Losses data placeholder */}</td>
                    <td>{/* Points for data placeholder */}</td>
                    <td>{/* Points against data placeholder */}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </Container>
    </Layout>
  );
};

export default LeagueHomePage;

