import React, { useEffect, useState } from 'react';
import Main from '../Componentes/Main'
import { Link } from 'react-router-dom'
import { ImagenAvatar } from '../Componentes/Avatar';
import Loading from '../Componentes/Loading'
import Axios from 'axios'
import Grid from '../Componentes/Grid';
export default function Explore({ mostrarError }) {

    const [posts, setPosts] = useState([]);
    const [usuarios, setUsuarios] = useState([])
    const [cargandoLoading, setCargandoLoading] = useState(true)

    useEffect(() => {
        async function cargarUsuariosYPosts() {
            try {
                const [posts, usuarios] = await Promise.all(
                    [
                        Axios.get('/api/posts/explore').then(({ data }) => data),
                        Axios.get('/api/usuarios/explore').then(({ data }) => data)
                    ]
                )
                setPosts(posts)
                setUsuarios(usuarios)
                setCargandoLoading(false)
            } catch (error) {
                setCargandoLoading(false)
                mostrarError('Error')
            }
        }
        cargarUsuariosYPosts()
    }, [])


    return (
        <Main>
            <div className='Explore__section'>
                <div className='Explore__title'>Descubrir usuarios</div>
                <div className='Explore__usuarios-container'>
                    {
                        usuarios.map(usuario => {
                            return (
                                <div className="Explore__usuario" key={usuario._id}>
                                    <ImagenAvatar usuario={usuario} />
                                    <p>{usuario.username}</p>
                                    <Link to={`/perfil/${usuario.username}`}>Ver perfil</Link>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='Explore__section'>
                    <div className='Explore__title'>Posts</div>
                    <Grid posts={posts}/>
                </div>
            </div>
        </Main>
    )
}