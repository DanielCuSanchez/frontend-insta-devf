import React, { useState, useEffect } from 'react'
import Main from '../Componentes/Main'
import Loading from '../Componentes/Loading'
import RecursoNoExiste from '../Componentes/RecursoNoExiste'
import Avatar from '../Componentes/Avatar'
import Comentar from '../Componentes/Comentar'
import BotonLike from '../Componentes/BotonLike'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import { toggleLike, comentar } from '../Helpers/post-helpers';


export default function Post({ mostrarError, match, usuario }) {
    const postID = match.params.id
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [postNoExiste, setPostNoExiste] = useState(false)
    const [enviandoLike, setEnviandoLike] = useState(false)

    useEffect(() => {
        async function cargarPostInicial() {
            try {
                const { data: post } = await Axios.get(`/api/posts/${postID}`)
                setPost(post)
                setLoading(false)
            } catch (error) {
                if (error.response && (error.response.status === 404 || error.response.status === 400)) {
                    setPostNoExiste(true)
                }
                else {
                    mostrarError("Hubo un problema cargando el post")
                }
                setLoading(false)
            }
        }
        cargarPostInicial()
    }, [postID])

    async function onSubmitComentario(mensaje) {
        const postActualizado = await comentar(post, mensaje, usuario);
        setPost(postActualizado)
    }

    async function onSubmitLike() {
        if (enviandoLike) {
            return;
        }

        try {
            setEnviandoLike(true);
            const postActualizado = await toggleLike(post);
            setPost(postActualizado);
            setEnviandoLike(false);
        } catch (error) {
            setEnviandoLike(false);
            mostrarError('Hubo un problema modificando el like. Intenta de nuevo.');
            console.log(error);
        }
    }

    if (loading) {
        return (
            <Main>
                <Loading />
            </Main>
        )
    }
    if (postNoExiste) {
        return (
            <Main>
                <RecursoNoExiste mensaje="El post que estas intentando ver NO existe" />
            </Main>
        )
    }
    if (post == null) {
        return null;
    }
    return (
        <Main>
            <PostMarkup {...post} onSubmitComentario={onSubmitComentario} onSubmitLike={onSubmitLike} />
        </Main>
    )
}
function PostMarkup({
    numLikes,
    numComentarios,
    comentarios,
    _id,
    caption,
    url,
    usuario: usuarioDelPost,
    estaLike,
    onSubmitLike,
    onSubmitComentario
}) {
    return (
        <div className="Post">
            <div className="Post__image-container">
                <img src={url} alt={caption} />
            </div>
            <div className="Post__side-bar">
                <Avatar usuario={usuarioDelPost} />
                <div className="Post__comentarios-y-like">
                    <Comentarios usuario={usuarioDelPost} caption={caption} comentarios={comentarios} />
                </div>
                <div className="Post__like">
                    <BotonLike onSubmitLike={onSubmitLike} like={estaLike}></BotonLike>
                </div>
                <Comentar onSubmitComentario={onSubmitComentario} />
            </div>
        </div>
    )
}
function Comentarios({ usuario, caption, comentarios }) {
    return (
        <ul className="Post__comentarios">
            <li className="Post__comentario">
                <Link to={`/perfil/${usuario.username}`} className="Post__autor-comentario">
                    <b>
                        {usuario.username}
                    </b>
                </Link>{' '}
                {caption}
            </li>
            {
                comentarios.map(comentario => (
                    <li key={comentario._id} className="Post__comentario">
                        <Link to={`/perfil/${comentario.usuario.username}`} className="Post__autor-comentario">
                            {comentario.usuario.username}
                        </Link>{' '}
                        {comentario.mensaje}
                    </li>
                ))
            }
        </ul>
    )
}