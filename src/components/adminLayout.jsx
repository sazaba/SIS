import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Drawer, Button, Affix } from 'antd';
import {
    MenuOutlined,
    CloseOutlined,
    UserOutlined,
    BankOutlined,
    CheckCircleOutlined,
    FolderOpenOutlined,
    ProfileOutlined,
    AppstoreOutlined,

} from '@ant-design/icons';

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const items = [
        { to: 'usuarios', label: 'Gestión de Usuarios', icon: <UserOutlined /> },
        { to: 'empresas', label: 'Gestión de Empresas', icon: <BankOutlined /> },
        { to: 'tareas', label: 'Gestión de Tareas', icon: <CheckCircleOutlined /> },
        { to: 'asignacion-empresas', label: 'Asignaciones Empresas', icon: <FolderOpenOutlined /> },
        { to: 'asignacion-tareas', label: 'Asignaciones Tareas', icon: <ProfileOutlined /> },
    ];

    const menuLinks = (
        <nav className="space-y-2 px-4">
            {items.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setDrawerVisible(false)}
                    className={({ isActive }) =>
                        `flex items-center w-full text-left px-3 py-2 rounded transition ${isActive
                            ? 'bg-blue-800 font-medium text-white'
                            : 'hover:bg-gray-700 text-gray-300'
                        }`
                    }
                >
                    <span className="mr-2 text-lg">{item.icon}</span>
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 ">
            {/* Sidebar Desktop */}
            <aside
                className={`hidden md:flex flex-col ${collapsed ? 'w-16' : 'w-64'
                    } bg-gray-800 shadow-lg transition-width duration-200 rounded-md`}
            >
                <div className="flex items-center justify-between p-4">
                    {!collapsed && <h3 className="text-xl font-bold">Menú</h3>}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1 hover:bg-gray-700 rounded"
                    >
                        {collapsed ? <MenuOutlined /> : <CloseOutlined />}
                    </button>
                </div>
                <div className="flex-1 overflow-auto px-2">
                    {collapsed ? (
                        <div className="space-y-4 text-center text-xl">
                            {items.map((i) => (
                                <span key={i.to} title={i.label} className="block">
                                    {i.icon}
                                </span>
                            ))}
                        </div>
                    ) : (
                        menuLinks
                    )}
                </div>
            </aside>

            {/* Mobile Bottom Bubble Toggle (centrado con nuevo ícono) */}
            <Affix
                style={{
                    position: 'fixed',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                }}
            >
                <Button
                    className='md:hidden'
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={<AppstoreOutlined style={{ fontSize: 28 }} />}
                    onClick={() => setDrawerVisible(true)}
                />
            </Affix>


            {/* Mobile Bottom Sheet */}
            <Drawer
                placement="bottom"
                closable={false}
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
                height="60vh"
                bodyStyle={{
                    backgroundColor: '#1f2937',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                    paddingTop: '16px',
                }}
                drawerStyle={{ backgroundColor: '#1f2937' }}
            >
                {menuLinks}
            </Drawer>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
