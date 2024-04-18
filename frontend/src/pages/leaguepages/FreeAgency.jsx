import React, { useState, useEffect, useCallback } from 'react';
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
  const [currentPage, setCurrentPage] = useState(0); 
  const [positions, setPositions] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const api = useAxios();
  const { leagueId, teamId } = useLeague();


  const fetchFreeAgentsAndRoster = useCallback(async () => {
    setLoading(true);
    try{
        const [freeAgentResponse, rosterResponse] = await Promise.all([
            api.get(`/leagues/${leagueId}/freeagents/`),
            api.get(`/leagues/${leagueId}/teams/${teamId}/roster/`)
        ]);
        setFreeAgents(freeAgentResponse.data);
        console.log(freeAgentResponse.data);
        setRoster(rosterResponse.data);
        console.log(rosterResponse.data);
        setPositions([...new Set(freeAgentResponse.data.map(agent => agent.position_name))]);
    } catch (error) {
        console.error("Failed to load data", error);
        setError("Failed to load data.");
    } finally {
        setLoading(false);
    }
    }, [leagueId, teamId]);


    useEffect(() => {
        fetchFreeAgentsAndRoster ();
    }, [fetchFreeAgentsAndRoster]);

    const handleAddToTeam = (freeAgent) => {
        setSelectedFreeAgent(freeAgent);
    };

    const handleSelectPlayer = (player_name) => {
        setSelectedPlayer(player_name);
    };

  const handleDropAndAddPlayer = async () => {
    const payload = {
        addPlayerId: selectedFreeAgent.id,
        dropPlayerId: selectedPlayer.id,
        teamId: teamId,    
    };  
    console.log(payload);

    try {
      const response = await api.post(`/leagues/${leagueId}/teams/${teamId}/add-drop/`, { ...payload
      });
      if (response.status === 200) {
        console.log("Roster updated successfully");
        setSelectedFreeAgent(null); 
        setSelectedPlayer(null);
        fetchFreeAgentsAndRoster(); 
      }
    } catch (error) {
      console.error("Failed to update roster", error);
      setError("Failed to update roster.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;


  
  return (
    <Layout showLeagueNavbar={true} customClass='schedule-container'>
      <h2>Free Agency Transactions</h2>
      {selectedFreeAgent && !selectedPlayer ? (
        <RosterTable players={roster} title="Select a Player to Drop" handleSelectPlayer={handleSelectPlayer} />
      ) : selectedFreeAgent && selectedPlayer ? (
        <div className="confimration-page">
          <h3>Confirm Transaction:</h3> 
          <p>Add: {selectedFreeAgent.position_name}, {selectedFreeAgent.name}</p>  
          <p>Drop: {selectedPlayer.position_name}, {selectedPlayer.player_name}</p>
          <button onClick={handleDropAndAddPlayer}>Confirm</button>
          <button customClass='cancel_button' onClick={() => {
            setSelectedPlayer(null);
            setSelectedFreeAgent(null);
          }}>Cancel</button>
        </div>
      ) :  (
        <Tabs>
        <TabList>
          {positions.map((position, index) => (
            <Tab key={index}>{position}</Tab>
          ))}
        </TabList>
        {positions.map((position, index) => (
          <TabPanel key={index}>
            <FreeAgentTable
                players={freeAgents.filter(agent => agent.position_name === position)}
                handleAddToTeam={handleAddToTeam}
              />
          </TabPanel>
        ))}
      </Tabs>
      )}
    </Layout>
  );
};

const RosterTable = ({ players, team, handleSelectPlayer }) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>NFL Team</th>
            <th>Drop</th> 
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id}>
              <td>{player.player_name}</td>
              <td>{player.position_name}</td>
              <td>{player.nfl_abbreviation}</td>
              <td>
                <button onClick={() => handleSelectPlayer(player)}>DROP</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

const FreeAgentTable = ({ players, team, handleAddToTeam }) => {
  return (
    <div>
      <h3>{}</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Experience</th>
            <th>College</th>
            <th>Add to Team</th>
            
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.nfl_abbreviation}</td>
              <td>{player.experience}</td>
              <td>{player.college}</td>
              <td>
                <button onClick={() => handleAddToTeam(player)}>Add</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default FreeAgentsPage;

