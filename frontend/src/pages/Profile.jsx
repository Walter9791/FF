import React, {useState, useContext, useEffect} from 'react'
import useAxios from "../utils/useAxios"
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import AuthContext from '../context/authContext'
import Layout from '../components/layout'
import {Form, Button, Container, Card } from 'react-bootstrap'

const Profile = () => {
  const [response, setResponse] = useState("")
  const [editable, setEditable] = useState(false)
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
    <Layout>
    <Container style={{ minWidth: '400px', marginTop: '20px' }}>
        <Card>
          <Card.Body>
            <Card.Title>{editable ? 'Edit Profile' : 'View Profile'}</Card.Title>
            <Form inline>
              <Form.Group className="mb-3">
                <Form.Label>Username:</Form.Label>
                <Form.Control type="text" defaultValue={username} readOnly={!editable} />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email:</Form.Label>
                <Form.Control type="email" defaultValue={email} readOnly={!editable} />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>First Name:</Form.Label>
                <Form.Control type="text" defaultValue={first_name} readOnly={!editable} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Name:</Form.Label>
                <Form.Control type="text" defaultValue={last_name} readOnly={!editable} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label></Form.Label>
                <p className="pt-2">{response || 'No additional information provided.'}</p>
              </Form.Group>
              <div className="mb-3">
                <Button variant="secondary" onClick={() => setEditable(!editable)} className="mr-2">
                  {editable ? 'Cancel' : 'Edit'}
                </Button>
                {editable && <Button variant="primary" type="submit">Save Changes</Button>}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  )
}

export default Profile