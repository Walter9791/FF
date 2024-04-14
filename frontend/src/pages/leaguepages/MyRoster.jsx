import React, { useState, useEffect } from 'react';
import useAxios from '../../utils/useAxios';
import Layout from '../../components/layout';
import { useLeague } from '../../context/LeagueContext';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const RosterPage = () => {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const api = useAxios();
  const { leagueId, teamId } = useLeague();

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


  const handleStatusChange = (id, newStatus) => {
    setRoster(currentRoster => currentRoster.map(player =>
      player.id === id ? { ...player, tempStatus: newStatus } : player
    ));
  };

  const saveRosterChanges = async () => {
    const updatedRoster = roster.map(player => ({ id: player.id, status: player.tempStatus }));
    try {
      const response = await api.post(`leagues/${leagueId}/teams/${teamId}/roster/update`, { updatedRoster });
      console.log(response.data); // Handle response appropriately
      alert('Roster updated successfully!');
    } catch (error) {
      console.error('Failed to save roster', error);
      alert('Failed to update roster.');
    }
  };

  const RosterTable = ({ players, title }) => {
    if (!players || players.length === 0) {
      return <div>No players in {title}</div>;
    }

    return (
      <div>
        <h3>{title}</h3>
        <table>
          <thead>
            <tr>
              <th>Week</th>
              <th>Player</th>
              <th>Position</th>
              <th>Opponent</th>
              <th>Date</th>
              <th>Time</th>              
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id}>
                <td>{player.week}</td>
                <td>{player.player_name}</td>
                <td>{player.position_name}</td>
                <td>{player.opponent}</td>
                <td>{player.opponent_game_date}</td>
                <td>{player.opponent_game_time}</td>                
                <td>{player.status}</td>
                <td>
                  <select value={player.tempStatus} onChange={e => handleStatusChange(player.id, e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Bench">Bench</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return <div>Loading roster...</div>;
  if (error) return <div>{error}</div>;

  const offensivePlayers = roster.filter(player => player.offensive);
  const defensivePlayers = roster.filter(player => !player.offensive);

  const activeOffensivePlayers = offensivePlayers.filter(player => player.status === 'Active');
  const benchedOffensivePlayers = offensivePlayers.filter(player => player.status !== 'Active');
  const activeDefensivePlayers = defensivePlayers.filter(player => player.status === 'Active');
  const benchedDefensivePlayers = defensivePlayers.filter(player => player.status !== 'Active');

  console.log("Active Offensive Players:", activeOffensivePlayers);
  console.log("Benched Offensive Players:", benchedOffensivePlayers);
  console.log("Active Defensive Players:", activeDefensivePlayers);
  console.log("Benched Defensive Players:", benchedDefensivePlayers);

  return (
    <Layout showLeagueNavbar={true} customClass='schedule-container'>
      <div>
        <h2>Team Roster</h2>
        <button onClick={saveRosterChanges} className="save-button">Save Changes</button>
        <Tabs>
          <TabList>
            <Tab>Offense</Tab>
            <Tab>Defense</Tab>
          </TabList>

          <TabPanel>
            <RosterTable players={activeOffensivePlayers} title="Starting Offense" />
            <RosterTable players={benchedOffensivePlayers} title="Benched Offense" />
          </TabPanel>

          <TabPanel>
            <RosterTable players={activeDefensivePlayers} title="Starting Defense" />
            <RosterTable players={benchedDefensivePlayers} title="Benched Defense" />
          </TabPanel>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RosterPage;


// import React, { useState, useEffect, useContext } from 'react';
// import { useParams } from 'react-router-dom';
// import useAxios from '../../utils/useAxios';
// import Layout from '../../components/layout';
// import { useLeague } from '../../context/LeagueContext';
// import ReactPaginate from 'react-paginate';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'; 
// import 'react-tabs/style/react-tabs.css';


// const RosterPage = () => {
//   const [roster, setRoster] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const api = useAxios();
//   const { leagueId, teamId, updateLeagueAndTeam } = useLeague();
//   const [activeOffensivePlayers, setActiveOffensivePlayers] = useState([]);
//   const [benchedOffensivePlayers, setBenchedOffensivePlayers] = useState([]);
//   const [activeDefensivePlayers, setActiveDefensivePlayers] = useState([]);
//   const [benchedDefensivePlayers, setBenchedDefensivePlayers] = useState([]);
  


//   useEffect(() => {
//     const fetchRoster = async () => {
//       try {
//         const response = await api.get(`/leagues/${leagueId}/teams/${teamId}/roster`);
//         console.log("API Response:", response.data);  // Logging the API response
//         setRoster(response.data);
//         const offensivePlayers = response.data.filter(player => player.offensive);
//         const defensivePlayers = response.data.filter(player => !player.offensive);
//         console.log("Offensive Players:", offensivePlayers);
//         console.log("Defensive Players:", defensivePlayers);
//         const activeOffensivePlayers = offensivePlayers.filter(player => player.status === 'Active');
//         const benchedOffensivePlayers = offensivePlayers.filter(player => player.status !== 'Active');
//         const activeDefensivePlayers = defensivePlayers.filter(player => player.status === 'Active');
//         const benchedDefensivePlayers = defensivePlayers.filter(player => player.status !== 'Active');  
//         setActiveOffensivePlayers(offensivePlayers.filter(player => player.status === 'Active'));
//         setBenchedOffensivePlayers(offensivePlayers.filter(player => player.status === 'Bench'));
//         setActiveDefensivePlayers(defensivePlayers.filter(player => player.status === 'Active'));
//         setBenchedDefensivePlayers(defensivePlayers.filter(player => player.status === 'Bench'));
//         console.log("Active Offensive Players:", activeOffensivePlayers);
//         console.log("Benched Offensive Players:", benchedOffensivePlayers);
//         console.log("Active Defensive Players:", activeDefensivePlayers);
//         console.log("Benched Defensive Players:", benchedDefensivePlayers);

//       } catch (error) {
//         console.error("Failed to fetch roster", error);
//         setError("Failed to load roster data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoster();
//   }, [leagueId, teamId]);


//     if (loading) return <div>Loading roster...</div>;
//     if (error) return <div>{error}</div>;
  
//     // const RosterList = ({ players }) => {
//     //   console.log("Players:", players);
//     //   if (!players) {
//     //     return <div>No players</div>;
//     //   }
    
//     //   return (
//     //     <div>
//     //       {players.map(player => (
//     //         <div key={player.id}>{player.name}</div>
//     //       ))}
//     //     </div>
//     //   );
//     // };
//     const RosterList = ({ players }) => {
//       if (!players || players.length === 0) {
//         return <div>No players</div>;
//       }
  
//     return (
//         <table className="roster-table">
//           <thead>
//             <tr>
//               <th>Player</th>
//               <th>Position</th>
//               <th>Opponent</th>
//               <th>Week</th>
//               <th>Time</th>
//               <th>Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {players.map(player => (
//               <tr key={player.id}>
//                 <td>{player.name}</td>
//                 <td>{player.position}</td>
//                 <td>{player.opponent}</td>
//                 <td>{player.week}</td>
//                 <td>{player.time}</td>
//                 <td>{player.date}</td>
//                 <td>{player.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       );
//     };

// export default RosterPage;
    
  //     <Layout showLeagueNavbar={true} customClass=''>
  //       <div className='layout-container layout-content'>
  //         <h2>Team Roster</h2>
  //         <Tabs>
  //           <TabList>
  //             <Tab>Offense</Tab>
  //             <Tab>Defense</Tab>
  //           </TabList>
  
  //           <TabPanel>
  //             <h3>Active</h3>
  //             <RosterList players={activeOffensivePlayers} />
  //             <h3>Bench</h3>
  //             <RosterList players={benchedOffensivePlayers} />
  //           </TabPanel>
  
  //           <TabPanel>
  //             <h3>Active</h3>
  //             <RosterList players={activeDefensivePlayers} />
  //             <h3>Bench</h3>
  //             <RosterList players={benchedDefensivePlayers} />
  //           </TabPanel>
  //         </Tabs>
  //       </div>
  //     </Layout>
  //   );
  // };
  
  


// import React, { useState, useEffect } from 'react';
// import { useDrag, useDrop, DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
// import useAxios from '../../utils/useAxios';
// import Layout from '../../components/layout';
// import { useLeague } from '../../context/LeagueContext';

// const DraggablePlayer = ({ player, type, movePlayer }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//       type,
//       item: player,
//       end: (item, monitor) => {
//           const dropResult = monitor.getDropResult();
//           if (item && dropResult) {
//               movePlayer(item.id);
//           }
//       },
//       collect: monitor => ({
//           isDragging: !!monitor.isDragging(),
//       }),
//   }));

//   return (
//       <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, padding: '10px', marginBottom: '5px', backgroundColor: 'white', cursor: 'move' }}>
//           {player.player_name} - {player.position_name}
//       </div>
//   );
// };


// const DroppableArea = ({ children, onDrop }) => {
//   const [, drop] = useDrop(() => ({
//       accept: 'player',
//       drop: onDrop,
//       collect: monitor => ({
//           isOver: !!monitor.isOver(),
//       }),
//   }));

//   return <div ref={drop} style={{ minHeight: '300px', padding: '10px', backgroundColor: '#e1e1e1' }}>
//       {children.length > 0 ? children : "Drag players here"}
//   </div>;
// };

// const RosterPage = () => {
//     const [roster, setRoster] = useState([]);
//     const [startingLineup, setStartingLineup] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const api = useAxios();
//     const { leagueId, teamId } = useLeague(); // Assuming useLeague() provides these

//     useEffect(() => {
//         const fetchRoster = async () => {
//             try {
//                 const response = await api.get(`/leagues/${leagueId}/teams/${teamId}/roster`);
//                 console.log("API Response:", response.data);  // Logging the API response
//                 setRoster(response.data);
//             } catch (error) {
//                 console.error("Failed to fetch roster", error);
//                 setError("Failed to load roster data.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRoster();
//     }, [leagueId, teamId]);

//     const movePlayer = (playerId, newPosition) => {
//       // Find the player that's being moved
//       const player = roster.find(player => player.id === playerId);
  
//       // Find the player that's currently in the new position
//       const otherPlayer = roster.find(player => player.position_name === newPosition);
  
//       // Move the other player to the bench
//       if (otherPlayer) {
//           otherPlayer.position_name = 'Bench';
//           otherPlayer.status = 'Inactive';
//       }
  
//       // Move the player to the new position
//       player.position_name = newPosition;
//       player.status = 'Active';
  
//       // Update the roster state
//       setRoster([...roster]);
//   };
//     const saveLineup = () => {
//         // Implement API call to save the starting lineup
//         console.log("Saving lineup:", startingLineup);
//     };

//     if (loading) return <div>Loading roster...</div>;
//     if (error) return <div>{error}</div>;

//     return (
//       <Layout showLeagueNavbar={true}>
//           <DndProvider backend={HTML5Backend}>
//               <Tabs>
//                   <TabList>
//                       <Tab>Offense</Tab>
//                       <Tab>Defense</Tab>
//                   </TabList>
//                   <TabPanel>
//                       <DroppableArea onDrop={(player) => movePlayer(player.id)}>
//                           {roster.filter(player => player.offensive && player.status === 'Active').map(player => (
//                               <DraggablePlayer key={player.id} player={player} type="player" movePlayer={movePlayer} />
//                           ))}
//                       </DroppableArea>
//                       <div style={{ minHeight: '300px', padding: '10px', backgroundColor: '#e1e1e1' }}>
//                           {roster.filter(player => player.offensive && player.status !== 'Active').map(player => (
//                               <DraggablePlayer key={player.id} player={player} type="player" movePlayer={movePlayer} />
//                           ))}
//                       </div>
//                       <button onClick={() => saveLineup('offense')}>Save Offense Lineup</button>
//                   </TabPanel>
//                   <TabPanel>
//                       <div>
//                           <div>QB</div>
//                           <DroppableArea position="QB" onDrop={(player) => movePlayer(player.id, 'QB')}>
//                               {roster.filter(player => player.offensive && player.status === 'Active' && player.position_name === 'QB').map(player => (
//                                   <DraggablePlayer key={player.id} player={player} type="player" movePlayer={movePlayer} />
//                               ))}
//                           </DroppableArea>
//                       </div>
//                       <div className="position-container">
//                         <div className="position-label">RB</div>
//                         <div className="droppable-area">
                          
//                           <DroppableArea position="RB" onDrop={(player) => movePlayer(player.id, 'RB')}>
//                               {roster.filter(player => player.offensive && player.status === 'Active' && player.position_name === 'RB').map(player => (
//                                   <DraggablePlayer key={player.id} player={player} type="player" movePlayer={movePlayer} />
//                               ))}
//                           </DroppableArea>
//                       </div>
//                       </div>
//                       <div style={{ minHeight: '300px', padding: '10px', backgroundColor: '#e1e1e1' }}>
//                           {roster.filter(player => player.offensive && player.status !== 'Active').map(player => (
//                               <DraggablePlayer key={player.id} player={player} type="player" movePlayer={movePlayer} />
//                           ))}
//                       </div>
//                       <button onClick={() => saveLineup('offense')}>Save Offense Lineup</button>
//                   </TabPanel>
//               </Tabs>
//           </DndProvider>
//       // </Layout>
//   );
// };

// export default RosterPage;



