// src/pages/ProfilePage.jsx

import React, { useContext, useEffect, useState } from 'react';
import MyContext from '../context/Mycontext';

export default function ProfilePage() {
    const { nombreDB, perfilDB } = useContext(MyContext);
    const [nombre, setNombre] = useState(nombreDB);

    // Actualiza el nombre si cambia en el contexto
    useEffect(() => {
        setNombre(nombreDB);
    }, [nombreDB]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 text-gray-100 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6 animate-fadeIn">
                {/* Título */}
                <h1 className="text-3xl font-extrabold text-white text-center">
                    Bienvenido, <span className="text-cyan">{nombre}</span>
                </h1>

                {/* Detalles del perfil */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-gray-200 mb-2">Tu Perfil</h2>
                    <p className="text-gray-300">
                        <span className="font-medium text-gray-100">Rol:</span>{' '}
                        <span className="text-cyan-300">{perfilDB}</span>
                    </p>
                </div>

                {/* Botón de acción (opcional) */}
                <div className="text-center">
                    <button
                        onClick={() => {/* tu lógica aquí */ }}
                        className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-full transition"
                    >
                        Editar Perfil
                    </button>
                </div>
            </div>
        </div>
    );
}
