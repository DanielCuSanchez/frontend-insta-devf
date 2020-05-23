import React, { useState } from 'react';
import Main from '../Componentes/Main'
import { Link } from 'react-router-dom'
//import Axios from 'axios'

export default function Login({ login, mostrarError }) {
    const [emailYPassword, setEmailYPassword] = useState({
        email: '',
        password: ''
    })
    function handleInputChange(e) {
        // e.persist()
        setEmailYPassword({
            ...emailYPassword,
            [e.target.name]: e.target.value
        })
        console.log(emailYPassword)

    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            //const { data } = await Axios.post('http://localhost:3000/api/usuarios/login', emailYPassword)
            await login(emailYPassword.email, emailYPassword.password)
            //console.log(data)
        } catch (error) {
            mostrarError(error.response.data)
            console.log(error)
        }
    }

    return (
        <Main center>
            <div className="FormContainer">
                <h1 className="Form__titulo">
                    Login
                </h1>
                <form onSubmit={handleSubmit}>
                    <input type="email"
                        name="email" placeholder="Email"
                        className="Form__field"
                        required
                        onChange={handleInputChange}
                        value={emailYPassword.email}
                    />
                    <input type="password"
                        name="password" placeholder="Contraseña"
                        className="Form__field"
                        minLength="8"
                        maxLength="30"
                        required
                        onChange={handleInputChange}
                        value={emailYPassword.password}
                    />
                    <button className="Form__submit">Login</button>
                    <p className="FormContainer__info">
                        No tienes cuenta?
                        <Link to="/signup">Signup</Link>
                    </p>
                </form>

            </div>
        </Main>
    )
}