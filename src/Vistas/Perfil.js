import React, { useEffect, useState } from 'react';
import Loading from '../Componentes/Loading'
import Grid from '../Componentes/Grid'
import RecursoNoExiste from '../Componentes/RecursoNoExiste'
import Main from '../Componentes/Main'
import Axios from 'axios'
import StringToColor from 'string-to-color'
import toggleSiguiendo from '../Helpers/amistad-helpers';
import useEsMobil from '../Hooks/useEsMobil'

export default function Perfil({ usuario, mostrarError, match, logout }) {
    const username = match.params.username
    const [usuarioDueñoDelPerfil, setUsuarioDueñoDelPerfil] = useState(true)
    const [posts, setPosts] = useState([])
    const [cargandoPerfil, setCargandoPerfil] = useState(true)
    const [subiendoImagen, setSubiendoImagen] = useState(false)
    const [perfilNoExiste, setPerfilNoExiste] = useState(false)
    const [enviandoAmistad, setEnviandoAmistad] = useState(false)
    const esMobil = useEsMobil()
    useEffect(() => {
        async function cargaPostYUsuario() {
            try {
                setCargandoPerfil(true)
                const { data: usuario } = await Axios.get(`/api/usuarios/${username}`)
                const { data: posts } = await Axios.get(`/api/posts/usuario/${usuario._id}`)
                setUsuarioDueñoDelPerfil(usuario)
                setPosts(posts)
                setCargandoPerfil(false)
            } catch (error) {
                if (error.response &&
                    (error.response.status === 400
                        || error.response.status === 404)) {
                    setPerfilNoExiste(true)
                }
                else {
                    mostrarError('No pudimos cargar el perfil')
                }
                setCargandoPerfil(false)
            }
        }
        cargaPostYUsuario()
    }, [username])
    if (cargandoPerfil) {
        return (
            <Main center>
                <Loading />
            </Main>
        )
    }
    if (perfilNoExiste) {
        return (
            <RecursoNoExiste mensaje="El perfil no exite" />
        )
    }
    function esElPerfilDeLogin() {
        return usuario._id === usuarioDueñoDelPerfil._id
    }

    async function onToggleSiguiendo() {
        if (enviandoAmistad) {
            return
        }
        try {
            setEnviandoAmistad(true)
            const usuarioActualizado = await toggleSiguiendo(usuarioDueñoDelPerfil)
            setUsuarioDueñoDelPerfil(usuarioActualizado)
            setEnviandoAmistad(false)

        } catch (error) {
            mostrarError('Hubo un problema')
            setEnviandoAmistad(false)
            console.log(error)
        }
    }

    async function handleImagenSeleccionada(event) {
        try {
            setSubiendoImagen(true)
            const file = event.target.files[0]
            const config = {
                headers: {
                    'Content-Type': file.type
                }
            }
            const { data } = await Axios.post('/api/usuarios/upload', file, config)
            setUsuarioDueñoDelPerfil({ ...usuarioDueñoDelPerfil, imagen: data.url })
            setSubiendoImagen(false)
        } catch (error) {
            mostrarError(error.response.data)
            setSubiendoImagen(false)
            console.log(error);
        }
    }

    return (
        <Main>
            <div className="Perfil">
                <ImagenAvatar
                    esElPerfilDeLogin={esElPerfilDeLogin}
                    usuarioDueñoDelPerfil={usuarioDueñoDelPerfil}
                    handleImagenSeleccionada={handleImagenSeleccionada}
                    subiendoImagen={subiendoImagen}
                />

                <div className='Perfil__bio-container'>
                    <div className='Perfil__bio-heading'>
                        <h2 className="capitalize">
                            {
                                usuarioDueñoDelPerfil.username
                            }
                        </h2>
                        {
                            !esElPerfilDeLogin() && (<BotonSeguir
                                siguiendo={usuarioDueñoDelPerfil.siguiendo}
                                toggleSiguiendo={onToggleSiguiendo}
                            />)
                        }
                        {
                            esElPerfilDeLogin() && (<BotonLogout logout={logout} />)
                        }
                    </div>
                    {
                        !esMobil && <DescripcionPerfil usuarioDueñoDelPerfil={usuarioDueñoDelPerfil} />
                    }
                </div>
            </div>
            {
                esMobil&&<DescripcionPerfil usuarioDueñoDelPerfil={usuarioDueñoDelPerfil} />
            }
            <div className="Perfil__separador">
                {posts.length > 0 ? <Grid posts={posts}/>: <NoHaPosteadoFotos/>}
            </div>
        </Main>
    )
}
function NoHaPosteadoFotos(){
    return <p className="text-center">Este usuario no ha posteado fotos</p>
}

function BotonSeguir({ siguiendo, toggleSiguiendo }) {
    return (
        <button onClick={toggleSiguiendo} className="Perfil__boton-seguir">
            {
                siguiendo ?
                    'Dejar de seguir'
                    :
                    'Seguir '
            }
        </button>
    )
}
function BotonLogout({ logout }) {
    return (
        <button
            className="Perfil__boton-logout"
            onClick={logout}
        >Logout</button>
    )
}
function DescripcionPerfil({ usuarioDueñoDelPerfil }) {
    return (
        <div className="Perfil__descripcion">
            <h2 className="Perfil__nombre">
                {usuarioDueñoDelPerfil.nombre}
            </h2>
            <p> {usuarioDueñoDelPerfil.bio}</p>
            <p className="Perfil__estadisticas">
                <b>{usuarioDueñoDelPerfil.numSiguiendo}</b> following
                <span className="ml-4">
                    <b>{usuarioDueñoDelPerfil.numSeguidores}</b> followers
                </span>
            </p>

        </div>
    )
}
function ImagenAvatar({
    esElPerfilDeLogin,
    usuarioDueñoDelPerfil,
    handleImagenSeleccionada,
    subiendoImagen
}) {
    let contenido;

    if (subiendoImagen) {
        contenido = <Loading />
    } else if (esElPerfilDeLogin) {
        contenido = (
            <label className="Perfil__img-placeholder Perfil__img-placeholder--pointer"
                style={
                    {
                        backgroundImage: usuarioDueñoDelPerfil.imagen
                            ? `url(${usuarioDueñoDelPerfil.imagen})`
                            : null,
                        backgroundColor: StringToColor(usuarioDueñoDelPerfil.username)
                    }
                }
            >
                <input type="file"
                    onChange={handleImagenSeleccionada}
                    className="hidden"
                    name="imagen"
                />
            </label>
        )
    }
    else {
        contenido = (
            <div className="¨Perfil__img-placeholder" style={{
                backgroundImage: usuarioDueñoDelPerfil.imagen
                    ? `url(${usuarioDueñoDelPerfil.imagen})`
                    : null,
                backgroundColor: StringToColor(usuarioDueñoDelPerfil.username)
            }}></div>
        )
    }

    return <div className="Perfil__img-container">{contenido}</div>
}