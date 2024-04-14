import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from '../../utils/useAxios';
import Layout from '../../components/layout';
import { useLeague } from '../../context/LeagueContext';
import Roster from '../../components/Roster'; 
import ReactPaginate from 'react-paginate';


const RosterPage = () => {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const api = useAxios();
  const { leagueId, teamId, updateLeagueAndTeam } = useLeague();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const response = await api.get(`/leagues/${leagueId}/teams/${teamId}/roster`);
        console.log("API Response:", response.data);  // Logging the API response
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

  const pageCount = Math.ceil(roster.length / itemsPerPage);
  const handlePageClick = ({ selected: selectedPage }) => setCurrentPage(selectedPage);
  const currentItems = roster.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);  

  if (loading) return <div>Loading roster...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Layout showLeagueNavbar={true} customClass='schedule-container'>
      <div>
        <h2>Team Roster</h2>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Status</th>  {/* Changed from Number to Status as jerseyNumber is missing */}
            </tr>
          </thead>
          <tbody>
            {currentItems.map(player => (
              <tr key={player.id}>            
                <td>{player.position_name}</td>
                <td>{player.player_name}</td>
                <td>{player.status}</td> {/* Displaying status instead of non-existent jersey number */}
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
}

export default RosterPage;






// const RosterPage = () => {
//   const [roster, setRoster] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const api = useAxios();
//   const { leagueId, teamId, updateLeagueAndTeam } = useLeague();
//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 10;


//   useEffect(() => {
//     const fetchRoster = async () => {
//       try {
//         const response = await api.get(`/leagues/${leagueId}/teams/${teamId}/roster`);
//         console.log(response.data);
//         setRoster(response.data);
//       } catch (error) {
//         console.error("Failed to fetch roster", error);
//         setError("Failed to load roster data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoster();
//   }, [leagueId, teamId]);

//   const pageCount = Math.ceil(roster.length / itemsPerPage);
  
//   const handlePageClick = ({ selected: selectedPage }) => setCurrentPage(selectedPage);

//   const currentItems = roster.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);  

//   if (loading) return <div>Loading roster...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <Layout showLeagueNavbar={true} customClass='schedule-container'>
//       <div>
//         <h2>Team Roster</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Position</th>
//               <th>Name</th>
//               <th>Number</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roster.map(player => (
//               <tr key={player.id}>            
//                 <td>{player.position}</td>
//                 <td>{player.name}</td>
//                 <td>{player.jerseyNumber}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <ReactPaginate
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
//       </div>
//     </Layout>
//   );
// }

// export default RosterPage;