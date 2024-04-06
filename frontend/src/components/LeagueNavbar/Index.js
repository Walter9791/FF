// LeagueLayout.js
import React from 'react';
import { Link, useParams } from 'react-router-dom';


const LeagueNavbar = () => {
    const { leagueId } = useParams();
  return (
    <>
        <nav className='league-navbar'>
            <Link to={`/my-leagues/${leagueId}/roster`}>My Roster</Link> |{" "}
            <Link to={`/my-leagues/${leagueId}/matchup`}>Matchup</Link> |{" "}
            <Link to={`/my-leagues/${leagueId}/schedule`}>My Schedule</Link> |{" "}
            <Link to={`/my-leagues/${leagueId}/free-agency`}>Free Agency</Link> |{" "}
            <Link to={`/my-leagues/${leagueId}/rosters`}>League Rosters</Link> |{" "}
            <Link to={`/my-leagues/${leagueId}/settings`}>Settings</Link>
        </nav>
    </>
  );
};

export default LeagueNavbar;
