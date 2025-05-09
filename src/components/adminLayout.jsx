// src/pages/AdminDashboard/AdminLayout.jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-white shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Menú</h3>
                <nav className="space-y-2">
                    <NavLink
                        to="usuarios"
                        className={({ isActive }) =>
                            `block w-full text-left px-3 py-2 rounded transition ${isActive ? 'bg-blue-100 font-medium text-blue-800' : 'hover:bg-gray-200'
                            }`
                        }
                    >
                        Gestión de Usuarios
                    </NavLink>
                    <NavLink
                        to="empresas"
                        className={({ isActive }) =>
                            `block w-full text-left px-3 py-2 rounded transition ${isActive ? 'bg-blue-100 font-medium text-blue-800' : 'hover:bg-gray-200'
                            }`
                        }
                    >
                        Gestión de Empresas
                    </NavLink>
                    <NavLink
                        to="tareas"
                        className={({ isActive }) =>
                            `block w-full text-left px-3 py-2 rounded transition ${isActive ? 'bg-blue-100 font-medium text-blue-800' : 'hover:bg-gray-200'
                            }`
                        }
                    >
                        Gestión de Tareas
                    </NavLink>

                    <NavLink
                        to="asignacion-empresas"
                        className={({ isActive }) =>
                            `block w-full text-left px-3 py-2 rounded transition ${isActive ? 'bg-blue-100 font-medium text-blue-800' : 'hover:bg-gray-200'}`
                        }
                    >
                        Asignaciones Empresas
                    </NavLink>

                </nav>
            </aside>
            <main className="flex-1 p-6 bg-gray-50 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
