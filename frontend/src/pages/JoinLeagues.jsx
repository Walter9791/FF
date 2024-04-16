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
    <Layout>
      <div>
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
        {error && <p>{error}</p>} {/* Display any error that might have occurred */}
      </div>
    </Layout>
  );
};
export default JoinLeague;




// const JoinLeague = () => {
//   const [leagues, setLeagues] = useState([]);
//   const [error, setError] = useState('');
//   const api = useAxios();
//   const [leaguePassword, setLeaguePassword] = useState({}); // For storing passwords for private leagues

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

//   const handleJoinLeague = async (league) => {
//     const payload = league.isPublic ? {} : { password: leaguePassword[league.id] };
//     console.log('Joining league with ID:', league.id);
//     console.log('Payload:', payload);

//     const handleJoinLeague = async (league) => {
//       try {
//       const response = await api.post(`/leagues/join/${league.id}/`, payload);
//       console.log('Response:', response);
//       alert('Successfully joined the league');
//       // Update UI or state as needed to reflect the successful join
//     } catch (error) {
//       console.error('Failed to join league:', error);
//       if (error.response) {
//         console.error('Server responded with status:', error.response.status);
//         console.error('Server response data:', error.response.data);
//       }
//       alert('Failed to join league. Check the password for private leagues.');
//     }
//   };
  
//   return (
//     <Layout>
//       <div>
//         <h2>Leagues</h2>
//         <ul>
//         {leagues.map((league) => {
//             console.log(`League: ${league.name}, is_public: ${league.is_public}`);
//             return (
//           <li key={league.id}>
//             {league.name} - {league.description}
//             {league.is_public ? (
//               <button onClick={() => handleJoinLeague(league)}>Join League</button>
//             ) : (
//               <div>
//                 <input 
//                   type="password" 
//                   placeholder="League Password" 
//                   onChange={(e) => setLeaguePassword({ ...leaguePassword, [league.id]: e.target.value })} 
//                 />
//                 <button onClick={() => handleJoinLeague(league)}>Join Private League</button>
//               </div>
//             )}
//           </li>
//           )})}
//         </ul>
//       </div>
//     </Layout>
//   );
// };
// export default JoinLeague;


//   useEffect(() => {
//     const fetchLeaguesAndStatuses = async () => {
//       try {
//         const leaguesResponse = await api.get("/leagues/");
//         // const statusesResponse = await api.get("/leagues/join-request-statuses/");
//         const statuses = statusesResponse.data;
  
//         // Combine league data with join request statuses
//         const updatedLeagues = leaguesResponse.data.map(league => ({
//           ...league,
//           joinStatus: statuses[league.id] || 'not_requested'
//         }));
  
//         setLeagues(updatedLeagues);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Error fetching data. Please try again later.");
//       }
//     };
  
//     fetchLeaguesAndStatuses();
//   }, []);

//   const handleJoinRequest = async (leagueId) => {
//     try {
//       // Include userr authentication as equired
//       const response = await api.post(`/leagues/join/${leagueId}/`, {message: "I would like to join this league."});
//       alert('Join request sent successfully');
//       setJoinRequestStatuses(prevStatuses => ({
//         ...prevStatuses,
//         [leagueId]: 'pending'
//       }));
//     } catch (error) {
//       console.error('Failed to send join request:', error);
//       alert('Failed to send join request');
//     }
//   };

//   return (
//     <Layout>
//     <div>
//       <h2>Leagues</h2>
//       <ul>
//         {leagues.map((league) => (
//           <li key={league.id}>
//             {league.name} - {league.description}
//             {(joinRequestStatuses[league.id] === 'pending' || league.joinStatus === 'pending') ? (
//                 <span>Request Pending</span>
//                 ) : (
//               <button onClick={() => handleJoinRequest(league.id)}>Join League</button>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//     </Layout>
//   );
// };

// export default JoinLeague;










  // Fetch leagues from the backend
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
