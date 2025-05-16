// src/components/NavigationBar.jsx

import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Drawer, Button, Spin } from 'antd';
import { MenuOutlined, HomeOutlined } from '@ant-design/icons';
import logo from '../images/logo_SIS.png';
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';

const NavigationBar = () => {
    const {
        nombreDB,
        actualizarNombreDB,
        perfilDB,
        actualizarPerfilDB,
        actualizarToken
    } = useContext(MyContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);

    const showDrawer = () => setDrawerVisible(true);
    const closeDrawer = () => setDrawerVisible(false);

    const handleLogout = async () => {
        setLoadingLogout(true);
        try {
            localStorage.removeItem('token');
            await userApi.logout();
            actualizarNombreDB('');
            actualizarPerfilDB('');
            actualizarToken('');
            navigate('/');
            closeDrawer();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setLoadingLogout(false);
        }
    };

    const menuItems = (
        <ul className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
            {pathname !== '/' && (
                <li>
                    <Link to="/" onClick={closeDrawer} className="flex items-center text-white hover:text-gray-300">
                        <HomeOutlined style={{ fontSize: 20, color: 'cyan' }} />
                    </Link>
                </li>
            )}
            {nombreDB && pathname === '/' && (
                <li className="text-white font-semibold">
                    Bienvenid@ <span className="text-blue-400">{nombreDB}</span>
                </li>
            )}
            {perfilDB === 'administrador' && (
                <li>
                    <Link to="/admin" onClick={closeDrawer} className="text-white font-semibold hover:text-gray-300">
                        Dashboard Admin
                    </Link>
                </li>
            )}
            {!nombreDB && (
                <li>
                    <Link to="/login" onClick={closeDrawer} className="text-white font-semibold hover:text-gray-300">
                        Iniciar Sesión
                    </Link>
                </li>
            )}
            {nombreDB && (
                <>
                    <li>
                        <Link to="/prestador" onClick={closeDrawer} className="text-white font-semibold hover:text-gray-300">
                            Dashboard Prestador
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile-page" onClick={closeDrawer} className="text-white font-semibold hover:text-gray-300">
                            Perfil
                        </Link>
                    </li>
                    <li>
                        {/* Cambié type a 'ghost' para que el spinner resalte sobre el fondo */}
                        <button
                            type="ghost"
                            onClick={handleLogout}
                            loading={loadingLogout}
                            className="text-white font-semibold hover:text-gray-300"
                        >
                            Cerrar Sesión
                        </button>
                    </li>
                </>
            )}
        </ul>
    );

    return (
        <nav className="bg-gray-900 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link
                    to="/"
                    onClick={closeDrawer}
                    className="relative flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-2xl transition-shadow group"
                >
                    {/* Círculo exterior con animación de halo al hover */}
                    <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-30 animate-ping" />

                    {/* Logo centrado */}
                    <img
                        src={logo}
                        alt="logo SIS"
                        className="w-15 h-15 object-contain z-10"
                    />
                </Link>

                {/* Menú de escritorio */}
                <div className="hidden md:flex items-center">{menuItems}</div>

                {/* Hamburguesa móvil */}
                <div className="md:hidden">
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: 24, color: 'white' }} />}
                        onClick={showDrawer}
                    />
                </div>
            </div>

            {/* Drawer móvil */}
            <Drawer
                title={<img src={logo} alt="logo SIS" className="w-20 mb-4" />}
                placement="right"
                closable
                onClose={closeDrawer}
                visible={drawerVisible}
                bodyStyle={{ backgroundColor: '#1f2937', paddingTop: 0 }}
                drawerStyle={{ backgroundColor: '#1f2937' }}
            >
                {/* Spin envolverá todo el menú mientras loadingLogout=true */}
                <Spin spinning={loadingLogout} tip="Cerrando sesión...">
                    {menuItems}
                </Spin>
            </Drawer>
        </nav>
    );
};

export default NavigationBar;
