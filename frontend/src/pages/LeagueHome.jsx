import React, { useState, useEffect } from 'react';
import useAxios from "../utils/useAxios";
import Layout from '../components/layout';
import { useParams } from 'react-router-dom';
import LeagueNavbar from '../components/LeagueNavbar/Index';

const LeagueHomePage = ({ match }) => {
  const [league, setLeague] = useState(null);
  const [error, setError] = useState('');
  const { leagueId } = useParams();
  const api = useAxios();

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        const response = await api.get(`/leagues/myleagues/${leagueId}/`);
        console.log("Backend response:", response.data);
        setLeague(response.data);
      } catch (err) {
        console.error("Error fetching league data:", err);
        setError("Error fetching league data. Please try again later.");
      }
    };

    fetchLeagueData();
  }, [leagueId]);

  if (!league) {
    return <div>Loading league details...</div>; // Or any other loading indicator
  }

  return (
    <Layout showLeagueNavbar={true} teamId={league.user_team_id}>
      <div>
        <h2>League Home Page</h2>
        {league ? (
          <div>
            <h3>{league.name}</h3>
            <p>Description: {league.description}</p>
            <p>Owners Count: {league.owners_count}</p>
            <p>Commissioner: {league.commissioner}</p>
            {/* For members, assuming API returns an array of member names or IDs */}
            <p>Members: {league.member && league.member.join(', ')}</p>
            {/* Add more league details as needed */}
            <p>Team ID: {league.user_team_id}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        {error && <p>{error}</p>}
      </div>
    </Layout>
  );
}

export default LeagueHomePage;