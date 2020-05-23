import React from 'react';
import { Link } from 'react-router-dom'
import Main from './Main'

export default function RecursoNoExiste({ mensaje }) {
    return (
        <Main center>
            <div>
                <h2 className="RecursoNoExiste__mensaje">{mensaje}</h2>
                <div className="RecursoNoExiste__link-container">
                    Ir al <Link to="/">Home</Link>
                </div>
            </div>
        </Main>
    )
}