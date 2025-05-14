// src/pages/PrestadorDashboard/PrestadorLayout.jsx
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';


export default function PrestadorLayout() {
    const { pathname } = useLocation();



    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-6">Menu</h3>
                <nav className="space-y-2">
                    <NavLink
                        to="empresas-asignadas-prestador"
                        className={({ isActive }) =>
                            `flex items-center px-3 py-2 rounded transition ${isActive
                                ? 'bg-green-100 font-medium text-green-800'
                                : 'text-gray-700 hover:bg-gray-200'
                            }`
                        }
                    >
                        Mis Empresas
                    </NavLink>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 bg-gray-50 overflow-auto relative">


                {/* Rutas hijas */}
                <Outlet />
            </main>
        </div>
    );
}
