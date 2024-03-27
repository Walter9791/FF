import React, {useState, useContext, useEffect} from 'react'
import useAxios from "../utils/useAxios"
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import AuthContext from '../context/authContext'
import Layout from '../components/layout'

const Leagues = () => {
  const [response, setResponse] = useState("")
  const api = useAxios();
  const token = localStorage.getItem("authTokens")
  const {logoutUser} = useContext(AuthContext)

  
  const decode = jwtDecode(token)
  console.log(decode)
  let username = decode.username
  

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
    <Layout>
    <div className='profile'>
      <h1>Leagues for {username}</h1>
      <span>Your Information:</span>
      <br />
      <span>Username: {username}</span>
      <br />
      <span>{response}</span>
      <br />
      <Link to="/">Home</Link>
      <br />
      <Link to="/" onClick={logoutUser}>Logout</Link>      
    </div>
    </Layout>
  )
}

export default Leagues