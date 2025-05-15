import React, { useEffect, useState, useContext } from 'react';
import {
    Table,
    DatePicker,
    Select,
    Input,
    Button,
    message,
    Spin,
    Typography,
    Modal,
    Tag,
    ConfigProvider,
    theme,
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import userApi from '../api/services/userApi';
import moment from 'moment';
import MyContext from '../context/Mycontext';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

export default function GestionPrestadorTareas() {
    const { perfilDB } = useContext(MyContext);
    const { empresaId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [empresaNombre, setEmpresaNombre] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [historialVisible, setHistorialVisible] = useState(false);
    const [historialData, setHistorialData] = useState([]);
    const [historialLoading, setHistorialLoading] = useState(false);

    const avanceOptions = [
        { value: 0, label: '0 - No cumplido', color: 'volcano' },
        { value: 3, label: '3 - Pendiente', color: 'gold' },
        { value: 5, label: '5 - Completado', color: 'green' },
    ];

    const styleOverrides = `
.ant-table-thead > tr > th.ant-table-cell {
  background: #1f2937 !important;
  color: #fff !important;
  white-space: nowrap !important;
}
.ant-table-tbody > tr > td.ant-table-cell {
  background: #111827;
  color: #fff;
  white-space: normal !important;
  word-break: break-word !important;
}
.ant-pagination-item {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
}
.ant-pagination-item a {
  color: #9ca3af !important;
}
.ant-pagination-item-active {
  background-color: #4b5563 !important;
  border-color: #4b5563 !important;
}
.ant-pagination-item-active a {
  color: #fff !important;
}
.ant-pagination-prev .ant-pagination-item-link,
.ant-pagination-next .ant-pagination-item-link {
  color: #9ca3af !important;
}
.ant-pagination-disabled .ant-pagination-item-link {
  color: #6b7280 !important;
}
`;

    useEffect(() => {
        userApi.getUsuariosOptions()
            .then(res => setUsuarios(res.data))
            .catch(() => message.error('Error cargando usuarios'));
    }, []);

    useEffect(() => {
        if (!empresaId) return;
        setLoading(true);
        Promise.all([
            userApi.getGestionTareas(empresaId),
            userApi.getEmpresasOptions(),
        ])
            .then(([gestRes, empRes]) => {
                const empresaObj = empRes.data.find(e => String(e.value) === String(empresaId));
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
                    exists: Boolean(
                        r.fecha_inicio ||
                        r.fecha_fin ||
                        r.fecha_ejecucion ||
                        r.usuario_responsable ||
                        r.observacion ||
                        r.avance !== null
                    ),
                }));
                setRows(mapped);
            })
            .catch(() => message.error('Error cargando datos de gestión'))
            .finally(() => setLoading(false));
    }, [empresaId]);

    const fetchHistorial = async (empresa_id, tarea_id) => {
        setHistorialLoading(true);
        try {
            const res = await userApi.getHistorialGestion(empresa_id, tarea_id);
            setHistorialData(res.data);
        } catch {
            message.error('Error cargando historial');
        } finally {
            setHistorialLoading(false);
        }
    };

    const showHistorial = record => {
        setHistorialVisible(true);
        fetchHistorial(record.empresa_id, record.tarea_id);
    };

    const handleFieldChange = (key, field, value) => {
        setRows(rows.map(r => r.key === key ? { ...r, [field]: value } : r));
    };

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
        };
        try {
            if (record.exists) {
                await userApi.updateGestionTarea(payload);
                message.success('Gestión actualizada');
            } else {
                await userApi.createGestionTarea(payload);
                message.success('Gestión creada');
                setRows(rows.map(r => r.key === record.key ? { ...r, exists: true } : r));
            }
            if (historialVisible) fetchHistorial(record.empresa_id, record.tarea_id);
        } catch {
            message.error('Error guardando gestión');
        }
    };

    const handleDelete = async record => {
        try {
            await userApi.deleteGestionTarea(record.empresa_id, record.tarea_id);
            message.success('Gestión eliminada');
            setRows(rows.map(r => r.key === record.key
                ? { ...r, fecha_inicio: null, fecha_fin: null, fecha_ejecucion: null, usuario_responsable: null, observacion: '', avance: 0, exists: false }
                : r
            ));
            setHistorialVisible(false);
            setHistorialData([]);
        } catch {
            message.error('Error eliminando gestión');
        }
    };

    const historialColumns = [
        { title: 'Fecha Registro', dataIndex: 'fecha_registro', key: 'fecha_registro', width: 180, render: t => moment(t).format('YYYY-MM-DD HH:mm:ss') },
        { title: 'Inicio', dataIndex: 'fecha_inicio', key: 'fecha_inicio', width: 180, render: t => t ? moment(t).format('YYYY-MM-DD HH:mm:ss') : '-' },
        { title: 'Fin', dataIndex: 'fecha_fin', key: 'fecha_fin', width: 180, render: t => t ? moment(t).format('YYYY-MM-DD HH:mm:ss') : '-' },
        { title: 'Ejecutado', dataIndex: 'fecha_ejecucion', key: 'fecha_ejecucion', width: 180, render: t => t ? moment(t).format('YYYY-MM-DD HH:mm:ss') : '-' },
        { title: 'Responsable', dataIndex: 'nombre_responsable', key: 'nombre_responsable', width: 150 },
        { title: 'Avance', dataIndex: 'avance', key: 'avance', width: 100, render: a => { const opt = avanceOptions.find(o => o.value === a); return opt ? <Tag color={opt.color}>{opt.label.split(' - ')[1]}</Tag> : a; } },
        { title: 'Observación', dataIndex: 'observacion', key: 'observacion', width: 200 },
    ];

    const columns = [
        { title: 'Tarea', dataIndex: 'descripcion_tarea', key: 'descripcion_tarea', width: 250 },
        { title: 'Inicio', dataIndex: 'fecha_inicio', key: 'fecha_inicio', width: 180, render: (_, r) => <DatePicker showTime value={r.fecha_inicio} onChange={d => handleFieldChange(r.key, 'fecha_inicio', d)} /> },
        { title: 'Fin', dataIndex: 'fecha_fin', key: 'fecha_fin', width: 180, render: (_, r) => <DatePicker showTime value={r.fecha_fin} onChange={d => handleFieldChange(r.key, 'fecha_fin', d)} /> },
        { title: 'Ejecutado', dataIndex: 'fecha_ejecucion', key: 'fecha_ejecucion', width: 180, render: (_, r) => <DatePicker showTime value={r.fecha_ejecucion} onChange={d => handleFieldChange(r.key, 'fecha_ejecucion', d)} /> },
        {
            title: 'Responsable', dataIndex: 'usuario_responsable', key: 'usuario_responsable', width: 180, render: (_, r) => (
                <Select style={{ width: 150 }} value={r.usuario_responsable} onChange={v => handleFieldChange(r.key, 'usuario_responsable', v)}>
                    {usuarios.map(u => <Option key={u.value} value={u.value}>{u.label}</Option>)}
                </Select>
            )
        },
        {
            title: 'Avance', dataIndex: 'avance', key: 'avance', width: 180, render: (_, r) => (
                <Select style={{ width: 150 }} value={r.avance} onChange={v => handleFieldChange(r.key, 'avance', v)}>
                    {avanceOptions.map(o => <Option key={o.value} value={o.value}><Tag color={o.color}>{o.label.split(' - ')[1]}</Tag></Option>)}
                </Select>
            )
        },
        { title: 'Observación', dataIndex: 'observacion', key: 'observacion', width: 200, render: (_, r) => <Input.TextArea rows={1} value={r.observacion} onChange={e => handleFieldChange(r.key, 'observacion', e.target.value)} /> },
        {
            title: 'Acciones', key: 'acciones', width: 120, render: (_, r) => (
                <>
                    <Button type="link" onClick={() => handleSave(r)}>Guardar</Button>
                    <Button type="link" onClick={() => showHistorial(r)}>Ver historial</Button>
                </>
            )
        },
    ];

    const filteredRows = rows.filter(r =>
        r.descripcion_tarea.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#1f2937',
                    colorBgContainer: '#1f2937',
                    colorText: '#ffffff',
                    controlItemBgActive: '#374151',
                    controlItemBgHover: '#4b5563',
                },
            }}
        >
            <>
                <style>{styleOverrides}</style>
                <div style={{ padding: 24, minHeight: '100vh', background: '#111827' }}>
                    <Button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>Atrás</Button>
                    <Title level={3} style={{ color: '#fff' }}>Gestión de Tareas {empresaNombre}</Title>
                    <Search
                        placeholder="Buscar tareas"
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: 300, margin: '16px 0', background: '#1f2937', color: '#fff' }}
                    />

                    {loading ? (
                        <Spin />
                    ) : (
                        <Table
                            dataSource={filteredRows}
                            columns={columns}
                            pagination={false}
                            rowKey="key"
                            bordered
                            scroll={{ x: 'max-content', y: '60vh' }}
                        />
                    )}

                    <Modal
                        destroyOnClose
                        open={historialVisible}
                        title={<span style={{ color: '#fff' }}>Historial de Gestión</span>}
                        footer={<Button onClick={() => { setHistorialVisible(false); setHistorialData([]); }}>Cerrar</Button>}
                        onCancel={() => { setHistorialVisible(false); setHistorialData([]); }}
                        width={800}
                        bodyStyle={{ background: '#111827' }}
                        maskStyle={{ background: 'rgba(0,0,0,0.85)' }}
                    >
                        <Spin spinning={historialLoading}>
                            <Table
                                dataSource={historialData}
                                columns={historialColumns}
                                pagination={{ pageSize: 5 }}
                                rowKey="id"
                                bordered
                                scroll={{ x: 'max-content' }}
                            />
                        </Spin>
                    </Modal>
                </div>
            </>
        </ConfigProvider>
    );
}
