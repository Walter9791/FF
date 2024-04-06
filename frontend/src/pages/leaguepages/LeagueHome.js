import React from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import Layout from '../../components/layout';

const LeaguePage = () => {
  const { leagueId } = useParams();

  return (
      <div>
        <Layout showLeagueNavbar = {true} />
        <h2>League Navbar</h2>
        <nav className='league-navbar'>
          <Link to={`/my-leagues/${leagueId}/roster`}>My Roster</Link> |{" "}
          <Link to={`/my-leagues/${leagueId}/matchup`}>Matchup</Link> |{" "}
          <Link to={`/my-leagues/${leagueId}/schedule`}>My Schedule</Link> |{" "}
          <Link to={`/my-leagues/${leagueId}/free-agency`}>Free Agency</Link> |{" "}
          <Link to={`/my-leagues/${leagueId}/rosters`}>League Rosters</Link> |{" "}
          <Link to={`/my-leagues/${leagueId}/settings`}>Settings</Link>
        </nav>
      </div>
  );
};

export default LeaguePage;
