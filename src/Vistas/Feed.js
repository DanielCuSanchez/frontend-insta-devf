import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Main from '../Componentes/Main';
import Loading from '../Componentes/Loading';
import Post from '../Componentes/Post';
const NUMERO_DE_POSTS = 3
async function cargarPosts(fechaDelUltimoPost) {
    const query = fechaDelUltimoPost ? `?fecha=${fechaDelUltimoPost}` : '';
    const { data: nuevosPosts } = await Axios.get(`/api/posts/feed/${query}`);
    return nuevosPosts;
}

export default function Feed({ mostrarError, usuario }) {
    const [posts, setPosts] = useState([]);
    const [cargandoPostIniciales, setCargandoPostIniciales] = useState(true);
    const [cargandoMasPosts, setCargandoMasPosts] = useState(false)
    const [todosLosPostCargados, setTodosLosPostCargados]  = useState(false)
    useEffect(() => {
        async function cargarPostsIniciales() {
            try {
                const nuevosPosts = await cargarPosts();
                setPosts(nuevosPosts);
                console.log(nuevosPosts);
                setCargandoPostIniciales(false);
                revisarSiHayMasPosts(nuevosPosts)
            } catch (error) {
                mostrarError('Hubo un problema cargando tu feed.');
                console.log(error);
            }
        }

        cargarPostsIniciales();
    }, []);

    function actualizarPost(postOriginal, postActualizado) {
        setPosts(posts => {
            const postsActualizados = posts.map(post => {
                if (post !== postOriginal) {
                    return post;
                }
                return postActualizado;
            });
            return postsActualizados;
        });
    }

    if (cargandoPostIniciales) {
        return (
            <Main center>
                <Loading />
            </Main>
        );
    }

    if (!cargandoPostIniciales && posts.length === 0) {
        return (
            <Main center>
                <NoSiguesANadie />
            </Main>
        );
    }

    async function cargarMasPosts() {
        if (cargandoMasPosts) {
            return
        }
        try {
            setCargandoMasPosts(true)
            const fechaDelUltimoPost = posts[posts.length - 1].fecha_creado
            const nuevosPosts = await cargarPosts(fechaDelUltimoPost)
            setPosts(viejosPosts => [...viejosPosts, ...nuevosPosts])
            revisarSiHayMasPosts(nuevosPosts)
            setCargandoMasPosts(false)

        } catch (error) {
            mostrarError('Intenta de nuevo')
            setCargandoMasPosts(false)
        }
    }
    function revisarSiHayMasPosts(nuevosPosts){
        if(nuevosPosts < NUMERO_DE_POSTS){
            setTodosLosPostCargados(true)
        }

    }
    return (
        <Main>
            <div className="Feed">
                {posts.map(post => (
                    <Post
                        key={post._id}
                        post={post}
                        actualizarPost={actualizarPost}
                        mostrarError={mostrarError}
                        usuario={usuario}
                    />
                ))}
                <CargarMasPosts onClick={cargarMasPosts} todosLosPostsCargados={todosLosPostCargados}/>
            </div>
        </Main>
    );
}

function NoSiguesANadie() {
    return (
        <div className="NoSiguesANadie">
            <p className="NoSiguesANadie__mensaje">
                Tu feed no tiene fotos porque no sigues a nadie, o porque no han
                publicado fotos.
      </p>
            <div className="text-center">
                <Link to="/explore" className="NoSiguesANadie__boton">
                    Explora Clontagram
        </Link>
            </div>
        </div>
    );
}
function CargarMasPosts({ onClick, todosLosPostsCargados }) {
    if (todosLosPostsCargados) {
        return (
            <div className="Feed__no-hay-mas-posts">
                No hay mas posts
            </div>
        )
    }
    return (
        <button className="Feed__cargar-mas" onClick={onClick}>Ver más</button>
    )
}