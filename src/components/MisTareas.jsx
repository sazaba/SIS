import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Typography, message, Button } from 'antd';
import { ArrowRightOutlined, ApartmentOutlined } from '@ant-design/icons';
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';

const { Title, Text } = Typography;

export default function MisTareas() {
    const { cedulaDB } = useContext(MyContext);
    const [nombres, setNombres] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!cedulaDB) return;
        setLoading(true);
        userApi.getEmpresasByUsuario(cedulaDB)
            .then(({ data }) => setNombres(data))
            .catch(error => {
                console.error('Error fetching empresas:', error);
                message.error('No se pudieron cargar las empresas.');
            })
            .finally(() => setLoading(false));
    }, [cedulaDB]);

    if (!cedulaDB) {
        return <p>Por favor inicia sesión para ver tus empresas.</p>;
    }

    return (
        <div style={{ padding: '24px' }}>
            <Title level={3} style={{ marginBottom: 24 }}>Tus Empresas Asignadas</Title>
            <Spin spinning={loading} tip="Cargando empresas...">
                <Row gutter={[24, 24]}>
                    {nombres.length === 0 ? (
                        <Col span={24}>
                            <Card>No tienes empresas asignadas.</Card>
                        </Col>
                    ) : (
                        nombres.map((nombre, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={6}>
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
                                    styles={{
                                        body: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: 24,
                                            height: '100%',
                                            gap: 16,
                                        }
                                    }}
                                    onClick={() => {
                                        message.info(`Acceso futuro al CRUD de ${nombre}`);
                                    }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <ApartmentOutlined style={{ fontSize: 40, color: '#1890ff', marginBottom: 8 }} />
                                        <Title level={4} style={{ margin: 0 }}>{nombre}</Title>
                                        <Text type="secondary">Empresa asignada</Text>
                                    </div>

                                    <button
                                        className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 rounded-full py-2 px-4 flex items-center justify-center gap-2"
                                    >
                                        Ver más <ArrowRightOutlined />
                                    </button>


                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            </Spin>
        </div>
    );
}
