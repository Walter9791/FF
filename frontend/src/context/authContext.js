import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {useNavigate} from 'react-router-dom'

const swal = require('sweetalert2')

export const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem("authTokens") ? 
        JSON.parse(localStorage.getItem("authTokens"))
        : null
    );

    const [user, setUser] = useState(
        localStorage.getItem("authTokens") ? 
        jwtDecode(localStorage.getItem("authTokens"))
        : null
    )

    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const loginUser = async (email, password) => {
        let url = "http://127.0.0.1:8000/api/token/"
        const response = await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        })
        const data = await response.json()

        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data));
            navigate("/")
            swal.fire({
                title: "Login Success",
                icon: "success",
                toast: true,
                timer: 4000,
                position: 'top-right',
                timerProgressBar: false,
                showConfirmButton: false
            })
        } else {
            console.log(response.status)
            console.log("An Error Occured")
            swal.fire({
                title: "Email or password incorrect",
                icon: "error",
                toast: true,
                timer: 4000,
                position: 'top-right',
                timerProgressBar: false,
                showConfirmButton: false
            })
        }
    }    
    const registerUser = async (first_name, last_name, email, username, password, password2) => {
        let url = "http://127.0.0.1:8000/api/register/"
        const response = await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({first_name, last_name,email, username, password, password2})
        })
        const data = await response.json()

        if (response.status === 201){
            navigate('/login')
            swal.fire({
                title: "Registration Success",
                icon: "success",
                toast: true,
                timer: 4000,
                position: 'top-right',
                timerProgressBar: false,
                showConfirmButton: false
            })
        } else {
            console.log(response.status)
            console.log("An Error Occured")
            console.log(data)
            swal.fire({
                title: "There was a server error",
                icon: "error",
                toast: true,
                timer: 4000,
                position: 'top-right',
                timerProgressBar: false,
                showConfirmButton: false
            })
        }
    }      

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        navigate('/login')
        swal.fire({
            title: "You have been logged out",
            icon: "success",
            toast: true,
            timer: 4000,
            position: 'top-right',
            timerProgressBar: false,
            showConfirmButton: false
        })
    }

    const contextData = {
        user,setUser,
        authTokens, setAuthTokens,
        registerUser, loginUser, logoutUser
    }

    useEffect(()=>{
        if (authTokens) {
            setUser(jwtDecode(authTokens.access))
        }
        setLoading(false)
    }, [authTokens])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}