import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import userApi from '../api/services/userApi';

const MySwal = withReactContent(Swal);

// Componentes reutilizables
const Field = ({ label, name, value, onChange }) => (
    <div className="flex flex-col">
        <label className="mb-1 text-gray-700 capitalize text-sm sm:text-base">{label}</label>
        <input
            name={name}
            value={value}
            onChange={onChange}
            className="border rounded-lg p-2 focus:outline-none focus:ring text-sm sm:text-base"
        />
    </div>
);

const Textarea = ({ label, name, value, onChange }) => (
    <div className="flex flex-col">
        <label className="mb-1 text-gray-700 capitalize text-sm sm:text-base">{label}</label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={3}
            className="border rounded-lg p-2 focus:outline-none focus:ring text-sm sm:text-base"
        />
    </div>
);

const Select = ({ label, name, value, options, onChange }) => (
    <div className="flex flex-col">
        <label className="mb-1 text-gray-700 capitalize text-sm sm:text-base">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="border rounded-lg p-2 focus:outline-none focus:ring text-sm sm:text-base"
        >
            <option value="">— Selecciona —</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

// Formulario inicial para tareas
const initialForm = {
    codigo_tarea: '',
    tarea: '',
    plan_accion_especifico: '',
    fundamentos_y_soporte: '',
    id_estandar: '',
    id_categoria_estandar: '',
    id_phva: '',
    id_metas_estandar: '',
    id_recurso_administrativo: '',
    id_responsable_actividad: '',
    id_proceso: '',
    id_requisito_1072: '',
    id_requisito_4501: '',
    '7_estandares': '',
    '21_estandares': '',
    '60_estandares': ''
};

export default function GestionTareas() {
    const [tareas, setTareas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sel, setSel] = useState(null);
    const [catalogos, setCatalogos] = useState({
        estandares: [], categorias: [], phva: [], metas: [], recursos: [],
        responsables: [], procesos: [], requisito1072: [], requisito4501: []
    });
    const [formulario, setFormulario] = useState(initialForm);
    const [showTable, setShowTable] = useState(false);
    const [editar, setEditar] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        userApi.getTareasCompleto()
            .then(({ data }) => setTareas(data))
            .catch(err => console.error('Error cargando tareas:', err));
        userApi.getCatalogos()
            .then(({ data }) => setCatalogos(data))
            .catch(err => console.error('Error cargando catálogos:', err));
    };

    // Helpers descriptivos
    const getEstandar = id => catalogos.estandares.find(e => e.id_estandar === id)?.estandar || id;
    const getCategoria = id => catalogos.categorias.find(c => c.id_categoria_estandar === id)?.categoria_estandar || id;
    const getPHVA = id => catalogos.phva.find(p => p.id_phva === id)?.ciclo || id;
    const getMetas = id => catalogos.metas.find(m => m.id_metas_estandar === id)?.metas || id;
    const getRecurso = id => catalogos.recursos.find(r => r.id_recurso_administrativo === id)?.tipo_recurso || id;
    const getResponsable = id => catalogos.responsables.find(r => r.id_responsable_actividad === id)?.responsable || id;
    const getProceso = id => {
        const p = catalogos.procesos.find(p => p.id_proceso === id);
        return p ? `${p.codigo_proceso} – ${p.proceso}` : id;
    };
    const getReq1072 = id => catalogos.requisito1072.find(r => r.id_requisito_1072 === id)?.requisito_1072 || id;
    const getReq4501 = id => catalogos.requisito4501.find(r => r.id_requisito_4501 === id)?.requisito_4501 || id;

    // Buscador
    const handleSearch = e => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const tareasFiltradas = tareas.filter(t =>
        t.descripcion_tarea.toLowerCase().includes(searchTerm) ||
        t.codigo_tarea.toLowerCase().includes(searchTerm)
    );

    // Handlers de modal
    const handleAdd = () => {
        setFormulario(initialForm);
        setSel(null);
        setEditar(false);
        setShowTable(true);
    };

    const handleEdit = t => {
        setSel(t);
        setFormulario({
            codigo_tarea: t.codigo_tarea,
            tarea: t.descripcion_tarea,
            plan_accion_especifico: t.plan_accion_especifico,
            fundamentos_y_soporte: t.fundamentos_y_soporte,
            id_estandar: t.id_estandar || '',
            id_categoria_estandar: t.id_categoria_estandar || '',
            id_phva: t.id_phva || '',
            id_metas_estandar: t.id_metas_estandar || '',
            id_recurso_administrativo: t.id_recurso_administrativo || '',
            id_responsable_actividad: t.id_responsable_actividad || '',
            id_proceso: t.id_proceso || '',
            id_requisito_1072: t.id_requisito_1072 || '',
            id_requisito_4501: t.id_requisito_4501 || '',
            '7_estandares': t['7_estandares'] || '',
            '21_estandares': t['21_estandares'] || '',
            '60_estandares': t['60_estandares'] || ''
        });
        setEditar(true);
        setShowTable(true);
    };

    const handleClose = () => setShowTable(false);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormulario(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        const payload = {
            ...formulario,
            id_estandar: +formulario.id_estandar,
            id_categoria_estandar: +formulario.id_categoria_estandar,
            id_phva: +formulario.id_phva,
            id_metas_estandar: +formulario.id_metas_estandar,
            id_recurso_administrativo: +formulario.id_recurso_administrativo,
            id_responsable_actividad: +formulario.id_responsable_actividad,
            id_proceso: +formulario.id_proceso,
            id_requisito_1072: +formulario.id_requisito_1072,
            id_requisito_4501: +formulario.id_requisito_4501
        };

        if (editar) {
            MySwal.fire({
                title: '¿Actualizar tarea?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, actualizar',
                cancelButtonText: 'Cancelar'
            }).then(result => {
                if (result.isConfirmed) {
                    userApi.updateTarea(sel.id_tarea, payload)
                        .then(() => {
                            setTareas(prev =>
                                prev.map(x =>
                                    x.id_tarea === sel.id_tarea
                                        ? { ...x, ...payload, descripcion_tarea: payload.tarea }
                                        : x
                                )
                            );
                            MySwal.fire('👍', 'Tarea actualizada', 'success');
                            handleClose();
                        })
                        .catch(() => MySwal.fire('Error', 'No se pudo actualizar', 'error'));
                }
            });
        } else {
            userApi.createTarea(payload)
                .then(({ data }) => {
                    setTareas(prev => [
                        ...prev,
                        { id_tarea: data.id_tarea, descripcion_tarea: payload.tarea, ...payload }
                    ]);
                    MySwal.fire('👍', 'Tarea creada', 'success');
                    handleClose();
                })
                .catch(() => MySwal.fire('Error', 'No se pudo crear', 'error'));
        }
    };

    const handleDelete = t => {
        MySwal.fire({
            title: '¿Eliminar tarea?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                userApi.deleteTarea(t.id_tarea)
                    .then(() => {
                        setTareas(prev => prev.filter(item => item.id_tarea !== t.id_tarea));
                        MySwal.fire('Eliminada', 'Tarea eliminada', 'success');
                    })
                    .catch(() => MySwal.fire('Error', 'No se pudo eliminar', 'error'));
            }
        });
    };

    const booleanOptions = [
        { value: 'aplica', label: 'Aplica' },
        { value: 'no aplica', label: 'No Aplica' }
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header con buscador y botón Nuevo */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h2 className="text-3xl font-extrabold text-gray-800">Gestión de Tareas</h2>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Buscar tarea..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-10 pr-3 py-2 border rounded-lg w-full focus:outline-none focus:ring focus:border-blue-300 text-sm sm:text-base"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-600 transition flex items-center gap-1 text-sm"
                    >
                        <Plus size={16} /> Nuevo
                    </button>
                </div>
            </div>

            {/* Tabla de tareas */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            {[
                                'Código', 'Tarea', 'Plan Acción', 'Fundamentos',
                                'Estándar', 'Categoría', 'PHVA', 'Metas',
                                'Recurso', 'Responsable', 'Proceso',
                                'Req 1072', 'Req 4501', '7 Estándares',
                                '21 Estándares', '60 Estándares', 'Acciones'
                            ].map(header => (
                                <th
                                    key={header}
                                    className="px-4 py-2 text-left uppercase font-medium text-gray-600"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tareasFiltradas.map((t, i) => (
                            <tr key={t.id_tarea} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-2">{t.codigo_tarea}</td>
                                <td className="px-4 py-2">{t.descripcion_tarea}</td>
                                <td className="px-4 py-2">{t.plan_accion_especifico}</td>
                                <td className="px-4 py-2">{t.fundamentos_y_soporte}</td>
                                <td className="px-4 py-2">{getEstandar(t.id_estandar)}</td>
                                <td className="px-4 py-2">{getCategoria(t.id_categoria_estandar)}</td>
                                <td className="px-4 py-2">{getPHVA(t.id_phva)}</td>
                                <td className="px-4 py-2">{getMetas(t.id_metas_estandar)}</td>
                                <td className="px-4 py-2">{getRecurso(t.id_recurso_administrativo)}</td>
                                <td className="px-4 py-2">{getResponsable(t.id_responsable_actividad)}</td>
                                <td className="px-4 py-2">{getProceso(t.id_proceso)}</td>
                                <td className="px-4 py-2">{getReq1072(t.id_requisito_1072)}</td>
                                <td className="px-4 py-2">{getReq4501(t.id_requisito_4501)}</td>
                                <td className="px-4 py-2">{t['7_estandares']}</td>
                                <td className="px-4 py-2">{t['21_estandares']}</td>
                                <td className="px-4 py-2">{t['60_estandares']}</td>
                                <td className="px-4 py-2">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(t)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow-md"
                                        >
                                            <Pencil size={16} /> Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(t)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 shadow-md"
                                        >
                                            <Trash2 size={16} /> Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Formulario */}
            {showTable && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
                        <h3 className="text-xl font-semibold mb-4">
                            {editar ? 'Editar Tarea' : 'Crear Tarea'}
                        </h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Código" name="codigo_tarea" value={formulario.codigo_tarea} onChange={handleInputChange} />
                            <Field label="Tarea" name="tarea" value={formulario.tarea} onChange={handleInputChange} />
                            <Textarea label="Plan de Acción" name="plan_accion_especifico" value={formulario.plan_accion_especifico} onChange={handleInputChange} />
                            <Textarea label="Fundamentos" name="fundamentos_y_soporte" value={formulario.fundamentos_y_soporte} onChange={handleInputChange} />
                            <Select
                                label="Estándar"
                                name="id_estandar"
                                value={formulario.id_estandar}
                                options={catalogos.estandares.map(e => ({ value: e.id_estandar, label: e.estandar }))}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Categoría"
                                name="id_categoria_estandar"
                                value={formulario.id_categoria_estandar}
                                options={catalogos.categorias.map(c => ({ value: c.id_categoria_estandar, label: c.categoria_estandar }))}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Ciclo PHVA"
                                name="id_phva"
                                value={formulario.id_phva}
                                options={catalogos.phva.map(p => ({ value: p.id_phva, label: p.ciclo }))}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Metas"
                                name="id_metas_estandar"
                                value={formulario.id_metas_estandar}
                                options={catalogos.metas.map(m => ({ value: m.id_metas_estandar, label: m.metas }))}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Recurso"
                                name="id_recurso_administrativo"
                                value={formulario.id_recurso_administrativo}
                                options={catalogos.recursos.map(r => ({ value: r.id_recurso_administrativo, label: r.tipo_recurso }))}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Responsable"
                                name="id_responsable_actividad"
                                value={formulario.id_responsable_actividad}
                                options={catalogos.responsables.map(r => ({ value: r.id_responsable_actividad, label: r.responsable }))}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Proceso"
                                name="id_proceso"
                                value={formulario.id_proceso}
                                options={catalogos.procesos.map(p => ({ value: p.id_proceso, label: `${p.codigo_proceso} – ${p.proceso}` }))}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Req 1072"
                                name="id_requisito_1072"
                                value={formulario.id_requisito_1072}
                                options={catalogos.requisito1072.map(r => ({ value: r.id_requisito_1072, label: r.requisito_1072 }))}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="Req 4501"
                                name="id_requisito_4501"
                                value={formulario.id_requisito_4501}
                                options={catalogos.requisito4501.map(r => ({ value: r.id_requisito_4501, label: r.requisito_4501 }))}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="7 Estándares"
                                name="7_estandares"
                                value={formulario['7_estandares']}
                                options={booleanOptions}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="21 Estándares"
                                name="21_estandares"
                                value={formulario['21_estandares']}
                                options={booleanOptions}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="60 Estándares"
                                name="60_estandares"
                                value={formulario['60_estandares']}
                                options={booleanOptions}
                                onChange={handleInputChange}
                            />

                            <div className="col-span-full flex justify-end space-x-3 mt-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                >
                                    {editar ? 'Actualizar' : 'Guardar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}