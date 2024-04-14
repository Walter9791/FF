// LeagueLayout.js
import React, { useEffect, useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import useAxios from '../../utils/useAxios';

const LeagueNavbar = ({ teamId }) => {
  const { leagueId } = useParams();

  return (
    <>
        <nav className='league-navbar'>
            {/* <Link to={`/my-leagues/${leagueId}/roster`}>My Roster</Link> |{" "} */}
            <Link to={`/my-leagues/${leagueId}`}>League Home</Link> {" "}
            <Link to={`/my-leagues/${leagueId}/teams/${teamId}/roster`}>My Roster</Link> {" "}
            <Link to={`/my-leagues/${leagueId}/teams/${teamId}/matchup`}>Matchup</Link> {" "}
            <Link to={`/my-leagues/${leagueId}/teams/${teamId}/schedule`}>My Schedule</Link> {" "}
            <Link to={`/my-leagues/${leagueId}/schedule`}>League Schedule</Link> {" "}
            <Link to={`/my-leagues/${leagueId}/free-agency`}>Free Agency</Link> {" "}
            <Link to={`/my-leagues/${leagueId}/rosters`}>League Rosters</Link> {" "}
            <Link to={`/my-leagues/${leagueId}/teams/${teamId}/settings`}>Settings</Link>
        </nav>
    </>
  );
};

export default LeagueNavbar;
