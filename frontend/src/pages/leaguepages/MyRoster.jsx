import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from '../../utils/useAxios';
import Layout from '../../components/layout';
import { useLeague } from '../../context/LeagueContext';

const RosterPage = () => {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const api = useAxios();
  const { leagueId, teamId, updateLeagueAndTeam } = useLeague();

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const response = await api.get(`/leagues/${leagueId}/teams/${teamId}/roster`);
        setRoster(response.data);
      } catch (error) {
        console.error("Failed to fetch roster", error);
        setError("Failed to load roster data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, [leagueId, teamId]);

  if (loading) return <div>Loading roster...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Layout showLeagueNavbar={true} customClass='schedule-container'>
    <div>
      <h2>Roster</h2>
      <ul>
        {roster.map((player) => (
          <li key={player.id}>{player.name} - {player.position}</li>
        ))}
      </ul>
    </div>
    </Layout>
  );
}

export default RosterPage;