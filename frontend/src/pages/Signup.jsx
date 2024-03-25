import React, {useState, useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from "../context/authContext"


const Register = () => {
  const [first_name, setFirst_name] = useState("")
  const [last_name, setLast_name] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")

  const {registerUser} = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(first_name)
    console.log(last_name)
    console.log(email)
    console.log(username)

    registerUser(first_name, last_name, email, username, password, password2)
  }

  return (
    <div className='register'>
      <h1>Register</h1>
      <p>Create a new account</p>

      <form>
        <label>First Name:</label>
        <input 
          type="text" 
          name="first_name"
          onChange={(e)=>setFirst_name(e.target.value)}
          required />
        
        <label>Last Name:</label>
        <input 
          type="text" 
          name="last_name"
          onChange={(e)=>setLast_name(e.target.value)}
          required />

        <label>Email:</label>
        <input 
          type="email" 
          name="email"
          onChange={(e)=>setEmail(e.target.value)}
          required />

        <label>Username:</label>
        <input 
          type="text" 
          name="username"
          onChange={(e)=>setUsername(e.target.value)}
          required />

        <label>Password:</label>
        <input 
          type="password" 
          name="password"
          onChange={(e)=>setPassword(e.target.value)}
          required />

        <label>Confirm Password:</label>
        <input 
          type="password" 
          name="password2"
          onChange={(e)=>setPassword2(e.target.value)}
          required />

        <div className='btn-container'>
          <button onClick={handleSubmit} type='button'>Register</button>
        </div>
        <span>Already Have an Account; 
          <Link to="/login">Login</Link>
        </span>

      </form>
    </div>
  )
}

export default Register