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
    Input,
    Button,
    ConfigProvider,
    theme,
} from 'antd';
import { ShopOutlined, SearchOutlined } from '@ant-design/icons';
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

export default function AsignacionTareas() {
    const { token } = useContext(MyContext);
    const [companies, setCompanies] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [assignments, setAssignments] = useState(new Set());
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Use message hook for dynamic theme
    const [messageApi, contextHolder] = message.useMessage();

    // Cargar datos iniciales
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [eRes, tRes, aRes] = await Promise.all([
                    userApi.getEmpresas(),
                    userApi.getTareasCompleto(),
                    userApi.getEmpresaTareas(),
                ]);
                const comps = eRes.data.map(e => ({ value: e.id, label: e.nombre_empresa }));
                const tsks = tRes.data.map(t => ({ value: t.id_tarea, label: t.descripcion_tarea }));
                setCompanies(comps);
                setTasks(tsks);
                setFilteredTasks(tsks);
                setAssignments(new Set(aRes.data.map(r => `${r.id_empresa}-${r.id_tarea}`)));
            } catch (err) {
                console.error(err);
                messageApi.error('Error cargando datos');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [token]);

    // Filtrar tareas
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFilteredTasks(tasks.filter(t => t.label.toLowerCase().includes(term)));
    }, [searchTerm, tasks]);

    const handleCompanyChange = id => {
        setSelectedCompany(id);
    };

    const handleToggle = async (taskId, checked) => {
        if (!selectedCompany) return;
        const key = `${selectedCompany}-${taskId}`;
        setLoading(true);
        try {
            if (checked) {
                await userApi.assignTareaToEmpresa({ idEmpresa: selectedCompany, idTarea: taskId });
                assignments.add(key);
            } else {
                await userApi.unassignTareaFromEmpresa(selectedCompany, taskId);
                assignments.delete(key);
            }
            setAssignments(new Set(assignments));
            messageApi.success(checked ? 'Tarea asignada' : 'Tarea desasignada');
        } catch (err) {
            console.error(err);
            messageApi.error('Error actualizando asignación');
        } finally {
            setLoading(false);
        }
    };

    const bulkAssign = async assign => {
        if (!selectedCompany) return;
        setLoading(true);
        try {
            const calls = filteredTasks
                .filter(t => assign ? !assignments.has(`${selectedCompany}-${t.value}`) : assignments.has(`${selectedCompany}-${t.value}`))
                .map(t => assign
                    ? userApi.assignTareaToEmpresa({ idEmpresa: selectedCompany, idTarea: t.value })
                    : userApi.unassignTareaFromEmpresa(selectedCompany, t.value)
                );
            await Promise.all(calls);
            const newSet = new Set(assignments);
            filteredTasks.forEach(t => {
                const key = `${selectedCompany}-${t.value}`;
                assign ? newSet.add(key) : newSet.delete(key);
            });
            setAssignments(newSet);
            messageApi.success(assign ? 'Tareas asignadas' : 'Tareas desasignadas');
        } catch (err) {
            console.error(err);
            messageApi.error('Error en operación masiva');
        } finally {
            setLoading(false);
        }
    };

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
            {contextHolder}
            <div style={{ padding: 24 }}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Title level={3} style={{ color: '#f9fafb' }}>
                            Asignación de Tareas a Empresa
                        </Title>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card
                            style={{ background: '#1f2937', border: 'none' }}
                            styles={{ body: { padding: 16 } }}
                        >
                            <Title level={5} style={{ color: '#f9fafb', marginBottom: 16 }}>
                                <ShopOutlined /> Seleccionar Empresa
                            </Title>
                            <Select
                                placeholder="Elige una empresa"
                                value={selectedCompany}
                                onChange={handleCompanyChange}
                                loading={loading}
                                showSearch
                                optionFilterProp="children"
                                style={{ width: '100%' }}
                                dropdownStyle={{ background: '#374151', color: '#f9fafb' }}
                                popupMatchSelectWidth
                            >
                                {companies.map(c => (
                                    <Option key={c.value} value={c.value}>
                                        {c.label}
                                    </Option>
                                ))}
                            </Select>
                        </Card>
                    </Col>

                    {selectedCompany && (
                        <Col xs={24}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: 48 }}>
                                    <Spin size="large" />
                                </div>
                            ) : (
                                <>
                                    <Card
                                        style={{ background: '#1f2937', border: 'none', marginBottom: 16 }}
                                        styles={{ body: { padding: 16 } }}
                                    >
                                        <Row gutter={16} align="middle">
                                            <Col xs={24} sm={12} md={8}>
                                                <Search
                                                    placeholder="Buscar tareas"
                                                    allowClear
                                                    value={searchTerm}
                                                    onChange={e => setSearchTerm(e.target.value)}
                                                    prefix={<SearchOutlined />}
                                                />
                                            </Col>
                                            <Col xs={24} sm={12} md={16} style={{ textAlign: 'right' }}>
                                                <Button
                                                    type="primary"
                                                    onClick={() => bulkAssign(true)}
                                                    disabled={loading || filteredTasks.length === 0}
                                                    style={{ marginRight: 8 }}
                                                >
                                                    Seleccionar todas
                                                </Button>
                                                <Button
                                                    type="default"
                                                    onClick={() => bulkAssign(false)}
                                                    disabled={loading || filteredTasks.length === 0}
                                                >
                                                    Deseleccionar todas
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card>

                                    <List
                                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
                                        dataSource={filteredTasks}
                                        pagination={{ pageSize: 8, position: ['bottomCenter'] }}
                                        renderItem={t => (
                                            <List.Item key={t.value}>
                                                <Card
                                                    hoverable
                                                    style={{ background: '#374151', border: 'none' }}
                                                    styles={{ body: { padding: 12 } }}
                                                >
                                                    <Checkbox
                                                        checked={assignments.has(`${selectedCompany}-${t.value}`)}
                                                        disabled={loading}
                                                        onChange={e => handleToggle(t.value, e.target.checked)}
                                                        style={{ color: '#f9fafb' }}
                                                    >
                                                        {t.label}
                                                    </Checkbox>
                                                </Card>
                                            </List.Item>
                                        )}
                                    />
                                </>
                            )}
                        </Col>
                    )}

                    {!selectedCompany && (
                        <Col xs={24}>
                            <Card style={{ background: '#1f2937', border: 'none' }} styles={{ body: { padding: 16 } }}>
                                <p style={{ color: '#f9fafb' }}>
                                    Selecciona una empresa para ver y editar sus tareas asignadas.
                                </p>
                            </Card>
                        </Col>
                    )}
                </Row>
            </div>
        </ConfigProvider>
    );
}
