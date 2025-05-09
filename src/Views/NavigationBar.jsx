import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../images/logo_SIS.png';
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';
import HomeIcon from '@mui/icons-material/Home';



const NavigationBar = () => {
    const { nombreDB, actualizarNombreDB, perfilDB, actualizarPerfilDB, token, actualizarToken } = useContext(MyContext);
    const navigate = useNavigate();
    const { pathname } = useLocation(); // Utiliza useLocation para obtener la ruta actual




    const handleLogout = async () => {
        try {
            // Eliminar el token del localStorage
            localStorage.removeItem('token');

            // Enviar una solicitud al servidor para manejar el logout
            await userApi.logout();

            // Limpiar el nombre, perfil y token utilizando el contexto
            actualizarNombreDB('');
            actualizarPerfilDB('');
            actualizarToken('');

            // Redirigir a la página principal
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Puedes manejar el error de acuerdo a tus necesidades
        }
    };





    return (
        <nav className="bg-white p-2 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo a la izquierda */}
                <Link to="/" className="text-slate-900 text-2xl font-bold">
                    <img className='w-20' src={logo} alt="logo SIS" />
                </Link>

                {/* Menú de navegación */}

                <ul className="flex space-x-4">

                    {pathname !== '/' && (
                        <li>
                            <Link to="/">
                                <HomeIcon className="w-6 h-6" color="primary" />
                            </Link>
                        </li>
                    )}
                    {nombreDB && window.location.pathname === '/' && (
                        <li>
                            <span className='text-slate-900 font-semibold'>
                                Bienvenid@ <span className='text-blue-800'>{nombreDB}</span>
                            </span>

                        </li>
                    )}
                    {perfilDB === 'administrador' && (
                        <li>
                            <Link to="/admin" className="text-slate-900 font-semibold">
                                Dashboard Administrador
                            </Link>
                        </li>
                    )}
                    {!nombreDB && (
                        <li>
                            <Link to="/login" className="text-slate-900 font-semibold">
                                Iniciar Sesión
                            </Link>
                        </li>
                    )}
                    {nombreDB && (
                        <>
                            <li>
                                <Link to="/profile-page" className="text-slate-900 font-semibold">
                                    Perfil
                                </Link>
                            </li>
                            <li>
                                <button className="text-slate-900 font-semibold" onClick={handleLogout}>
                                    Cerrar Sesión
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav >
    );
};

export default NavigationBar;

