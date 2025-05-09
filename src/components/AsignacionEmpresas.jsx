// frontend/src/components/AsignacionEmpresas.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Select, List, Checkbox, Card, Spin, message, Typography } from 'antd';
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';

const { Title } = Typography;
const { Option } = Select;

export default function AsignacionEmpresas() {
    const { token } = useContext(MyContext);
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [assignments, setAssignments] = useState(new Set());
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const [uRes, eRes, allAssignRes] = await Promise.all([
                    userApi.getUsuariosOptions(),
                    userApi.getEmpresasOptions(),
                    userApi.getUsuariosEmpresa()
                ]);
                setUsers(uRes.data);
                setCompanies(eRes.data);
                setAssignments(new Set(allAssignRes.data.map(r => `${r.usuario_cedula}-${r.id_empresa}`)));
            } catch {
                message.error('Error al cargar opciones');
            }
        }
        fetchOptions();
    }, [token]);

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
        } catch {
            message.error('Error al actualizar asignación');
        } finally {
            setLoading(false);
        }
    };

    const renderCompanyList = () => (
        <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={companies}
            renderItem={c => (
                <List.Item key={c.value}>
                    <Card hoverable>
                        <Checkbox
                            checked={assignments.has(`${selectedUser}-${c.value}`)}
                            disabled={!selectedUser || loading}
                            onChange={e => handleToggle(c.value, e.target.checked)}
                        >
                            {c.label}
                        </Checkbox>
                    </Card>
                </List.Item>
            )}
        />
    );

    return (
        <Row gutter={[16, 16]} style={{ padding: 24 }}>
            <Col span={24}><Title level={3}>Asignación de Empresas a Usuario</Title></Col>
            <Col xs={24} sm={12} md={8}>
                <Card>
                    <Title level={5}>Seleccionar Usuario</Title>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Elige un usuario"
                        value={selectedUser}
                        onChange={handleUserChange}
                        showSearch
                        optionFilterProp="children"
                    >
                        {users.map(u => <Option key={u.value} value={u.value}>{u.label}</Option>)}
                    </Select>
                </Card>
            </Col>
            <Col xs={24}>
                {loading
                    ? <Spin />
                    : selectedUser
                        ? renderCompanyList()
                        : <Card><p>Selecciona un usuario para ver y editar sus asignaciones.</p></Card>
                }
            </Col>
        </Row>
    );
}
