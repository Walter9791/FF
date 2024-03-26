import { jwtDecode } from 'jwt-decode'
import React, {useContext} from 'react'
import AuthContext from "../context/authContext"
import { Link } from 'react-router-dom'
import Layout from '../components/layout'

const Home = () => {
  const {user, logoutUser} = useContext(AuthContext)
  const token = localStorage.getItem("authTokens")

  let user_id = null
  if (user){
    const decoded = jwtDecode(token)
    user_id = decoded.user_id
  }

  return (
    <Layout>
    <div className='Home'>
      <h1>Homepage</h1>
      <p>This is the Homepage</p>

      {user ?
        <>
          <span>You are logged in</span>
          <br />
          <br />
          <Link to="/profile">Profile</Link>
          <br />
          <Link onClick={logoutUser}>Logout</Link>
        </>
      :
        <>
          <span>You are not logged in</span>
          <br />
          <br />
          <Link to="/login">Login</Link>
          <br />
          <Link to="/signup">Sign Up</Link>
        </>
      }
    </div>
  </Layout>  
  )
}

export default Home