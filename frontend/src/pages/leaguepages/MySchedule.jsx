import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from '../../utils/useAxios';
import Layout from '../../components/layout';
import ReactPaginate from 'react-paginate';

const MatchupsPage = () => {
  const { leagueId, teamId } = useParams();
  const [matchups, setMatchups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const api = useAxios();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchMatchups = async () => {
      try {
        const response = await api.get(`/leagues/${leagueId}/teams/${teamId}/schedule`);
        console.log(response.data);
        setMatchups(response.data);
      } catch (error) {
        setError("Failed to load matchup data.");
        console.error("Failed to fetch matchups", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchups();
  }, [leagueId, teamId]);

  const pageCount = Math.ceil(matchups.length / itemsPerPage);
  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const currentItems = matchups.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  if (loading) return <div>Loading matchups...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Layout showLeagueNavbar={true}>
        <div className="matchups-container">
            <h2>Matchups</h2>
            <table>
                <thead>
                <tr>
                    <th>Week</th>
                    <th>Home Team</th>
                    <th>Away Team</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map((matchup) => (
                    <tr key={matchup.id}>
                        <td>{matchup.week}</td>
                        <td>{matchup.home_team_name}</td>
                        <td>{matchup.away_team_name}</td>
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
        </div>
    </Layout>
  );
};

export default MatchupsPage;






// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import useAxios from '../../utils/useAxios';
// import Layout from '../../components/layout';
// import ReactPaginate from 'react-paginate';

// const MatchupsPage = () => {
//   const { leagueId, teamId } = useParams();
//   const [matchups, setMatchups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const api = useAxios();
//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     const fetchMatchups = async () => {
//       try {
//         const response = await api.get(`/leagues/${leagueId}/teams/${teamId}/schedule`);
//         console.log(response.data);
//         setMatchups(response.data);
//       } catch (error) {
//         setError("Failed to load matchup data.");
//         console.error("Failed to fetch matchups", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatchups();
//   }, [leagueId]);

//   const pageCount = Math.ceil(matchups.length / itemsPerPage);
//   const handlePageClick = ({ selected: selectedPage }) => {
//     setCurrentPage(selectedPage);
//   };

//   const currentItems = matchups.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

//   if (loading) return <div>Loading matchups...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <Layout showLeagueNavbar={true}>
//         <div className="matchups-container">
//             <h2>Matchups</h2>
//             <table>
//                 <thead>
//                 <tr>
//                     <th>Week</th>
//                     <th>Home Team</th>
//                     <th>Away Team</th>
//                     <th>Date</th>
//                     <th>Home Score</th>
//                     <th>Away Score</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {currentItems.map((matchup) => (
//                     <tr key={matchup.id}>
//                         <td>{matchup.week}</td>
//                         <td>{matchup.home_team.name}</td>
//                         <td>{matchup.away_team.name}</td>
//                         <td>{matchup.date}</td>
//                         <td>{matchup.home_score || 'N/A'}</td>
//                         <td>{matchup.away_score || 'N/A'}</td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>
//             <ReactPaginate
//               previousLabel={"← Previous"}
//               nextLabel={"Next →"}
//               pageCount={pageCount}
//               onPageChange={handlePageClick}
//               containerClassName={"pagination"}
//               previousLinkClassName={"pagination__link"}
//               nextLinkClassName={"pagination__link"}
//               disabledClassName={"pagination__link--disabled"}
//               activeClassName={"pagination__link--active"}
//             />
//         </div>
//     </Layout>
//   );
// };

// export default MatchupsPage;