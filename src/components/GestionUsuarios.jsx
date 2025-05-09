import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Search } from 'lucide-react'
const MySwal = withReactContent(Swal)
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';
import { Pencil, Trash2 } from 'lucide-react';


function GestionUsuarios() {
    const { actualizarUserInfo } = useContext(MyContext)

    // Campos a mostrar
    const fields = [
        'cedula', 'nombre', 'apellido', 'telefono', 'email', 'direccion',
        'licencia', 'profesion', 'perfil', 'formacion', 'especialidad',
        'titulo', 'competencia_tecnica', 'curso_sst', 'activo_inactivo', 'contraseña'
    ];
    const empty = Object.fromEntries(fields.map(f => [f, '']));

    const [form, setForm] = useState(empty);
    const [contraseña, setContraseña] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [editar, setEditar] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    // Fetch
    useEffect(() => { fetchUsers() }, []);
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFiltered(usuarios.filter(u =>
            fields.some(f => String(u[f]).toLowerCase().includes(term))
        ));
    }, [searchTerm, usuarios]);

    const fetchUsers = () => userApi.getUsers()
        .then(r => { setUsuarios(r.data); actualizarUserInfo(r.data) })
        .catch(console.error);

    const handleAdd = () => { setForm(empty); setContraseña(''); setEditar(false); setShowTable(true); };
    const handleClose = () => setShowTable(false);

    const handleSubmit = () => {
        setSubmitAttempted(true);
        const miss = fields.filter(f => !form[f]);
        if (!editar && !contraseña) miss.push('contraseña');
        if (miss.length) return MySwal.fire('Error', 'Completa: ' + miss.join(', '), 'error');

        const payload = { ...form };
        if (!editar || contraseña) payload.contraseña = contraseña;
        const action = editar ? userApi.updateUser(form.cedula, payload) : userApi.createUser(payload);
        action.then(() => {
            MySwal.fire('👍', editar ? 'Actualizado' : 'Creado', 'success');
            fetchUsers(); setForm(empty); setContraseña(''); setShowTable(false);
        }).catch(() => MySwal.fire('Error', 'Intenta de nuevo', 'error'));
    };

    const handleEdit = u => { setForm(u); setContraseña(''); setEditar(true); setShowTable(true); };
    const handleDelete = c => userApi.deleteUser(c)
        .then(() => { MySwal.fire('Eliminado', '👍', 'success'); fetchUsers() })
        .catch(() => MySwal.fire('Error', 'No borró', 'error'));

    return (
        <div className="p-6 space-y-6">
            {/* Header y búsqueda */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h2 className="text-3xl font-extrabold text-gray-800">Gestión de Usuarios</h2>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-3 py-2 border rounded-lg w-full focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <button onClick={handleAdd} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-600 transition">
                        + Nuevo
                    </button>
                </div>
            </div>

            {/* Modal de formulario */}
            {showTable && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-auto transform transition-transform duration-300 scale-100">
                        <h3 className="text-xl font-semibold mb-4">{editar ? 'Editar Usuario' : 'Crear Usuario'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields.map(f => (
                                <div key={f} className="flex flex-col">
                                    <label className="mb-1 text-gray-700 capitalize">{f.replace('_', ' ')}</label>
                                    <input
                                        className="border rounded-lg p-2 focus:outline-none focus:ring"
                                        value={form[f]}
                                        onChange={e => setForm(s => ({ ...s, [f]: e.target.value }))}
                                    />
                                </div>
                            ))}
                            {!editar && (
                                <div className="flex flex-col">
                                    <label className="mb-1 text-gray-700">Contraseña</label>
                                    <input
                                        type="password"
                                        className="border rounded-lg p-2 focus:outline-none focus:ring"
                                        value={contraseña}
                                        onChange={e => setContraseña(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end mt-6 space-x-3">
                            <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                                {editar ? 'Actualizar' : 'Guardar'}
                            </button>
                            <button onClick={handleClose} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {fields.map(f => (
                                <th key={f} className="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">
                                    {f.replace('_', ' ')}
                                </th>
                            ))}
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((u, i) => (
                            <tr key={u.cedula} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {fields.map(f => (
                                    <td key={f} className="px-4 py-2 text-sm text-gray-700">
                                        {u[f]}
                                    </td>
                                ))}
                                <td className="px-4 py-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleEdit(u)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow-md"
                                        >
                                            <Pencil size={16} />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.cedula)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 shadow-md"
                                        >
                                            <Trash2 size={16} />
                                            Eliminar
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default GestionUsuarios;

