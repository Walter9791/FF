import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/authContext'
import Layout from '../components/layout'

const Login = () => {
  const {loginUser} = useContext(AuthContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log(e.target)

    const email = e.target.email.value
    const password = e.target.password.value

    loginUser(email, password)
  }
  return (
    <Layout customClass=''>
    <div className='login'>
      <h1>Login</h1>
      <p>Sign Into Your Account</p>

      <form onSubmit={handleSubmit}>
        
        <label>Email:</label>
        <input 
          type="email" 
          name="email"
          required />

        <label>Password:</label>
        <input 
          type="password" 
          name="password"
          required />

        <div className='btn-container'>
          <button type='submit'>Login</button>
        </div>
        <span>Don't Have an Account?     
          <Link to="/signup">Sign Up!</Link>
        </span>

      </form>
    </div>
    </Layout>
  )
}

export default Login