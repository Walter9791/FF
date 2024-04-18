import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAxios from "../utils/useAxios";
import Layout from '../components/layout';

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
      <div className='form-container'>
        <h2>Leagues</h2>
        <ul>
        {leagues.map((league) => {
            console.log(`League: ${league.name}, is_public: ${league.is_public}`);
            return (
          <li key={league.id}>
            {league.name} - {league.description}
            {!joinedLeagues.has(league.id) && ( 
              league.is_public ? (
                <button onClick={() => handleJoinLeague(league)}>Join League</button>
              ) : (
                <div>
                  <input 
                    type="password" 
                    placeholder="League Password" 
                    onChange={(e) => setLeaguePassword({ ...leaguePassword, [league.id]: e.target.value })} 
                  />
                  <button onClick={() => handleJoinLeague(league)}>Join Private League</button>
                </div>
              )
            )}
          </li>
          )})}
        </ul>
        {error && <p>{error}</p>} 
      </div>
    </Layout>
  );
};
export default JoinLeague;

