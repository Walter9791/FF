import React, { useState, useEffect } from 'react';
import useAxios from "../utils/useAxios";
import Layout from '../components/layout';
import { Link } from 'react-router-dom';

const MyLeagues = () => {
  const [pendingLeagues, setPendingLeagues] = useState([]);
  const [joinedLeagues, setJoinedLeagues] = useState([]);
  const [error, setError] = useState('');
  const api = useAxios();

//   useEffect(() => {
//     const fetchLeaguesData = async () => {
//       try {
//         const pendingResponse = await api.get("/leagues/join-request-statuses/");
//         console.log(pendingResponse.data);
//         setPendingLeagues(pendingResponse.data);

//       } catch (err) {
//         console.error("Error fetching leagues data:", err);
//         setError("Error fetching data. Please try again later.");
//       }
// //     };

//     fetchLeaguesData();
//   }, []);

  useEffect(() => {
    const fetchJoinedLeagues = async () => {
      try {
        const response = await api.get("/leagues/myleagues/"); // Make sure this is your endpoint
        setJoinedLeagues(response.data);
      } catch (err) {
        console.error("Error fetching joined leagues:", err);
        setError("Error fetching joined leagues. Please try again later.");
      }
    };
  
    fetchJoinedLeagues();
  }, []);

  return (
    <Layout>
      <div>
        <h2>My Leagues</h2>
        <ul>
          {joinedLeagues.map((league) => (
            <li key={league.id}>
                <Link to={`/my-leagues/${league.id}`}>{league.name}</Link> - {league.description} - Joined </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export default MyLeagues;