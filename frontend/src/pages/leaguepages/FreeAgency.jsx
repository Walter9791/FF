import React, { useState, useEffect } from 'react';
import useAxios from '../../utils/useAxios';
import Layout from '../../components/layout';
import { useLeague } from '../../context/LeagueContext';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const FreeAgentsPage = () => {
  const [freeAgents, setFreeAgents] = useState([]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFreeAgent, setSelectedFreeAgent] = useState(null);
  const api = useAxios();
  const { leagueId, teamId } = useLeague();

  useEffect(() => {
    const fetchFreeAgentsAndRoster = async () => {
      try {
        const [freeAgentResponse, rosterResponse] = await Promise.all([
          api.get(`/leagues/${leagueId}/freeagents/`),
          api.get(`/leagues/${leagueId}/teams/${teamId}/roster/`)
        ]);
        setFreeAgents(freeAgentResponse.data);
        setRoster(rosterResponse.data);
      } catch (error) {
        console.error("Failed to load data", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFreeAgentsAndRoster();
  }, [api, leagueId, teamId]);

  const handleAddToTeam = (freeAgent) => {
    setSelectedFreeAgent(freeAgent);
  };

  const handleDropAndAddPlayer = async (droppedPlayerId) => {
    try {
      const response = await api.post(`/leagues/${leagueId}/updateRoster`, {
        addPlayerId: selectedFreeAgent.id,
        dropPlayerId: droppedPlayerId
      });
      if (response.status === 200) {
        console.log("Roster updated successfully");
        setSelectedFreeAgent(null); // Clear selection to refresh view
        fetchFreeAgentsAndRoster(); // Re-fetch roster to update UI
      }
    } catch (error) {
      console.error("Failed to update roster", error);
      setError("Failed to update roster.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Layout showLeagueNavbar={true}>
      <h2>Free Agents</h2>
      {selectedFreeAgent ? (
        <div>
          <h3>Select a player to drop for {selectedFreeAgent.name}</h3>
          <ul>
            {roster.map(player => (
              <li key={player.id}>
                {player.name} - <button onClick={() => handleDropAndAddPlayer(player.id)}>Drop</button>
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedFreeAgent(null)}>Back to Free Agents</button>
        </div>
      ) : (
        <div>
          {freeAgents.map(freeAgent => (
            <div key={freeAgent.id}>
              {freeAgent.name} ({freeAgent.position_name}) - <button onClick={() => handleAddToTeam(freeAgent)}>Add</button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default FreeAgentsPage;

// import React, { useState, useEffect } from 'react';
// import useAxios from '../../utils/useAxios';
// import Layout from '../../components/layout';
// import { useLeague } from '../../context/LeagueContext';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';

// const FreeAgentsPage = () => {
//   const [freeAgents, setFreeAgents] = useState([]);
//   const [roster, setRoster] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedFreeAgent, setSelectedFreeAgent] = useState(null);

//   const api = useAxios();
//   const { leagueId, teamId } = useLeague();

//   useEffect(() => {
//     const fetchFreeAgentsAndRoster = async () => {
//       try {
//         const [freeAgentResponse, rosterResponse] = await Promise.all([
//           api.get(`/leagues/${leagueId}/freeagents/`),
//           api.get(`/leagues/${leagueId}/teams/${teamId}/roster/`)
//         ]);
//         setFreeAgents(freeAgentResponse.data);
//         setRoster(rosterResponse.data);
//       } catch (error) {
//         console.error("Failed to load data", error);
//         setError("Failed to load data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFreeAgentsAndRoster();
//   }, [leagueId, teamId]);

//   const handleAddToTeam = (freeAgent) => {
//     setSelectedFreeAgent(freeAgent);
//   };

//   const handleDropAndAddPlayer = async (droppedPlayerId) => {
//     try {
//       const response = await api.post(`/leagues/${leagueId}/updateRoster`, {
//         addPlayerId: selectedFreeAgent.id,
//         dropPlayerId: droppedPlayerId
//       });
//       if (response.status === 200) {
//         console.log("Roster updated successfully");
//         setSelectedFreeAgent(null); 
//         fetchFreeAgentsAndRoster(); 
//       }
//     } catch (error) {
//       console.error("Failed to update roster", error);
//       setError("Failed to update roster.");
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   const displayFreeAgents = positionName => {
//     const start = currentPage * agentsPerPage;
//     const end = start + agentsPerPage;
//     return freeAgents.filter(agent => agent.position_name === positionName).slice(start, end);
//   };

//   const agentsPerPage = 25;

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

  
//   return (
//     <Layout showLeagueNavbar={true}>
//       <h2>Free Agents</h2>
//       {selectedFreeAgent ? (
//         <div>
//           <h3>Select a player to drop for {selectedFreeAgent.name}</h3>
//           <ul>
//             {roster.map(player => (
//               <li key={player.id}>
//                 {player.name} - <button onClick={() => handleDropAndAddPlayer(player.id)}>Drop</button>
//               </li>
//             ))}
//           </ul>
//           <button onClick={() => setSelectedFreeAgent(null)}>Back to Free Agents</button> {/* Allows user to go back */}
//         </div>
//       ) : (
//         <Tabs>
//           <TabList>
//             {positions.map((position, index) => (
//               <Tab key={index}>{position}</Tab>
//             ))}
//           </TabList>
//           {positions.map((position, index) => (
//             <TabPanel key={index}>
//               <FreeAgentTable
//                 players={freeAgents.filter(agent => agent.position_name === position)}
//                 title={`${position} Free Agents`}
//                 handleAddToTeam={handleAddToTeam}
//               />
//             </TabPanel>
//           ))}
//         </Tabs>
//       )}
//     </Layout>
//   );
// };

// const FreeAgentTable = ({ players, title, handleAddToTeam }) => {
//   return (
//     <div>
//       <h3>{title}</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Position</th>
//             <th>Add to Team</th>
//           </tr>
//         </thead>
//         <tbody>
//           {players.map(player => (
//             <tr key={player.id}>
//               <td>{player.name}</td>
//               <td>{player.position_name}</td>
//               <td>
//                 <button onClick={() => handleAddToTeam(player)}>Add</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };



// export default FreeAgentsPage;


// import React, { useState, useEffect } from 'react';
// import useAxios from '../../utils/useAxios';
// import Layout from '../../components/layout';
// import { useLeague } from '../../context/LeagueContext';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';

// const FreeAgentsPage = () => {
//   const [freeAgents, setFreeAgents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [currentPage, setCurrentPage] = useState(0);
//   const [selectedFreeAgent, setSelectedFreeAgent] = useState(null);
//   const [positions, setPositions] = useState([]);
//   const api = useAxios();
//   const { leagueId, teamId } = useLeague();

//   useEffect(() => {
//     const fetchFreeAgentsAndRoster = async () => {
//       try {
//         const [freeAgentResponse, rosterResponse] = await Promise.all([
//           api.get(`/leagues/${leagueId}/freeagents/`),
//           api.get(`/leagues/${leagueId}/teams/${teamId}/roster/`)
//         ]);
//         setFreeAgents(freeAgentResponse.data);
//         setRoster(rosterResponse.data);
//       } catch (error) {
//         console.error("Failed to load data", error);
//         setError("Failed to load data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFreeAgentsAndRoster();
//   }, [leagueId]);

//   const handleAddToTeam = (freeAgent) => {
//     setSelectedFreeAgent(freeAgent);
//   };

//   const handleDropAndAddPlayer = async (droppedPlayerId) => {
//     try {
//       const response = await api.post(`/leagues/${leagueId}/updateRoster`, {
//         addPlayerId: selectedFreeAgent.id,
//         dropPlayerId: droppedPlayerId
//       });
//       if (response.status === 200) {
//         // Refresh or update roster and free agents state based on new data
//         console.log("Roster updated successfully");
//       }
//     } catch (error) {
//       console.error("Failed to update roster", error);
//       setError("Failed to update roster.");
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <Layout showLeagueNavbar={true}>
//       <h2>Free Agents</h2>
//       {selectedFreeAgent ? (
//         <div>
//           <h3>Select a player to drop for {selectedFreeAgent.name}</h3>
//           <ul>
//             {roster.map(player => (
//               <li key={player.id}>
//                 {player.name} - <button onClick={() => handleDropAndAddPlayer(player.id)}>Drop</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <FreeAgentTable
//           players={freeAgents}
//           title="Free Agents"
//           handleAddToTeam={handleAddToTeam}
//         />
//       )}
//     </Layout>
//   );
// };

//   const FreeAgentTable = ({ players, title }) => {
//     return (
//       <div>
//         <h3>{title}</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Position</th>
//               <th>Add to Team</th>
//             </tr>
//           </thead>
//           <tbody>
//             {players.map(player => (
//               <tr key={player.id}>
//                 <td>{player.name}</td>
//                 <td>{player.position_name}</td>
//                 <td>
//                   <button onClick={() => handleAddToTeam(player.id)}>Add</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const agentsPerPage = 25;
//   const displayFreeAgents = positionName => {
//     const start = currentPage * agentsPerPage;
//     const end = start + agentsPerPage;
//     return freeAgents.filter(agent => agent.position_name === positionName).slice(start, end);
//   };
  
//   return (
//     <Layout showLeagueNavbar={true} customClass='schedule-container'>
//       {loading ? (
//         <div>Loading...</div>
//       ) : error ? (
//         <div>{error}</div>
//       ) : (
//         <div>
//           <h2>Free Agents</h2>
//           <Tabs>
//             <TabList>
//               {positions.map((position, index) => (
//                 <Tab key={index}>{position}</Tab>
//               ))}
//             </TabList>
//             {positions.map((position, index) => (
//               <TabPanel key={index}>
//                 <FreeAgentTable
//                   players={displayFreeAgents(position)}
//                   title={`${position} Free Agents`}
//                 />
//                 <button disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
//                 <button disabled={displayFreeAgents(position).length < agentsPerPage} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
//               </TabPanel>
//             ))}
//           </Tabs>
//         </div>
//       )}
//     </Layout>
//   );


// export default FreeAgentsPage;