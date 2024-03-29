import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAxios from "../utils/useAxios";

import Layout from '../components/layout';

const JoinLeague = () => {
  const [leagues, setLeagues] = useState([]);
  const [error, setError] = useState('');
  const api = useAxios();

  // Fetch leagues from the backend
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

  const handleJoinRequest = async (leagueId) => {
    try {
      // Include userr authentication as equired
      const response = await axios.post(`/api/leagues/${leagueId}/join-request`);
      alert('Join request sent successfully');
    } catch (error) {
      console.error('Failed to send join request:', error);
      alert('Failed to send join request');
    }
  };

  return (
    <Layout>
    <div>
      <h2>Leagues</h2>
      <ul>
        {leagues.map((league) => (
          <li key={league.id}>
            {league.name} - {league.description}
            <button onClick={() => handleJoinRequest(league.id)}>Join League</button>
          </li>
        ))}
      </ul>
    </div>
    </Layout>
  );
};

export default JoinLeague;








// import React, { useState, useEffect, useContext } from 'react';
// import useAxios from "../utils/useAxios";
// import AuthContext from '../context/authContext';
// import Layout from '../components/layout';

// const League = () => {
//   const [leagues, setLeagues] = useState([]);
//   const [leagueName, setLeagueName] = useState('');
//   const [ownersCount, setOwnersCount] = useState('');
//   const [error, setError] = useState('');
//   const [description, setDescription] = useState('');
//   const [leaguePassword, setLeaguePassword] = useState('');
//   const [passwords, setPasswords] = useState({});
 

//   const api = useAxios();

//   // Fetch leagues from the backend
//   useEffect(() => {
//     const fetchLeagues = async () => {
//       try {
//         const response = await api.get("/leagues/");
//         setLeagues(response.data);
//       } catch (err) {
//         console.error("Error fetching leagues:", err);
//         setError("Error fetching leagues. Please try again later.");
//       }
//     };
//     fetchLeagues();
//   }, []);

//   const joinLeague = async (e, pk) => {
//     e.preventDefault();
//     console.log('League ID:', pk);
//     const password = passwords[pk]; // Correctly reference the passwords state here
//     console.log('Password:', password);

//     try {
//       console.log('Attempting to join league...');
//       await api.post(`/leagues/join/${pk}/`, { password });
//       console.log('Successfully joined the league!');
//       alert('Successfully joined the league!');
//       // Consider resetting or updating the form/state as needed here
//     } catch (error) {
//       console.error("Error joining league:", error);
//       alert('Failed to join league. Check the password.');
//     }
//   };

//   return (
//     <Layout>
//         <div className='joinleague'>
//             <h2>Existing Leagues</h2>
//                 <ul>
//                     {leagues.map((leagues) => (
//                         <li key={leagues.id}>
//                         {leagues.name} - Owners: {leagues.owners_count}
//                         <form onSubmit={(e) => joinLeague(e, leagues.id)}>
//                             <button type="submit">Join League</button>
//                         </form>
//                         </li>
//                     ))}
//                 </ul>
//       </div>
//     </Layout>
//   );
// };

// export default League;




    