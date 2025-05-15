import React, { useContext, useEffect, useState } from 'react';
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
    message,
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';

const { Option } = Select;

// Helper para convertir claves en títulos bonitos
const prettify = (key) =>
    key
        .split('_')
        .map(word =>
            word.toLowerCase() === 'sst'
                ? 'SST'
                : word[0].toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');

export default function GestionEmpresas() {
    const { actualizarUserInfo } = useContext(MyContext);
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();
    const fields = [
        'nit',
        'nombre_empresa',
        'ciudad',
        'departamento',
        'direccion_principal',
        'telefono',
        'email',
        'representante_legal',
        'email_representante_legal',
        'contacto_sst',
        'email_contactosst',
        'fecha_inicio',
        'visitas_mensual',
        'visitas_emergencias',
        'cantidad_trabajadores',
        'clase_riesgo',
        'arl',
        'actividad_economica',
        'descripcion_actividad',
        'numero_sedes',
    ];

    useEffect(() => { fetchEmpresas() }, []);
    useEffect(() => {
        const term = searchText.toLowerCase();
        setFilteredData(
            empresas.filter(e =>
                fields.some(f =>
                    String(e[f]).toLowerCase().includes(term)
                )
            )
        );
    }, [searchText, empresas]);

    const fetchEmpresas = async () => {
        setLoading(true);
        try {
            const { data } = await userApi.getEmpresas();
            setEmpresas(data);
            setFilteredData(data);
            actualizarUserInfo(data);
        } catch (err) {
            message.error('Error cargando empresas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openNewDrawer = () => {
        form.resetFields();
        setIsEditing(false);
        setCurrentRecord(null);
        setIsDrawerVisible(true);
    };
    const openEditDrawer = record => {
        form.setFieldsValue(record);
        setIsEditing(true);
        setCurrentRecord(record);
        setIsDrawerVisible(true);
    };

    const handleDelete = async nit => {
        setDeletingId(nit);
        try {
            await userApi.deleteEmpresa(nit);
            message.success('Empresa eliminada');
        } catch (err) {
            console.error('Delete error:', err);
            message.error('Error al eliminar empresa');
        } finally {
            await fetchEmpresas();
            setDeletingId(null);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setConfirmLoading(true);
            if (isEditing) {
                await userApi.updateEmpresa(currentRecord.nit, values);
                message.success('Empresa actualizada');
            } else {
                await userApi.createEmpresa(values);
                message.success('Empresa creada');
            }
            setIsDrawerVisible(false);
            fetchEmpresas();
        } catch (err) {
            console.error(err);
            message.error('Error en la operación');
        } finally {
            setConfirmLoading(false);
        }
    };

    const columns = [
        ...fields.map(key => ({
            title: prettify(key),
            dataIndex: key,
            key,
            width: 150,
            sorter: (a, b) =>
                String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true }),
        })),
        {
            title: 'Acciones',
            key: 'acciones',
            align: 'center',
            fixed: 'right',
            width: 100,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => openEditDrawer(record)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        size="small"
                        danger
                        loading={deletingId === record.nit}
                        onClick={() => handleDelete(record.nit)}
                    />
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
            <div className="p-6 space-y-6 min-h-full">
                {/* Encabezado */}
                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <h2 className="text-3xl font-bold text-white text-center sm:text-left">
                            Gestión de Empresas
                        </h2>
                    </Col>
                    <Col xs={24} sm={10}>
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Buscar empresas..."
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={6} className="text-center sm:text-right">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openNewDrawer}
                        >
                            Nuevo
                        </Button>
                    </Col>
                </Row>
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
                {/* Tabla con scroll */}
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    rowKey="nit"
                    pagination={{ pageSize: 10 }}
                    bordered
                    scroll={{ x: 'max-content', y: '60vh' }}
                />

                {/* Drawer para crear/editar */}
                <Drawer
                    title={
                        <Space align="center">
                            {isEditing ? <EditOutlined /> : <PlusOutlined />}
                            <span className="text-lg font-semibold">
                                {isEditing ? 'Editar Empresa' : 'Nueva Empresa'}
                            </span>
                        </Space>
                    }
                    placement="right"
                    width={window.innerWidth < 768 ? '100%' : 600}
                    open={isDrawerVisible}
                    onClose={() => setIsDrawerVisible(false)}
                    headerStyle={{
                        background: 'linear-gradient(90deg, #4b5563, #1f2937)',
                        color: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                    bodyStyle={{
                        background: '#111827',
                        padding: 24,
                        overflowY: 'auto',
                        height: 'calc(100% - 108px)',
                    }}
                    footer={
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setIsDrawerVisible(false)}>
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                loading={confirmLoading}
                                onClick={handleOk}
                            >
                                {isEditing ? 'Actualizar' : 'Guardar'}
                            </Button>
                        </Space>
                    }
                >
                    <Steps
                        current={0}
                        size="small"
                        style={{ marginBottom: 24, color: '#fff' }}
                        items={[
                            { title: 'Datos Básicos' },
                            { title: 'Contacto' },
                            { title: 'Configuración' },
                        ]}
                    />

                    <Form form={form} layout="vertical">
                        <Row gutter={[16, 16]}>
                            {[...fields].map(field => (
                                <Col xs={24} sm={12} key={field}>
                                    <Form.Item
                                        name={field}
                                        label={<span className="text-gray-200">{prettify(field)}</span>}
                                        rules={[{ required: true, message: 'Requerido' }]}
                                    >
                                        {field === 'fecha_inicio' ? (
                                            <Input type="date" style={{ background: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        ) : field === 'numero_sedes' || field === 'visitas_mensual' || field === 'visitas_emergencias' || field === 'cantidad_trabajadores' ? (
                                            <Input type="number" style={{ background: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        ) : (
                                            <Input style={{ background: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                                        )}
                                    </Form.Item>
                                </Col>
                            ))}
                        </Row>
                    </Form>
                </Drawer>
            </div>
        </ConfigProvider>
    );
}
