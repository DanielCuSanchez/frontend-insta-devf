import React, { useState } from 'react';
import Main from '../Componentes/Main'
import Loading from '../Componentes/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import Axios from 'axios';
export default function Upload({ history, mostrarError }) {
    const [imageURL, setimageURL] = useState('')
    const [cargandoImagen, setCargandoImagen] = useState(false)
    const [enviandoPost, setEnviandoPost] = useState(false);
    const [caption, setCaption] = useState('')

    async function handleImageSelector(evento) {
        try {
            setCargandoImagen(true)
            const file = evento.target.files[0]
            const config = {
                headers: {
                    'Content-Type': file.type
                }
            }
            const { data } = await Axios.post('/api/posts/upload', file, config)
            console.log(data);
            setimageURL(data.url)
            setCargandoImagen(false)
        } catch (error) {
            setCargandoImagen(false)
            mostrarError(error.response.data)
            console.log(error)
        }
    }
    async function handleSubmit(evento) {
        evento.preventDefault()
        if (enviandoPost) {
            return
        }
        if (cargandoImagen) {
            mostrarError('No se ha terminado de cargar la imagen ')
            return
        }
        if (!imageURL) {
            mostrarError('Primero selecciona una imagen')
            return
        }
        try {
            setEnviandoPost(true)
            const body = {
                caption,
                url: imageURL
            }
            const { data } = await Axios.post('/api/posts', body)
            console.log(data)
            setEnviandoPost(false)
            history.push('/')

        } catch (error) {
            mostrarError(error.response.data)
            console.log(error);
        }
    }
    return (
        <Main center>
            <div className="Upload">
                <form onSubmit={handleSubmit} >
                    <div className="Upload__image-section">
                        <SeccionSubirImagen handleImageSelector={handleImageSelector} cargandoImagen={cargandoImagen} imageURL={imageURL} />
                    </div>
                    <textarea name="caption"
                        className="Upload__caption"
                        required
                        maxLength="180"
                        placeholder="Caption de tu post"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    >
                    </textarea>
                    <button type="submit" className="Upload__submit">Subir</button>
                </form>
            </div>
        </Main>
    )
}
function SeccionSubirImagen({ cargandoImagen, imageURL, handleImageSelector }) {
    if (cargandoImagen) {
        return <Loading />
    }
    else if (imageURL) {
        return (
            <img src={imageURL} alt="" />
        )
    }
    else {
        return (
            <label className="Upload__image-label">
                <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                <span>Publica una imagen</span>
                <input type="file" className="hidden" name="imagen" onChange={handleImageSelector} />
            </label>
        )
    }
}