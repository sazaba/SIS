// src/pages/PrestadorDashboard/PrestadorLayout.jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function PrestadorLayout() {
    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-white shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Área de Prestador</h3>
                <nav className="space-y-2">
                    <NavLink
                        to="mis-tareas"
                        className={({ isActive }) =>
                            `block w-full text-left px-3 py-2 rounded transition ${isActive ? 'bg-green-100 font-medium text-green-800' : 'hover:bg-gray-200'
                            }`
                        }
                    >
                        Mis Tareas
                    </NavLink>

                </nav>
            </aside>
            <main className="flex-1 p-6 bg-gray-50 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
