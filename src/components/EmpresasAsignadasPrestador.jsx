import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Typography, message } from 'antd';
import { ArrowRightOutlined, ApartmentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';

const { Title, Text } = Typography;

export default function EmpresasAsignadasPrestador() {
    const { cedulaDB } = useContext(MyContext);
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!cedulaDB) return;
        setLoading(true);
        userApi.getEmpresasByUsuario(cedulaDB)
            .then(({ data }) => setEmpresas(data))
            .catch(err => {
                console.error('Error fetching empresas:', err);
                message.error('No se pudieron cargar las empresas.');
            })
            .finally(() => setLoading(false));
    }, [cedulaDB]);

    if (!cedulaDB) {
        return <p>Por favor inicia sesión para ver tus empresas.</p>;
    }

    return (
        <div style={{ padding: 24 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                Tus Empresas Asignadas
            </Title>

            <Spin spinning={loading} tip="Cargando empresas...">
                <Row gutter={[24, 24]}>
                    {empresas.length === 0 ? (
                        <Col span={24}>
                            <Card>No tienes empresas asignadas.</Card>
                        </Col>
                    ) : (
                        empresas.map((empresa) => (
                            <Col key={empresa.id_empresa} xs={24} sm={12} md={8} lg={6}>
                                <Card
                                    hoverable
                                    style={{
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
                                            style={{ fontSize: 40, color: '#1890ff', marginBottom: 8 }}
                                        />
                                        <Title level={4} style={{ margin: 0 }}>
                                            {empresa.nombre_empresa}
                                        </Title>
                                        <Text type="secondary">Empresa asignada</Text>
                                    </div>

                                    <Link
                                        to={`/prestador/empresas-asignadas-prestador/${empresa.id_empresa}`}
                                        className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 rounded-full py-2 px-4 flex items-center justify-center gap-2"
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
    );
}
