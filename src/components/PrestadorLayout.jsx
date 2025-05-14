import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Drawer, Button } from 'antd';
import { MenuOutlined, CloseOutlined, ShopOutlined } from '@ant-design/icons';

export default function PrestadorLayout() {
    const { pathname } = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const showDrawer = () => setDrawerVisible(true);
    const closeDrawer = () => setDrawerVisible(false);

    const items = [
        {
            to: 'empresas-asignadas-prestador',
            label: 'Mis Empresas',
            icon: <ShopOutlined />,
        },
    ];

    const menuLinks = (
        <nav className="space-y-2 px-4">
            {items.map(item => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeDrawer}
                    className={({ isActive }) =>
                        `flex items-center w-full px-3 py-2 rounded transition ${isActive
                            ? 'bg-green-800 font-medium text-white'
                            : 'text-gray-300 hover:bg-gray-700'
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
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/* Sidebar Desktop */}
            <aside
                className={`hidden md:flex flex-col ${collapsed ? 'w-16' : 'w-64'
                    } bg-gray-800 shadow-lg transition-width duration-200`}
            >
                <div className="flex items-center justify-between p-4">
                    {!collapsed && <h3 className="text-2xl font-bold">Menu</h3>}
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
                            {items.map(i => (
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

            {/* Mobile Bottom Bubble Hamburger */}
            <div className="md:hidden fixed bottom-4 right-4 z-20">
                <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={<MenuOutlined style={{ fontSize: '24px' }} />}
                    onClick={showDrawer}
                />
            </div>

            {/* Mobile Bottom Sheet */}
            <Drawer
                placement="bottom"
                closable={false}
                onClose={closeDrawer}
                visible={drawerVisible}
                height="50vh"
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

            {/* Main content */}
            <main className="flex-1 p-6 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
