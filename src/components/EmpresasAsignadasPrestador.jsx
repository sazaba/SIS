import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Typography, message, ConfigProvider, theme, Input, Space } from 'antd';
import { ArrowRightOutlined, ApartmentOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';

const { Title, Text } = Typography;
const { Search } = Input;

export default function EmpresasAsignadasPrestador() {
    const { cedulaDB } = useContext(MyContext);
    const [empresas, setEmpresas] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!cedulaDB) return;
        setLoading(true);
        userApi.getEmpresasByUsuario(cedulaDB)
            .then(({ data }) => {
                setEmpresas(data);
                setFiltered(data);
            })
            .catch(err => {
                console.error('Error fetching empresas:', err);
                message.error('No se pudieron cargar las empresas.');
            })
            .finally(() => setLoading(false));
    }, [cedulaDB]);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFiltered(
            empresas.filter(e =>
                e.nombre_empresa.toLowerCase().includes(term)
            )
        );
    }, [searchTerm, empresas]);

    if (!cedulaDB) {
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
                <div style={{ padding: 24 }}>
                    <Text style={{ color: '#f9fafb' }}>
                        Por favor inicia sesión para ver tus empresas.
                    </Text>
                </div>
            </ConfigProvider>
        );
    }

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
            <div style={{ padding: 24 }}>
                <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                    <Title level={3} style={{ color: '#f9fafb', margin: 0, paddingBottom: 10 }}>
                        Tus Empresas Asignadas
                    </Title>
                    <Search
                        placeholder="Buscar empresa"
                        allowClear
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                        style={{ maxWidth: 400 }}
                    />
                </Space>

                <Spin spinning={loading} tip="Cargando empresas...">
                    <Row gutter={[24, 24]}>
                        {filtered.length === 0 ? (
                            <Col span={24}>
                                <Card style={{ background: '#1f2937', border: 'none' }}>
                                    <Text style={{ color: '#f9fafb' }}>
                                        No se encontraron empresas.
                                    </Text>
                                </Card>
                            </Col>
                        ) : (
                            filtered.map((empresa) => (
                                <Col key={empresa.id_empresa} xs={24} sm={12} md={8} lg={6}>
                                    <Card
                                        hoverable
                                        style={{
                                            background: '#1f2937',
                                            border: 'none',
                                            borderRadius: 16,
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                                            minHeight: 280,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <div style={{ textAlign: 'center', padding: 24 }}>
                                            <ApartmentOutlined
                                                style={{ fontSize: 40, color: '#3b82f6', marginBottom: 8 }}
                                            />
                                            <Title level={4} style={{ color: '#f9fafb', margin: 0 }}>
                                                {empresa.nombre_empresa}
                                            </Title>
                                            <Text type="secondary" style={{ color: '#9ca3af' }}>
                                                Empresa asignada
                                            </Text>
                                        </div>

                                        <Link
                                            to={`/prestador/empresas-asignadas-prestador/${empresa.id_empresa}`}
                                            style={{
                                                background: '#3b82f6',
                                                color: '#f9fafb',
                                                textAlign: 'center',
                                                padding: '8px 16px',
                                                borderRadius: 9999,
                                                textDecoration: 'none',
                                                fontWeight: 500,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 8,
                                            }}
                                        >
                                            Ver más <ArrowRightOutlined />
                                        </Link>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>
                </Spin>
            </div>
        </ConfigProvider>
    );
}

