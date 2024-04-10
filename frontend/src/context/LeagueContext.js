import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const LeagueContext = createContext();

export const useLeague = () => useContext(LeagueContext);

export const LeagueProvider = ({ children }) => {
  const [leagueId, setLeagueId] = useState(null);
  const [teamId, setTeamId] = useState(null);

  // Function to update both leagueId and teamId
  const updateLeagueAndTeam = useCallback((newLeagueId, newTeamId) => {
    setLeagueId(newLeagueId);
    setTeamId(newTeamId);
  }, []); 

  const contextValue = useMemo(() => ({
    leagueId, teamId, updateLeagueAndTeam
  }), [leagueId, teamId, updateLeagueAndTeam]);

  return (
    <LeagueContext.Provider value={contextValue}>
      {children}
    </LeagueContext.Provider>
  );
};

