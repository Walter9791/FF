import React, {useState, useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from "../context/authContext"
import Layout from '../components/layout'
import { Container, Form, Button, Card } from 'react-bootstrap'


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
    <Layout>
    <Container className='p-4'>
        <Card>
          <Card.Body>
            <h1 className="text-center">Sign Up</h1>
            <p className="text-center">Create a new account</p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control 
                  type="text" 
                  value={first_name}
                  onChange={(e) => setFirst_name(e.target.value)}
                  required />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control 
                  type="text" 
                  value={last_name}
                  onChange={(e) => setLast_name(e.target.value)}
                  required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">Register</Button>
            </Form>
            <div className="mt-3 text-center">
              Already have an account? 
              <Link to="/login" className="ms-2">Login</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  )
}

export default Register