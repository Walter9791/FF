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
    const updatedRoster = roster
      .filter(player => player.tempStatus !== undefined) // Only include players whose status has been changed
      .map(player => ({ id: player.id, status: player.tempStatus, week: player.week }));
  
    const payload = { updatedRoster };
    console.log('Sending the following payload to the backend:', payload); // Log the payload
  
    try {
      const response = await api.post(`leagues/${leagueId}/teams/${teamId}/roster/change/`, payload);
      console.log(response.data); // Handle response appropriately
      alert('Roster updated successfully!');
          // Update the main roster state to reflect the saved changes
      setRoster(currentRoster =>
        currentRoster.map(player => ({
          ...player,
          status: player.tempStatus ? player.tempStatus : player.status,
          tempStatus: undefined, // Clear tempStatus after saving
        }))
      );

      // alert('Roster updated successfully!');


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
                  <select value={player.tempStatus || player.status} onChange={e => handleStatusChange(player.id, e.target.value)}>
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

  // const offensivePlayers = roster.filter(player => player.offensive);
  // const defensivePlayers = roster.filter(player => !player.offensive);

  const offensivePositionOrder = ['QB', 'WR', 'WR', 'RB', 'TE', 'X', 'T', 'T', 'G', 'G', 'C'];
  const defensivePositionOrder = ['DT', 'DE', 'LB', 'CB', 'S', 'K', 'P'];


  const sortByPosition = (players, positionOrder) => {
    const positionIndex = position => positionOrder.indexOf(position.position_name);
    return [...players].sort((a, b) => positionIndex(a) - positionIndex(b));
  };

  const offensivePlayers = sortByPosition(roster.filter(player => player.offensive), offensivePositionOrder);
  const defensivePlayers = sortByPosition(roster.filter(player => !player.offensive), defensivePositionOrder);

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




