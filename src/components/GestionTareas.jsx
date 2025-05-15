import React, { useEffect, useState } from 'react';
import {
    Table,
    Drawer,
    Steps,
    Form,
    Input,
    Select,
    Button,
    Row,
    Col,
    Space,
    ConfigProvider,
    theme,
    Modal,
    message
} from 'antd';

import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import userApi from '../api/services/userApi';

const { Option } = Select;

// Helper para títulos
const prettify = key =>
    key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

export default function GestionTareas() {
    const [tareas, setTareas] = useState([]);
    const [catalogos, setCatalogos] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();

    const booleanOptions = [
        { value: 'aplica', label: 'Aplica' },
        { value: 'no aplica', label: 'No Aplica' },
    ];

    // CSS overrides: th nowrap, td wrap
    const styleOverrides = `
.ant-table-thead > tr > th.ant-table-cell {
  white-space: nowrap !important;
}
.ant-table-tbody > tr > td.ant-table-cell {
  white-space: normal !important;
  word-break: break-word !important;
}
`;

    // Carga inicial
    useEffect(() => {
        setLoading(true);
        Promise.all([userApi.getTareasCompleto(), userApi.getCatalogos()])
            .then(([tRes, cRes]) => {
                setTareas(tRes.data);
                setCatalogos(cRes.data);
                setFiltered(tRes.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Filtrado
    useEffect(() => {
        const term = searchText.toLowerCase();
        setFiltered(
            tareas.filter(
                t =>
                    t.descripcion_tarea.toLowerCase().includes(term) ||
                    t.codigo_tarea.toLowerCase().includes(term)
            )
        );
    }, [searchText, tareas]);

    // Abrir drawer en modo nuevo
    const openNew = () => {
        form.resetFields();
        setIsEditing(false);
        setCurrent(null);
        setDrawerVisible(true);
    };

    // Abrir drawer en modo edición
    const openEdit = record => {
        form.setFieldsValue({
            ...record,
            tarea: record.descripcion_tarea,
        });
        setIsEditing(true);
        setCurrent(record);
        setDrawerVisible(true);
    };

    // Borrar tarea con Modal.confirm

    const handleDelete = record => {
        Modal.confirm({
            title: '¿Eliminar tarea?',
            okText: 'Sí',
            cancelText: 'No',
            okButtonProps: {
                type: 'primary',             // botón principal destacado
                style: {                     // fondo oscuro para resaltar
                    backgroundColor: '#374151',
                    borderColor: '#374151',
                    color: '#fff',
                },
            },
            cancelButtonProps: {
                style: {                     // texto claro para el botón cancelar
                    color: '#374151',
                },
            },
            onOk: async () => {
                await userApi.deleteTarea(record.id_tarea);
                message.success('Tarea eliminada');
                // recarga
                const [tRes, cRes] = await Promise.all([
                    userApi.getTareasCompleto(),
                    userApi.getCatalogos(),
                ]);
                setTareas(tRes.data);
                setFiltered(tRes.data);
                setCatalogos(cRes.data);
            },
        });
    };


    // Guardar (crear o actualizar)
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setConfirmLoading(true);
            const payload = {
                ...values,
                descripcion_tarea: values.tarea,
                id_estandar: +values.id_estandar,
                id_categoria_estandar: +values.id_categoria_estandar,
                id_phva: +values.id_phva,
                id_metas_estandar: +values.id_metas_estandar,
                id_recurso_administrativo: +values.id_recurso_administrativo,
                id_responsable_actividad: +values.id_responsable_actividad,
                id_proceso: +values.id_proceso,
                id_requisito_1072: +values.id_requisito_1072,
                id_requisito_4501: +values.id_requisito_4501,
            };
            if (isEditing) {
                await userApi.updateTarea(current.id_tarea, payload);
                message.success('Tarea actualizada');
            } else {
                await userApi.createTarea(payload);
                message.success('Tarea creada');
            }
            setDrawerVisible(false);
            // recarga
            const [tRes, cRes] = await Promise.all([
                userApi.getTareasCompleto(),
                userApi.getCatalogos(),
            ]);
            setTareas(tRes.data);
            setFiltered(tRes.data);
            setCatalogos(cRes.data);
        } catch {
            message.error('Error en la operación');
        } finally {
            setConfirmLoading(false);
        }
    };

    // Columnas
    const columns = [
        { title: 'Código', dataIndex: 'codigo_tarea', key: 'codigo_tarea', width: 150 },
        { title: 'Tarea', dataIndex: 'descripcion_tarea', key: 'tarea', width: 200 },
        {
            title: 'Plan Acción',
            dataIndex: 'plan_accion_especifico',
            key: 'plan',
            width: 200,
            render: text => <div>{text}</div>,
        },
        {
            title: 'Fundamentos',
            dataIndex: 'fundamentos_y_soporte',
            key: 'fund',
            width: 200,
            render: text => <div>{text}</div>,
        },
        {
            title: 'Estándar',
            dataIndex: 'id_estandar',
            key: 'estandar',
            width: 150,
            render: id =>
                catalogos.estandares?.find(e => e.id_estandar === id)?.estandar || id,
        },
        {
            title: 'Categoría',
            dataIndex: 'id_categoria_estandar',
            key: 'categoria',
            width: 150,
            render: id =>
                catalogos.categorias?.find(c => c.id_categoria_estandar === id)
                    ?.categoria_estandar || id,
        },
        {
            title: 'PHVA',
            dataIndex: 'id_phva',
            key: 'phva',
            width: 120,
            render: id =>
                catalogos.phva?.find(p => p.id_phva === id)?.ciclo || id,
        },
        {
            title: 'Metas',
            dataIndex: 'id_metas_estandar',
            key: 'metas',
            width: 180,
            render: id =>
                catalogos.metas?.find(m => m.id_metas_estandar === id)?.metas || id,
        },
        {
            title: 'Recurso',
            dataIndex: 'id_recurso_administrativo',
            key: 'recurso',
            width: 150,
            render: id =>
                catalogos.recursos?.find(r => r.id_recurso_administrativo === id)
                    ?.tipo_recurso || id,
        },
        {
            title: 'Responsable',
            dataIndex: 'id_responsable_actividad',
            key: 'responsable',
            width: 150,
            render: id =>
                catalogos.responsables?.find(r => r.id_responsable_actividad === id)
                    ?.responsable || id,
        },
        {
            title: 'Proceso',
            dataIndex: 'id_proceso',
            key: 'proceso',
            width: 200,
            render: id => {
                const p = catalogos.procesos?.find(p => p.id_proceso === id);
                return p ? `${p.codigo_proceso} – ${p.proceso}` : id;
            },
        },
        {
            title: 'Req 1072',
            dataIndex: 'id_requisito_1072',
            key: 'req1072',
            width: 120,
            render: id =>
                catalogos.requisito1072?.find(r => r.id_requisito_1072 === id)
                    ?.requisito_1072 || id,
        },
        {
            title: 'Req 4501',
            dataIndex: 'id_requisito_4501',
            key: 'req4501',
            width: 120,
            render: id =>
                catalogos.requisito4501?.find(r => r.id_requisito_4501 === id)
                    ?.requisito_4501 || id,
        },
        { title: '7 Estándares', dataIndex: '7_estandares', key: 's7', width: 100 },
        { title: '21 Estándares', dataIndex: '21_estandares', key: 's21', width: 100 },
        { title: '60 Estándares', dataIndex: '60_estandares', key: 's60', width: 120 },
        {
            title: 'Acciones',
            key: 'acciones',
            fixed: 'right',
            width: 100,
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
                    <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record)} />
                </Space>
            ),
        },
    ];

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
                <div className="p-6 space-y-6 min-h-full">
                    {/* Header */}
                    <Row justify="space-between" align="middle" gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <h2 className="text-3xl font-bold text-white">Gestión de Tareas</h2>
                        </Col>
                        <Col xs={24} sm={10}>
                            <Input
                                prefix={<SearchOutlined />}
                                placeholder="Buscar tarea..."
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                allowClear
                            />
                        </Col>
                        <Col xs={24} sm={6} className="text-center sm:text-right">
                            <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>
                                Nuevo
                            </Button>
                        </Col>
                    </Row>

                    {/* Inyecta estos estilos */}
                    <style>{`
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
  `}</style>
                    {/* Tabla */}
                    <Table
                        columns={columns}
                        dataSource={filtered}
                        loading={loading}
                        rowKey="id_tarea"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 'max-content', y: '60vh' }}
                        bordered
                        tableLayout="fixed"
                    />

                    {/* Drawer para crear/editar */}
                    <Drawer
                        title={
                            <Space>
                                {isEditing ? <EditOutlined /> : <PlusOutlined />}
                                {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
                            </Space>
                        }
                        placement="right"
                        width={window.innerWidth < 768 ? '100%' : 700}
                        open={drawerVisible}
                        onClose={() => setDrawerVisible(false)}
                        headerStyle={{
                            background: 'linear-gradient(90deg,#4b5563,#1f2937)',
                            color: '#fff',
                        }}
                        bodyStyle={{
                            background: '#111827',
                            padding: 24,
                            overflowY: 'auto',
                            height: 'calc(100% - 108px)',
                        }}
                        footer={
                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Button onClick={() => setDrawerVisible(false)}>Cancelar</Button>
                                <Button type="primary" loading={confirmLoading} onClick={handleOk}>
                                    {isEditing ? 'Actualizar' : 'Guardar'}
                                </Button>
                            </Space>
                        }
                    >
                        <Steps
                            current={0}
                            size="small"
                            style={{ marginBottom: 24, color: '#fff' }}
                            items={[{ title: 'Básicos' }, { title: 'Catálogos' }, { title: 'Confirmar' }]}
                        />

                        <Form form={form} layout="vertical">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24}>
                                    <Form.Item name="codigo_tarea" label="Código Tarea" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item name="tarea" label="Tarea" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item name="plan_accion_especifico" label="Plan Acción Específico">
                                        <Input.TextArea rows={3} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item name="fundamentos_y_soporte" label="Fundamentos y Soporte">
                                        <Input.TextArea rows={3} />
                                    </Form.Item>
                                </Col>
                                {[
                                    { name: 'id_estandar', label: 'Estándar', data: 'estandares', labelKey: 'estandar' },
                                    {
                                        name: 'id_categoria_estandar',
                                        label: 'Categoría Estándar',
                                        data: 'categorias',
                                        labelKey: 'categoria_estandar',
                                    },
                                    { name: 'id_phva', label: 'PHVA', data: 'phva', labelKey: 'ciclo' },
                                    { name: 'id_metas_estandar', label: 'Metas', data: 'metas', labelKey: 'metas' },
                                    {
                                        name: 'id_recurso_administrativo',
                                        label: 'Recurso',
                                        data: 'recursos',
                                        labelKey: 'tipo_recurso',
                                    },
                                    {
                                        name: 'id_responsable_actividad',
                                        label: 'Responsable',
                                        data: 'responsables',
                                        labelKey: 'responsable',
                                    },
                                    { name: 'id_proceso', label: 'Proceso', data: 'procesos', labelKey: ['codigo_proceso', 'proceso'] },
                                    {
                                        name: 'id_requisito_1072',
                                        label: 'Requisito 1072',
                                        data: 'requisito1072',
                                        labelKey: 'requisito_1072',
                                    },
                                    {
                                        name: 'id_requisito_4501',
                                        label: 'Requisito 4501',
                                        data: 'requisito4501',
                                        labelKey: 'requisito_4501',
                                    },
                                ].map(cfg => (
                                    <Col xs={24} sm={12} key={cfg.name}>
                                        <Form.Item name={cfg.name} label={cfg.label}>
                                            <Select allowClear>
                                                {catalogos[cfg.data]?.map(opt => {
                                                    const label = Array.isArray(cfg.labelKey)
                                                        ? `${opt[cfg.labelKey[0]]} – ${opt[cfg.labelKey[1]]}`
                                                        : opt[cfg.labelKey];
                                                    const value = opt[cfg.name];
                                                    return (
                                                        <Option key={value} value={value}>
                                                            {label}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                ))}
                                {['7_estandares', '21_estandares', '60_estandares'].map(n => (
                                    <Col xs={24} sm={8} key={n}>
                                        <Form.Item name={n} label={prettify(n)}>
                                            <Select options={booleanOptions} allowClear />
                                        </Form.Item>
                                    </Col>
                                ))}
                            </Row>
                        </Form>
                    </Drawer>
                </div>
            </>
        </ConfigProvider>
    );
}

