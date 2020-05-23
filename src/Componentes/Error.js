import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
export default function Error({ mensaje, ocultarError }) {
    if (!mensaje) {
        return null
    }
    return (
        <div className="ErrorContainer" role="alert">
            <div className="Error__inner">
                <span className="block">{mensaje}</span>
                <button className="Error__button" onClick={ocultarError}>
                    <FontAwesomeIcon className="Error__icon" icon={faTimesCircle} />
                </button>
            </div>
        </div>
    )
}