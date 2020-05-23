import { faCompass, faUser } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import React from 'react'
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';

export default function Nav({ usuario }) {
    return (
        <nav className="Nav">
            <ul className="Nav__links">
                <li>
                    <Link to="/" className="Nav__link">
                        insta::DEVF
                    </Link>
                </li>
                {usuario && <LoginRoutes usuario={usuario} />}
            </ul>
        </nav>
    )
}
function LoginRoutes({ usuario }) {
    return (
        <>
            <li className="Nav__link-push">
                <Link to="/upload" className="Nav__link">
                    <FontAwesomeIcon icon={faCameraRetro}></FontAwesomeIcon>
                </Link>
            </li>
            <li className="Nav__link-margin-left">
                <Link to="/explore" className="Nav__link">
                    <FontAwesomeIcon icon={faCompass}></FontAwesomeIcon>
                </Link>
            </li>
            <li className="Nav__link-margin-left">
                <Link to={`/perfil/${usuario.username}`} className="Nav__link">
                    <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                </Link>
            </li>
        </>
    )
}