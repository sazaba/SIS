// frontend/src/components/AsignacionTareas.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Select, List, Checkbox, Card, Spin, message, Typography, Input, Button } from 'antd';
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

export default function AsignacionTareas() {
    const { token } = useContext(MyContext);

    const [companies, setCompanies] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [assignments, setAssignments] = useState(new Set());
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // cargar empresas, tareas y asignaciones
    useEffect(() => {
        async function fetchData() {
            try {
                const [eRes, tRes, aRes] = await Promise.all([
                    userApi.getEmpresas(),
                    userApi.getTareasCompleto(),
                    userApi.getEmpresaTareas()
                ]);
                setCompanies(eRes.data.map(e => ({ value: e.id, label: e.nombre_empresa })));
                setTasks(tRes.data.map(t => ({ value: t.id_tarea, label: t.descripcion_tarea })));
                setAssignments(new Set(aRes.data.map(r => `${r.id_empresa}-${r.id_tarea}`)));
            } catch (err) {
                console.error(err);
                message.error('Error cargando datos');
            }
        }
        fetchData();
    }, [token]);

    const filteredTasks = tasks.filter(t =>
        t.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            message.success(checked ? 'Tarea asignada' : 'Tarea desasignada');
        } catch (err) {
            console.error(err);
            message.error('Error actualizando asignación');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = async () => {
        if (!selectedCompany) return;
        setLoading(true);
        try {
            await Promise.all(
                filteredTasks.map(t => {
                    const key = `${selectedCompany}-${t.value}`;
                    if (!assignments.has(key)) {
                        return userApi.assignTareaToEmpresa({ idEmpresa: selectedCompany, idTarea: t.value });
                    }
                    return Promise.resolve();
                })
            );
            const newSet = new Set(assignments);
            filteredTasks.forEach(t => newSet.add(`${selectedCompany}-${t.value}`));
            setAssignments(newSet);
            message.success('Todas las tareas filtradas han sido asignadas');
        } catch (err) {
            console.error(err);
            message.error('Error asignando todas las tareas');
        } finally {
            setLoading(false);
        }
    };

    const handleDeselectAll = async () => {
        if (!selectedCompany) return;
        setLoading(true);
        try {
            await Promise.all(
                filteredTasks.map(t => {
                    const key = `${selectedCompany}-${t.value}`;
                    if (assignments.has(key)) {
                        return userApi.unassignTareaFromEmpresa(selectedCompany, t.value);
                    }
                    return Promise.resolve();
                })
            );
            const newSet = new Set(assignments);
            filteredTasks.forEach(t => newSet.delete(`${selectedCompany}-${t.value}`));
            setAssignments(newSet);
            message.success('Todas las tareas filtradas han sido desasignadas');
        } catch (err) {
            console.error(err);
            message.error('Error desasignando todas las tareas');
        } finally {
            setLoading(false);
        }
    };

    const renderControls = () => (
        <Card style={{ marginBottom: 16 }}>
            <Search
                placeholder="Buscar tareas"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: 12 }}
                allowClear
            />
            <Button
                onClick={handleSelectAll}
                disabled={!selectedCompany || loading || filteredTasks.length === 0}
                style={{ marginRight: 8 }}
            >
                Seleccionar todas
            </Button>
            <Button
                onClick={handleDeselectAll}
                disabled={!selectedCompany || loading || filteredTasks.length === 0}
            >
                Deseleccionar todas
            </Button>
        </Card>
    );

    const renderTaskList = () => (
        <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={filteredTasks}
            renderItem={t => (
                <List.Item key={t.value}>
                    <Card hoverable>
                        <Checkbox
                            checked={assignments.has(`${selectedCompany}-${t.value}`)}
                            disabled={!selectedCompany || loading}
                            onChange={e => handleToggle(t.value, e.target.checked)}
                        >
                            {t.label}
                        </Checkbox>
                    </Card>
                </List.Item>
            )}
        />
    );

    return (
        <Row gutter={[16, 16]} style={{ padding: 24 }}>
            <Col span={24}>
                <Title level={3}>Asignación de Tareas a Empresa</Title>
            </Col>

            <Col xs={24} sm={12} md={8}>
                <Card>
                    <Title level={5}>Seleccionar Empresa</Title>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Elige una empresa"
                        value={selectedCompany}
                        onChange={handleCompanyChange}
                        showSearch
                        optionFilterProp="children"
                    >
                        {companies.map(e => (
                            <Option key={e.value} value={e.value}>
                                {e.label}
                            </Option>
                        ))}
                    </Select>
                </Card>
            </Col>

            {selectedCompany && (
                <Col xs={24}>
                    {loading ? <Spin /> : (
                        <>
                            {renderControls()}
                            {renderTaskList()}
                        </>
                    )}
                </Col>
            )}

            {!selectedCompany && (
                <Col xs={24}>
                    <Card>
                        <p>Selecciona una empresa para ver y editar sus tareas asignadas.</p>
                    </Card>
                </Col>
            )}
        </Row>
    );
}
