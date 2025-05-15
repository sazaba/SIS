import React, { useState, useEffect, useContext } from 'react';
import {
    Row,
    Col,
    Select,
    List,
    Checkbox,
    Card,
    Spin,
    message,
    Typography,
    ConfigProvider,
    theme,
    Input,
} from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

export default function AsignacionEmpresas() {
    const { token } = useContext(MyContext);
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [assignments, setAssignments] = useState(new Set());
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch options
    useEffect(() => {
        async function fetchOptions() {
            setLoading(true);
            try {
                const [uRes, eRes, allAssignRes] = await Promise.all([
                    userApi.getUsuariosOptions(),
                    userApi.getEmpresasOptions(),
                    userApi.getUsuariosEmpresa(),
                ]);
                setUsers(uRes.data);
                setCompanies(eRes.data);
                setFilteredCompanies(eRes.data);
                setAssignments(new Set(allAssignRes.data.map(r => `${r.usuario_cedula}-${r.id_empresa}`)));
            } catch (err) {
                console.error(err);
                message.error('Error al cargar opciones');
            } finally {
                setLoading(false);
            }
        }
        fetchOptions();
    }, [token]);

    // Filter companies
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFilteredCompanies(
            companies.filter(c => c.label.toLowerCase().includes(term))
        );
    }, [searchTerm, companies]);

    const handleUserChange = cedula => setSelectedUser(cedula);

    const handleToggle = async (companyId, checked) => {
        if (!selectedUser) return;
        const key = `${selectedUser}-${companyId}`;
        setLoading(true);
        try {
            if (checked) {
                await userApi.createUsuariosEmpresa({ usuario_cedula: selectedUser, id_empresa: companyId });
                assignments.add(key);
            } else {
                await userApi.deleteUsuariosEmpresa(selectedUser, companyId);
                assignments.delete(key);
            }
            setAssignments(new Set(assignments));
            message.success(checked ? 'Empresa asignada' : 'Empresa desasignada');
        } catch (err) {
            console.error(err);
            message.error('Error al actualizar asignación');
        } finally {
            setLoading(false);
        }
    };

    const renderCompanyList = () => (
        <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={filteredCompanies}
            pagination={{ pageSize: 8, position: ['bottomCenter'] }}
            renderItem={c => (
                <List.Item key={c.value}>
                    <Card
                        hoverable
                        className="bg-gradient-to-br from-gray-700 to-gray-800 text-white"
                        bodyStyle={{ padding: '12px', borderRadius: '8px' }}
                    >
                        <Checkbox
                            checked={assignments.has(`${selectedUser}-${c.value}`)}
                            disabled={!selectedUser || loading}
                            onChange={e => handleToggle(c.value, e.target.checked)}
                            className="text-white"
                        >
                            {c.label}
                        </Checkbox>
                    </Card>
                </List.Item>
            )}
        />
    );

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorBgLayout: '#111827',
                    colorBgContainer: '#1f2937',
                    colorText: '#f9fafb',
                    colorPrimary: '#3b82f6',
                },
            }}
        >
            <div className="p-6">
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Title level={3} className="text-white">
                            Asignación de Empresas a Usuario
                        </Title>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card className="bg-gray-800 text-white">
                            <Title level={5} className="text-white">
                                <UserOutlined /> Seleccionar Usuario
                            </Title>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Elige un usuario"
                                value={selectedUser}
                                onChange={handleUserChange}
                                showSearch
                                optionFilterProp="children"
                                loading={loading}
                                dropdownStyle={{ background: '#1f2937', color: '#f9fafb' }}
                                className="bg-gray-800"
                            >
                                {users.map(u => (
                                    <Option key={u.value} value={u.value} className="bg-gray-800 text-white">
                                        {u.label}
                                    </Option>
                                ))}
                            </Select>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card className="bg-gray-800 text-white">
                            <Title level={5} className="text-white">
                                <SearchOutlined /> Buscar Empresas
                            </Title>
                            <Search
                                placeholder="Nombre de empresa"
                                allowClear
                                onSearch={value => setSearchTerm(value)}
                                onChange={e => setSearchTerm(e.target.value)}
                                value={searchTerm}
                                disabled={loading}
                            />
                        </Card>
                    </Col>

                    <Col xs={24}>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Spin size="large" />
                            </div>
                        ) : selectedUser ? (
                            renderCompanyList()
                        ) : (
                            <Card className="bg-gray-800 text-white">
                                <p>Selecciona un usuario para ver y editar sus asignaciones.</p>
                            </Card>
                        )}
                    </Col>
                </Row>
            </div>
        </ConfigProvider>
    );
}
