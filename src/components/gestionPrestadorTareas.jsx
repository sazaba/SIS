// frontend/src/components/GestionPrestadorTareas.jsx
import React, { useEffect, useState } from 'react';
import {
    Table,
    DatePicker,
    InputNumber,
    Checkbox,
    Select,
    Input,
    Button,
    message,
    Spin,
    Typography,
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import userApi from '../api/services/userApi';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;
const { TextArea, Search } = Input;

export default function GestionPrestadorTareas() {
    const { empresaId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [empresaNombre, setEmpresaNombre] = useState(empresaId);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!empresaId) return;
        setLoading(true);

        Promise.all([
            userApi.getGestionTareas(empresaId),
            userApi.getUsuariosOptions(),
            userApi.getEmpresasOptions(), // obtener lista de empresas
        ])
            .then(([gestRes, usrRes, empRes]) => {
                setUsuarios(usrRes.data);
                const empresaLista = empRes.data;
                const empresaObj = empresaLista.find(e => String(e.value) === String(empresaId));
                setEmpresaNombre(empresaObj?.label || empresaId);

                const mapped = gestRes.data.map(r => ({
                    key: `${r.id_empresa}-${r.id_tarea}`,
                    empresa_id: r.id_empresa,
                    tarea_id: r.id_tarea,
                    descripcion_tarea: r.descripcion_tarea,
                    fecha_inicio: r.fecha_inicio ? moment(r.fecha_inicio) : null,
                    fecha_fin: r.fecha_fin ? moment(r.fecha_fin) : null,
                    fecha_ejecucion: r.fecha_ejecucion ? moment(r.fecha_ejecucion) : null,
                    usuario_responsable: r.usuario_responsable,
                    observacion: r.observacion,
                    avance: r.avance ?? 0,
                    completado: Boolean(r.completado),
                    exists:
                        r.fecha_inicio !== null ||
                        r.fecha_fin !== null ||
                        r.fecha_ejecucion !== null ||
                        r.usuario_responsable !== null ||
                        r.observacion !== null ||
                        r.avance !== null ||
                        r.completado !== null,
                }));

                setRows(mapped);
            })
            .catch(err => {
                console.error(err);
                message.error('Error cargando datos de gestión');
            })
            .finally(() => setLoading(false));
    }, [empresaId]);

    const handleFieldChange = (key, field, value) =>
        setRows(rows.map(r => r.key === key ? { ...r, [field]: value } : r));

    const handleSave = async record => {
        const payload = {
            empresa_id: record.empresa_id,
            tarea_id: record.tarea_id,
            fecha_inicio: record.fecha_inicio?.format('YYYY-MM-DD HH:mm:ss'),
            fecha_fin: record.fecha_fin?.format('YYYY-MM-DD HH:mm:ss'),
            fecha_ejecucion: record.fecha_ejecucion?.format('YYYY-MM-DD HH:mm:ss'),
            usuario_responsable: record.usuario_responsable,
            observacion: record.observacion,
            avance: record.avance,
            completado: record.completado ? 1 : 0,
        };

        try {
            if (record.exists) {
                await userApi.updateGestionTarea(payload);
                message.success('Gestión actualizada');
            } else {
                await userApi.createGestionTarea(payload);
                message.success('Gestión creada');
                setRows(rows.map(r =>
                    r.key === record.key ? { ...r, exists: true } : r
                ));
            }
        } catch (err) {
            console.error(err);
            message.error('Error guardando gestión');
        }
    };

    const handleDelete = async record => {
        try {
            await userApi.deleteGestionTarea(record.empresa_id, record.tarea_id);
            message.success('Gestión eliminada en backend');
            setRows(rows.map(r => {
                if (r.key !== record.key) return r;
                return {
                    ...r,
                    fecha_inicio: null,
                    fecha_fin: null,
                    fecha_ejecucion: null,
                    usuario_responsable: null,
                    observacion: '',
                    avance: 0,
                    completado: false,
                    exists: false,
                };
            }));
        } catch (err) {
            console.error(err);
            message.error('Error eliminando gestión');
        }
    };

    const columns = [
        { title: 'Tarea', dataIndex: 'descripcion_tarea', key: 'descripcion_tarea' },
        {
            title: 'Inicio', dataIndex: 'fecha_inicio', key: 'fecha_inicio', render: (_, r) => (
                <DatePicker
                    className="no-hover-picker"
                    showTime
                    value={r.fecha_inicio}
                    onChange={d => handleFieldChange(r.key, 'fecha_inicio', d)}
                />
            ),
        },
        {
            title: 'Fin', dataIndex: 'fecha_fin', key: 'fecha_fin', render: (_, r) => (
                <DatePicker
                    className="no-hover-picker"
                    showTime
                    value={r.fecha_fin}
                    onChange={d => handleFieldChange(r.key, 'fecha_fin', d)}
                />
            ),
        },
        {
            title: 'Ejecutado', dataIndex: 'fecha_ejecucion', key: 'fecha_ejecucion', render: (_, r) => (
                <DatePicker
                    className="no-hover-picker"
                    showTime
                    value={r.fecha_ejecucion}
                    onChange={d => handleFieldChange(r.key, 'fecha_ejecucion', d)}
                />
            ),
        },
        {
            title: 'Responsable', dataIndex: 'usuario_responsable', key: 'usuario_responsable', render: (_, r) => (
                <Select
                    style={{ width: 120 }}
                    value={r.usuario_responsable}
                    onChange={v => handleFieldChange(r.key, 'usuario_responsable', v)}
                >
                    {usuarios.map(u => (
                        <Option key={u.value} value={u.value}>{u.label}</Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Avance', dataIndex: 'avance', key: 'avance', render: (_, r) => (
                <InputNumber
                    min={0}
                    max={100}
                    value={r.avance}
                    onChange={v => handleFieldChange(r.key, 'avance', v)}
                />
            ),
        },
        {
            title: 'Completado', dataIndex: 'completado', key: 'completado', render: (_, r) => (
                <Checkbox
                    checked={r.completado}
                    onChange={e => handleFieldChange(r.key, 'completado', e.target.checked)}
                />
            ),
        },
        {
            title: 'Observación', dataIndex: 'observacion', key: 'observacion', render: (_, r) => (
                <TextArea
                    rows={1}
                    value={r.observacion}
                    onChange={e => handleFieldChange(r.key, 'observacion', e.target.value)}
                />
            ),
        },
        {
            title: 'Acciones', key: 'acciones', render: (_, r) => (
                <>
                    <Button type="link" onClick={() => handleSave(r)}>Guardar</Button>
                    <Button type="link" danger onClick={() => handleDelete(r)}>Limpiar</Button>
                </>
            ),
        },
    ];

    const filteredRows = rows.filter(r =>
        r.descripcion_tarea.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: 24 }}>
            <Button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>Atrás</Button>
            <Title level={3}>Gestión de Tareas – {empresaNombre}</Title>
            <Search
                placeholder="Buscar tareas"
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: 300, margin: '16px 0' }}
            />
            {loading ? (
                <Spin />
            ) : (
                <Table
                    dataSource={filteredRows}
                    columns={columns}
                    pagination={false}
                    rowKey="key"
                />
            )}
        </div>
    );
}



