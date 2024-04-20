import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/authContext'
import Layout from '../components/layout'
import { Container, Form, Button, Card } from 'react-bootstrap'

const Login = () => {
  const {loginUser} = useContext(AuthContext)

  const handleSubmit = (e) => {
    e.preventDefault()

    const email = e.target.email.value
    const password = e.target.password.value

    loginUser(email, password)
  }
  return (
    <Layout >
     <Container style={{ maxWidth: '600px', marginTop: '20px' }}>
        <Card>
          <Card.Body>
            <h1 className="text-center mb-4">Login</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label><strong>Email</strong></Form.Label>  
                <Form.Control type="email" name="email" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Password</strong></Form.Label> 
                <Form.Control type="password" name="password" required />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="success" type="submit" size="lg">
                  Login
                </Button>
              </div>

              <div className="mt-3 text-center">
                Don't Have an Account?
                <Link to="/signup" className="ms-2">Sign Up!</Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  )
}

export default Login