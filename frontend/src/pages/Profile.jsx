import React, {useState, useContext, useEffect} from 'react'
import useAxios from "../utils/useAxios"
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import AuthContext from '../context/authContext'


const Dashboard = () => {
  const [response, setResponse] = useState("")
  const api = useAxios();
  const token = localStorage.getItem("authTokens")
  const {logoutUser} = useContext(AuthContext)

  
  const decode = jwtDecode(token)
  console.log(decode)
  let username = decode.username
  let email = decode.email
  let first_name = decode.first_name
  let last_name = decode.last_name
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/test/")
        setResponse(response.data.response)

      } catch (error) {
        console.log(error)
        setResponse("Something Went Wrong")
      }
    }
    
    fetchData()
    
  }, [])
  

  return (
    <div className='profile'>
      <h1>PROFILE</h1>
      <p>Welcome, {username}</p>
      <span>Your Information:</span>
      <br />
      <span>Username: {username}</span>
      <br />
      <span>First Name: {first_name}</span>
      <br />
      <span>Last Name: {last_name}</span>
      <br />
      <span>Email: {email}</span>
      <br /><br />
      <span>{response}</span>
      <br /><br />
      <Link to="/">Home</Link>
      <br />
      <Link onClick={logoutUser}>Logout</Link>
      
    </div>
  )
}

export default Dashboard