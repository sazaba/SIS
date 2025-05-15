import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Drawer, Button } from 'antd';
import { MenuOutlined, HomeOutlined } from '@ant-design/icons';
import logo from '../images/logo_SIS.png';
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';

const NavigationBar = () => {
    const { nombreDB, actualizarNombreDB, perfilDB, actualizarPerfilDB, token, actualizarToken } = useContext(MyContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [drawerVisible, setDrawerVisible] = useState(false);

    const showDrawer = () => setDrawerVisible(true);
    const closeDrawer = () => setDrawerVisible(false);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            await userApi.logout();
            actualizarNombreDB('');
            actualizarPerfilDB('');
            actualizarToken('');
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Añadimos closeDrawer() en cada Link o botón
    const menuItems = (
        <ul className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
            {pathname !== '/' && (
                <li>
                    <Link
                        to="/"
                        onClick={closeDrawer}
                        className="flex items-center text-white hover:text-gray-300"
                    >
                        <HomeOutlined style={{ fontSize: '20px', color: 'cyan' }} />
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
                    <Link
                        to="/admin"
                        onClick={closeDrawer}
                        className="text-white font-semibold hover:text-gray-300"
                    >
                        Dashboard Admin
                    </Link>
                </li>
            )}
            {!nombreDB && (
                <li>
                    <Link
                        to="/login"
                        onClick={closeDrawer}
                        className="text-white font-semibold hover:text-gray-300"
                    >
                        Iniciar Sesión
                    </Link>
                </li>
            )}
            {nombreDB && (
                <>
                    <li>
                        <Link
                            to="/prestador"
                            onClick={closeDrawer}
                            className="text-white font-semibold hover:text-gray-300"
                        >
                            Dashboard Prestador
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile-page"
                            onClick={closeDrawer}
                            className="text-white font-semibold hover:text-gray-300"
                        >
                            Perfil
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={() => {
                                handleLogout();
                                closeDrawer();
                            }}
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
        <nav className="bg-gray-900 text-white shadow-md" >
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center" onClick={closeDrawer}>
                    <img src={logo} alt="logo SIS" className="w-24" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center">
                    {menuItems}
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden">
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: '24px', color: 'white' }} />}
                        onClick={showDrawer}
                    />
                </div>
            </div>

            {/* Mobile Drawer */}
            <Drawer
                title={<img src={logo} alt="logo SIS" className="w-20 mb-4" />}
                placement="right"
                closable={true}
                onClose={closeDrawer}
                visible={drawerVisible}
                bodyStyle={{ backgroundColor: '#1f2937', paddingTop: 0 }}
                drawerStyle={{ backgroundColor: '#1f2937' }}
            >
                {menuItems}
            </Drawer>
        </nav>
    );
};

export default NavigationBar;
