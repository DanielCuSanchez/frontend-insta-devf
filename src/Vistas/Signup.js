import React, { useState } from 'react';

import { Link } from 'react-router-dom'
import Main from '../Componentes/Main'
import imageSignup from '../Imagenes/signup.png'

//import Axios from 'axios'


export default function Signup({ signup, mostrarError }) {
    const [usuario, setUsuario] = useState({
        email: '',
        nombre: '',
        username: '',
        bio: '',
        password: ''
    })

    function handleInputChange(e) {
        // e.persist()
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        })
        console.log(usuario)

    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            await signup(usuario)
            // const { data } = await Axios.post('http://localhost:3000/api/usuarios/signup',usuario)
            // console.log(data)
        } catch (error) {
            mostrarError(error)
            console.log(error)
        }
    }



    return (
        <Main center={true}>
            <div className="Signup">
                <img src={imageSignup} alt="" className="Signup__img" />
                <div className="FormContainer">
                    <h1 className="Form__titulo">
                        insta::DEVF
                    </h1>
                    <div className="FormContainer__info">
                        Regístrate para compartir hermosos momasos 😍
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input type="email"
                            name="email" placeholder="Email"
                            className="Form__field"
                            required
                            onChange={handleInputChange}
                            value={usuario.email}
                        />
                        <input type="text"
                            name="nombre" placeholder="Nombre y apellido"
                            className="Form__field"
                            minLength="3"
                            maxLength="100"
                            required
                            onChange={handleInputChange}
                            value={usuario.nombre}
                        />
                        <input type="text"
                            name="username" placeholder="Usuario"
                            className="Form__field"
                            minLength="3"
                            maxLength="30"
                            required
                            onChange={handleInputChange}
                            value={usuario.username}
                        />
                        <input type="text"
                            name="bio" placeholder="Cuéntanos de ti..."
                            className="Form__field"
                            minLength="3"
                            maxLength="30"
                            required
                            onChange={handleInputChange}
                            value={usuario.bio}
                        />
                        <input type="password"
                            name="password" placeholder="Contraseña"
                            className="Form__field"
                            minLength="8"
                            maxLength="30"
                            required
                            onChange={handleInputChange}
                            value={usuario.password}
                        />
                        <button type="submit" className="Form__submit" >Sign up</button>
                        <p className="FormContainer__info">Ya tienes cuenta? <Link to="/login">Log In</Link></p>
                    </form>
                </div>
            </div>
        </Main>
    )
}