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

// helper para convertir claves en títulos bonitos
const prettify = (key) =>
    key
        .split('_')
        .map((word) =>
            word.toLowerCase() === 'sst'
                ? 'SST'
                : word[0].toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');

export default function GestionUsuarios() {
    const { actualizarUserInfo } = useContext(MyContext);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();
    const fields = [
        'cedula',
        'nombre',
        'apellido',
        'telefono',
        'email',
        'direccion',
        'licencia',
        'profesion',
        'perfil',
        'formacion',
        'especialidad',
        'titulo',
        'competencia_tecnica',
        'curso_sst',
        'activo_inactivo',
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const term = searchText.toLowerCase();
        setFilteredData(
            usuarios.filter((u) =>
                fields.some((f) =>
                    String(u[f]).toLowerCase().includes(term)
                )
            )
        );
    }, [searchText, usuarios]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await userApi.getUsers();
            setUsuarios(data);
            setFilteredData(data);
            actualizarUserInfo(data);
        } catch (err) {
            message.error('Error cargando usuarios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openNewModal = () => {
        form.resetFields();
        form.setFieldsValue({});
        setIsEditing(false);
        setCurrentRecord(null);
        setIsModalVisible(true);
    };
    const openEditModal = (record) => {
        form.setFieldsValue(record);
        setIsEditing(true);
        setCurrentRecord(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (cedula) => {
        setDeletingId(cedula);
        try {
            await userApi.deleteUser(cedula);
            message.success('Usuario eliminado');
        } catch (err) {
            console.error('Delete error:', err);
            if (err.errno === 1451) {
                message.error(
                    'No se puede eliminar: este usuario está asociado a una empresa. ' +
                    'Desasócialo antes de eliminarlo.'
                );
            } else {
                message.error('Error al eliminar');
            }
        } finally {
            await fetchUsers();
            setDeletingId(null);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setConfirmLoading(true);
            if (!isEditing && !values.contraseña) {
                message.error('Debes ingresar contraseña');
                setConfirmLoading(false);
                return;
            }
            const payload = { ...values };
            if (isEditing && !values.contraseña) {
                delete payload.contraseña;
            }
            if (isEditing) {
                await userApi.updateUser(currentRecord.cedula, payload);
                message.success('Usuario actualizado');
            } else {
                await userApi.createUser(payload);
                message.success('Usuario creado');
            }
            setIsModalVisible(false);
            fetchUsers();
        } catch (err) {
            console.error(err);
            message.error('Error en la operación');
        } finally {
            setConfirmLoading(false);
        }
    };

    const columns = [
        ...fields.map((key) => ({
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
                        onClick={() => openEditModal(record)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        size="small"
                        danger
                        loading={deletingId === record.cedula}
                        onClick={() => handleDelete(record.cedula)}
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
                            Gestión de Usuarios
                        </h2>
                    </Col>
                    <Col xs={24} sm={10}>
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Buscar usuarios..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={6} className="text-center sm:text-right">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openNewModal}
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
                    rowKey="cedula"
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
                                {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </span>
                        </Space>
                    }
                    placement="right"
                    width={window.innerWidth < 768 ? '100%' : 600}
                    open={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
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
                            <Button onClick={() => setIsModalVisible(false)}>
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
                            { title: 'Perfil' },
                            { title: 'Confirmación' },
                        ]}
                    />

                    <Form form={form} layout="vertical">
                        <Row gutter={[16, 16]}>
                            {[...fields, ...(!isEditing ? ['contraseña'] : [])].map((field) => (
                                <Col xs={24} sm={12} key={field}>
                                    <Form.Item
                                        name={field}
                                        label={<span className="text-gray-200">{prettify(field)}</span>}
                                        rules={[
                                            {
                                                required: !isEditing || field !== 'contraseña',
                                                message: 'Requerido',
                                            },
                                        ]}
                                    >
                                        {field === 'perfil' ? (
                                            <Select>
                                                <Option value="administrador">Administrador</Option>
                                                <Option value="prestador">Prestador</Option>
                                            </Select>
                                        ) : field === 'activo_inactivo' ? (
                                            <Select>
                                                <Option value="activo">Activo</Option>
                                                <Option value="inactivo">Inactivo</Option>
                                            </Select>
                                        ) : (
                                            <Input
                                                type={field === 'contraseña' ? 'password' : 'text'}
                                                style={{
                                                    background: '#1f2937',
                                                    borderColor: '#374151',
                                                    color: '#fff',
                                                }}
                                            />
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
