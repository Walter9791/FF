import React, { useState, useEffect } from 'react';
import useAxios from '../../utils/useAxios';
import Layout from '../../components/layout';
import { useLeague } from '../../context/LeagueContext';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const Matchup = () => {
    const [roster, setRoster] = useState([]);
    const [opponentRoster, setOpponentRoster] = useState([]);
    const [bench, setBench] = useState([]);
    const [opponentBench, setOpponentBench] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const api = useAxios();
    const { leagueId, teamId } = useLeague();

    const offensivePositionOrder = ['QB', 'WR', 'WR', 'RB', 'TE', 'X', 'T', 'T', 'G', 'G', 'C'];
    const defensivePositionOrder = ['DT', 'DE', 'LB', 'CB', 'S', 'K', 'P'];

    useEffect(() => {
        const fetchMatchupAndRoster = async () => {
            try {
                const matchupResponse = await api.get(`/leagues/${leagueId}/teams/${teamId}/matchup/2/`);
                console.log("Matchup Response Data:", matchupResponse.data);
                if (matchupResponse.data) {
                    const { home_team, away_team } = matchupResponse.data;
                    const isHome = home_team.id === teamId;
                    const myTeam = isHome ? home_team : away_team;
                    const opponentTeam = isHome ? away_team : home_team;

                    setRoster(myTeam.active_roster_spots);  // Your team's active roster spots
                    setBench(myTeam.bench_spots);  // Your team's bench roster spots
                    // console.log('Set Roster:', myTeam.active_roster_spots);
                    setOpponentRoster(opponentTeam.active_roster_spots);  // Opponent's active roster spots
                    setOpponentBench(opponentTeam.bench_spots);  // Opponent's bench roster spots
                    // console.log('Set Opponent Roster:', opponentTeam.active_roster_spots);
                }
            } catch (error) {
                console.error("Failed to fetch matchup and roster", error);
                setError("Failed to load matchup and roster data.");
            } finally {
                setLoading(false);
            }
        };

        fetchMatchupAndRoster();
    }, [leagueId, teamId]);

    const sortByPosition = (players, positionOrder) => {
        const positionIndex = position => {
            const index = positionOrder.indexOf(position.position_name);
            return index === -1 ? positionOrder.length : index;
        };
        return players.sort((a, b) => positionIndex(a) - positionIndex(b));
    };

    const processRoster = (roster, positionOrder) => ({
        active: sortByPosition(roster.filter(player => player.status === 'Active'), positionOrder),
        benched: sortByPosition(roster.filter(player => player.status !== 'Active'), positionOrder)
    });

    const myOffensive = processRoster(roster.filter(player => player.offensive), offensivePositionOrder);
    const myOffensiveBench = processRoster(bench.filter(player => player.offensive), offensivePositionOrder);
    const myDefensive = processRoster(roster.filter(player => !player.offensive), defensivePositionOrder);
    const myDefensiveBench = processRoster(bench.filter(player => !player.offensive), defensivePositionOrder);
    const opponentOffensive = processRoster(opponentRoster.filter(player => player.offensive), offensivePositionOrder);
    const oppenentOffensiveBench = processRoster(opponentBench.filter(player => player.offensive), offensivePositionOrder);
    const opponentDefensive = processRoster(opponentRoster.filter(player => !player.offensive), defensivePositionOrder);
    const opponentDefensiveBench = processRoster(opponentBench.filter(player => !player.offensive), defensivePositionOrder);
    

    // console.log('My Offensive Active:', myOffensive.active);
    // console.log('My Offensive Benched:', myOffensive.benched);
    // console.log('Opponent Offensive Active:', opponentOffensive.active);
    // console.log('Opponent Offensive Benched:', opponentOffensive.benched);

    const RosterTable = ({ players, title }) => (
        <div>
            <h4>{title}</h4>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Pos.</th>
                        <th>Opponent</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map(player => (
                        <tr key={player.id}>
                            <td>{player.player_name}</td>
                            <td>{player.position_name}</td>
                            <td>{player.opponent}</td>
                            <td>{player.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <Layout showLeagueNavbar={true} customClass='schedule-container'>
            <div>
                <h2>Week 2 Matchup</h2>
                <div className="roster-container" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                    <div className="team-section">
                        <h3>My Team</h3>
                        <Tabs>
                            <TabList>
                                <Tab>Offense</Tab>
                                <Tab>Defense</Tab>
                            </TabList>
                            <TabPanel>
                                <RosterTable players={myOffensive.active} title="Starting Offense" />
                                <RosterTable players={myOffensiveBench.benched} title="Benched Offense" />
                            </TabPanel>
                            <TabPanel>
                                <RosterTable players={myDefensive.active} title="Starting Defense" />
                                <RosterTable players={myDefensiveBench.benched} title="Benched Defense" />
                            </TabPanel>
                        </Tabs>
                    </div>
                    <div className="team-section">
                        <h3>Opponent's Team</h3>
                        <Tabs>
                            <TabList>
                                <Tab>Offense</Tab>
                                <Tab>Defense</Tab>
                            </TabList>
                            <TabPanel>
                                <RosterTable players={opponentOffensive.active} title="Opponent's Offense" />
                                <RosterTable players={oppenentOffensiveBench.benched} title="Opponent's Benched Offense" />
                            </TabPanel>
                            <TabPanel>
                                <RosterTable players={opponentDefensive.active} title="Opponent's Defense" />
                                <RosterTable players={opponentDefensiveBench.benched} title="Opponent's Benched Defense" />
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Matchup;




// import React, { useState, useEffect } from 'react';
// import useAxios from '../../utils/useAxios';
// import Layout from '../../components/layout';
// import { useLeague } from '../../context/LeagueContext';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';


// const Matchup = () => {
//     const [roster, setRoster] = useState([]);
//     const [opponentRoster, setOpponentRoster] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [opponentActiveOffensivePlayers, setOpponentActiveOffensivePlayers] = useState([]);
//     const [opponentBenchedOffensivePlayers, setOpponentBenchedOffensivePlayers] = useState([]);
//     const [opponentActiveDefensivePlayers, setOpponentActiveDefensivePlayers] = useState([]);
//     const [opponentBenchedDefensivePlayers, setOpponentBenchedDefensivePlayers] = useState([]);
//     const api = useAxios();
//     const { leagueId, teamId } = useLeague();

//     useEffect(() => {
//         const fetchMatchupAndRoster = async () => {
//             try {
//                 const matchupResponse = await api.get(`/leagues/${leagueId}/teams/${teamId}/matchup/2/`);
//                 if (matchupResponse.data) {
//                     const { home_team, away_team } = matchupResponse.data;
//                     const isHome = home_team.id === teamId;
//                     const myTeam = isHome ? home_team : away_team;
//                     const opponentTeam = isHome ? away_team : home_team;

//                     setRoster(myTeam.active_roster_spots);  // Your team's active roster spots
//                     setOpponentRoster(opponentTeam.active_roster_spots);  // Opponent's active roster spots
                    
//                     // After setting opponent roster, calculate active and benched players
//                     setOpponentActiveOffensivePlayers(opponentTeam.active_roster_spots.filter(player => player.offensive && player.status === 'Active'));
//                     setOpponentBenchedOffensivePlayers(opponentTeam.active_roster_spots.filter(player => player.offensive && player.status !== 'Active'));
//                     setOpponentActiveDefensivePlayers(opponentTeam.active_roster_spots.filter(player => !player.offensive && player.status === 'Active'));
//                     setOpponentBenchedDefensivePlayers(opponentTeam.active_roster_spots.filter(player => !player.offensive && player.status !== 'Active'));
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch matchup and roster", error);
//                 setError("Failed to load matchup and roster data.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMatchupAndRoster();
//     }, [leagueId, teamId]); 


//     const offensivePositionOrder = ['QB', 'WR', 'WR', 'RB', 'TE', 'X', 'T', 'T', 'G', 'G', 'C'];
//     const defensivePositionOrder = ['DT', 'DE', 'LB', 'CB', 'S', 'K', 'P'];
    
  
  
//     const sortByPosition = (players, positionOrder) => {
//         const positionIndex = position => {
//             const index = positionOrder.indexOf(position.position_name);
//             return index === -1 ? positionOrder.length : index;
//         };
//         return players.sort((a, b) => positionIndex(a) - positionIndex(b));
//     };

//     const processRoster = (roster, positionOrder) => ({
//         active: sortByPosition(roster.filter(player => player.status === 'Active'), positionOrder),
//         benched: sortByPosition(roster.filter(player => player.status !== 'Active'), positionOrder)
//     });
  
//     const myOffensive = processRoster(roster.filter(player => player.offensive), offensivePositionOrder);
//     const myDefensive = processRoster(roster.filter(player => !player.offensive), defensivePositionOrder);
//     const opponentOffensive = processRoster(opponentRoster.filter(player => player.offensive), offensivePositionOrder);
//     const opponentDefensive = processRoster(opponentRoster.filter(player => !player.offensive), defensivePositionOrder);


  
//     // const activeOffensivePlayers = offensivePlayers.filter(player => player.status === 'Active');
//     // const benchedOffensivePlayers = offensivePlayers.filter(player => player.status !== 'Active');
//     // const activeDefensivePlayers = defensivePlayers.filter(player => player.status === 'Active');
//     // const benchedDefensivePlayers = defensivePlayers.filter(player => player.status !== 'Active');
  
//     console.log("Active Offensive Players:", activeOffensivePlayers);
//     console.log("Benched Offensive Players:", benchedOffensivePlayers);
//     console.log("Active Defensive Players:", activeDefensivePlayers);
//     console.log("Benched Defensive Players:", benchedDefensivePlayers);


//     const RosterTable = ({ players, title }) => (
//         <div>
//             <h4>{title}</h4>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Player</th>
//                         <th>Position</th>
//                         <th>Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {players.map(player => (
//                         <tr key={player.id}>
//                             <td>{player.player_name}</td>
//                             <td>{player.position_name}</td>
//                             <td>{player.status}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );

//     return (
//         <Layout showLeagueNavbar={true} customClass='schedule-container'>
//             <div>
//                 <h2>Team Roster</h2>
//                 <div className="roster-container" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
//                     <div className="team-section">
//                         <h3>My Team</h3>
//                         <Tabs>
//                             <TabList>
//                                 <Tab>Offense</Tab>
//                                 <Tab>Defense</Tab>
//                             </TabList>
//                             <TabPanel>
//                                 <RosterTable players={myOffensive.active} title="Starting Offense" />
//                                 <RosterTable players={myOffensive.benched} title="Benched Offense" />
//                             </TabPanel>
//                             <TabPanel>
//                                 <RosterTable players={myDefensive.active} title="Starting Defense" />
//                                 <RosterTable players={myDefensive.benched} title="Benched Defense" />
//                             </TabPanel>
//                         </Tabs>
//                     </div>
//                     <div className="team-section">
//                         <h3>Opponent's Team</h3>
//                         <Tabs>
//                             <TabList>
//                                 <Tab>Offense</Tab>
//                                 <Tab>Defense</Tab>
//                             </TabList>
//                             <TabPanel>
//                                 <RosterTable players={opponentOffensive.active} title="Opponent's Offense" />
//                                 <RosterTable players={opponentOffensive.benched} title="Opponent's Benched Offense" />
//                             </TabPanel>
//                             <TabPanel>
//                                 <RosterTable players={opponentDefensive.active} title="Opponent's Defense" />
//                                 <RosterTable players={opponentDefensive.benched} title="Opponent's Benched Defense" />
//                             </TabPanel>
//                         </Tabs>
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default Matchup;


