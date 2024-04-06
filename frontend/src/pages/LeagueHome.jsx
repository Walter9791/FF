import React, { useState, useEffect } from 'react';
import useAxios from "../utils/useAxios";
import Layout from '../components/layout';
import { useParams } from 'react-router-dom';

const LeagueHomePage = ({ match }) => {
  const [league, setLeague] = useState(null);
  const [error, setError] = useState('');
  const { leagueId } = useParams();
  const api = useAxios();

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        const response = await api.get(`/leagues/${leagueId}/`);
        setLeague(response.data);
      } catch (err) {
        console.error("Error fetching league data:", err);
        setError("Error fetching league data. Please try again later.");
      }
    };

    fetchLeagueData();
  }, [leagueId]);

  return (
    <Layout showLeagueNavbar={true}>
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