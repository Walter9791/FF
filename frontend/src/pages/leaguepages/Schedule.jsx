import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from '../../utils/useAxios';
import Layout from '../../components/layout';
import ReactPaginate from 'react-paginate';


const SchedulePage = () => {
  const { leagueId, teamId } = useParams();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const api = useAxios();
  const [league, setLeague] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await api.get(`/leagues/${leagueId}/schedule`);
        setSchedule(response.data);
        setLeague(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch schedule", error);
        setError("Failed to load schedule data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [leagueId, teamId ]);
  const pageCount = Math.ceil(schedule.length / itemsPerPage); // Calculate total page count
  
  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage); // Update current page
  };

  const currentItems = schedule.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  if (loading) return <div>Loading schedule...</div>;
  if (error) return <div>{error}</div>;



  return (
    <Layout showLeagueNavbar={true} teamId={teamId} customClass='schedule-container'>
      <h2>Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Week</th>
            <th>Matchup</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((matchup) => (
            <tr key={matchup.id}>
              <td>{`Week ${matchup.week}`}</td>
              <td>{matchup.home_team ? matchup.home_team.name : 'N/A'} vs {matchup.away_team ? matchup.away_team.name : 'N/A'}</td>
              <td>{`Score: ${matchup.home_score || 'N/A'} - ${matchup.away_score || 'N/A'}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        previousLinkClassName={"pagination__link"}
        nextLinkClassName={"pagination__link"}
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active"}
      />
    </Layout>
  );
};

export default SchedulePage;
//   return (
//     <div>
//         <Layout showLeagueNavbar={true}>
//       <h2>Schedule</h2>
//       <ul>
//         {schedule.map((matchup) => (
//           <li key={matchup.id}>
//             Week {matchup.week}: {matchup.home_team.name} vs {matchup.away_team.name}
//             <br />Score: {matchup.home_score || 'N/A'} - {matchup.away_score || 'N/A'}
//           </li>
//         ))}
//       </ul>
//         </Layout>
//     </div>
    
//   );
// }



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import useAxios from '../../utils/useAxios';

// const SchedulePage = () => { */}
//   const { leagueId } = useParams();
//   const [schedule, setSchedule] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const api = useAxios();


//   useEffect(() => {
//     const fetchSchedule = async () => {
//       try {
//         const response = await api.get(`leagues/${leagueId}/schedule`);
//         setSchedule(response.data);
//       } catch (error) {
//         console.error("Failed to fetch schedule", error);
//         setError("Failed to load schedule data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSchedule();
//   }, [leagueId]);

//   if (loading) return <div>Loading schedule...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       <h2>Schedule</h2>
//       <ul>
//         {schedule.map((matchup) => (
//           <li key={matchup.id}>{matchup.home_team} vs {matchup.away_team} on {matchup.date}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default SchedulePage;