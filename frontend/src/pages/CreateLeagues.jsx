import React, { useState, useEffect, useContext } from 'react';
import useAxios from "../utils/useAxios";
// import AuthContext from '../context/authContext';
import Layout from '../components/layout';
import { useNavigate } from 'react-router-dom';

const CreateLeague = () => {
  const [leagues, setLeagues] = useState([]);
  const [leagueName, setLeagueName] = useState('');
  const [ownersCount, setOwnersCount] = useState('');
  const [error, setError] = useState('');
  const [description, setDescription] = useState('');
  const [leaguePassword, setLeaguePassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
//   const [passwords, setPasswords] = useState({});
 

  const api = useAxios();


  // Handle league creation
  const handleCreateLeague = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/leagues/", {
        name: leagueName,
        owners_count: ownersCount,
        description: description,
        commissioner: 1,
        password: leaguePassword,
      });
      setLeagues([...leagues, response.data]);
      setLeagueName('');
      setOwnersCount('');
      setDescription('');
      setLeaguePassword('');
      setSuccessMessage("League created successfully!");
      setError("");
      navigate('/about'); //this will be the My Leagues Page when it is built
    } catch (err) {
      console.error("Error creating league:", err);
      setError("Error creating the league. Please try again.");
    }
  };

  return (
    <Layout>
      <div className='league'>
        <h1>Create Your League</h1>
            <form onSubmit={handleCreateLeague}>
            <input
                type="text"
                placeholder="League Name"
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
            />
            <select value={ownersCount} onChange={(e) => setOwnersCount(e.target.value)}>
                <option value="">Select Owners Count</option>
                <option value="8">8</option>
                <option value="10">10</option>
                <option value="12">12</option>
            </select>
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="password" 
                placeholder="League Password"
                value={leaguePassword}
                onChange={(e) => setLeaguePassword(e.target.value)}
            />
            <button type="submit">Create League</button>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            </form>
        </div>
    </Layout>
 );
}

export default CreateLeague;        