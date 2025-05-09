import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Pencil, Trash2, Search, Plus } from 'lucide-react'
import userApi from '../api/services/userApi'

const MySwal = withReactContent(Swal)

function GestionEmpresas() {
    const initialForm = {
        nit: '',
        nombre_empresa: '',
        ciudad: '',
        departamento: '',
        direccion_principal: '',
        telefono: '',
        email: '',
        representante_legal: '',
        email_representante_legal: '',
        contacto_sst: '',
        email_contactosst: '',
        fecha_inicio: '',
        visitas_mensual: '',
        visitas_emergencias: '',
        cantidad_trabajadores: '',
        clase_riesgo: '',
        arl: '',
        actividad_economica: '',
        descripcion_actividad: '',
        numero_sedes: ''
    }

    const [form, setForm] = useState(initialForm)
    const [empresas, setEmpresas] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editar, setEditar] = useState(false)
    const [submitAttempted, setSubmitAttempted] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => fetchEmpresas(), [])

    const fetchEmpresas = () => {
        userApi.getEmpresas()
            .then(res => {
                setEmpresas(res.data)
            })
            .catch(console.error)
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase())
    }

    const empresasFiltradas = empresas.filter(empresa =>
        empresa.nit.toLowerCase().includes(searchTerm) ||
        empresa.nombre_empresa.toLowerCase().includes(searchTerm)
    )

    const openNew = () => {
        setForm(initialForm)
        setEditar(false)
        setSubmitAttempted(false)
        setShowModal(true)
    }

    const openEdit = (e) => {
        setForm({ ...e })
        setEditar(true)
        setSubmitAttempted(false)
        setShowModal(true)
    }

    const closeModal = () => setShowModal(false)

    const handleChange = (key, value) => {
        setForm(f => ({ ...f, [key]: value }))
    }

    const handleSubmit = () => {
        setSubmitAttempted(true)
        const missing = []
        if (!form.nit) missing.push('nit')
        if (!form.nombre_empresa) missing.push('nombre_empresa')
        if (missing.length) {
            return MySwal.fire('Error', 'Completa: ' + missing.join(', '), 'error')
        }

        const action = editar
            ? userApi.updateEmpresa(form.nit, form)
            : userApi.createEmpresa(form)

        action
            .then(() => {
                MySwal.fire('👍', editar ? 'Actualizado' : 'Creado', 'success')
                fetchEmpresas()
                closeModal()
            })
            .catch(() => MySwal.fire('Error', 'Intenta de nuevo', 'error'))
    }

    const handleDelete = (nit) => {
        userApi.deleteEmpresa(nit)
            .then(() => {
                MySwal.fire('Eliminado', '👍', 'success')
                fetchEmpresas()
            })
            .catch(() => MySwal.fire('Error', 'No borró', 'error'))
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h2 className="text-3xl font-extrabold text-gray-800">Gestión de Empresas</h2>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Buscar empresas..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-10 pr-3 py-2 border rounded-lg w-full focus:outline-none focus:ring focus:border-blue-300 text-sm sm:text-base"
                        />
                    </div>
                    <button
                        onClick={openNew}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-600 transition flex items-center gap-1 text-sm"
                    >
                        <Plus size={16} /> Nuevo
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            {editar ? 'Editar Empresa' : 'Crear Empresa'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.keys(initialForm).map(key => (
                                <div key={key} className="flex flex-col">
                                    <label className="mb-1 text-gray-700 capitalize">
                                        {key.replace('_', ' ')}
                                    </label>
                                    <input
                                        type={
                                            key === 'fecha_inicio'
                                                ? 'date'
                                                : key === 'numero_sedes'
                                                    ? 'number'
                                                    : 'text'
                                        }
                                        value={form[key]}
                                        onChange={e => handleChange(key, e.target.value)}
                                        className={`border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300 w-full ${submitAttempted && !form[key] ? 'border-red-500' : ''}`}
                                        placeholder={key.replace('_', ' ')}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={handleSubmit}
                                className={`px-4 py-2 rounded-lg text-white shadow ${editar ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                {editar ? 'Actualizar' : 'Registrar'}
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {Object.keys(initialForm).map(col => (
                                <th key={col} className="px-4 py-2 text-left uppercase font-medium text-gray-600 text-sm">
                                    {col.replace('_', ' ')}
                                </th>
                            ))}
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {empresasFiltradas.map((e, i) => (
                            <tr key={e.nit} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {Object.keys(initialForm).map(field => (
                                    <td key={field} className="px-4 py-2 text-sm text-gray-700">
                                        {e[field]}
                                    </td>
                                ))}
                                <td className="px-4 py-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => openEdit(e)} className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md">
                                            <Pencil size={16} /> Editar
                                        </button>
                                        <button onClick={() => handleDelete(e.nit)} className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md">
                                            <Trash2 size={16} /> Eliminar
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

export default GestionEmpresas
