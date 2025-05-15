// src/pages/HomePage.jsx

import React from 'react';
import { Layout, Button, Typography, Row, Col, Card } from 'antd';
import office from '../images/office.webp';

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const features = [
    { title: 'Gestión Simple', description: 'Organiza tareas de seguridad con un solo clic.' },
    { title: 'Reportes Claros', description: 'Accede a métricas en tiempo real.' },
    { title: 'Cumplimiento Normativo', description: 'Automatiza procesos y evita sanciones.' },
];

export default function HomePage() {
    return (
        <Layout className="bg-gray-900 text-gray-100 min-h-screen">
            <Content>
                {/* Hero */}
                <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh]">
                    <img
                        src={office}
                        alt="Oficina"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center px-4">
                        <Title
                            level={2}
                            className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center"
                        >
                            Sistema Integral en Riesgos Laborales
                        </Title>
                        <Paragraph className="text-gray-200 text-center max-w-xl mt-2">
                            Simplifica la gestión de seguridad y salud en el trabajo para PYMEs en Colombia.
                        </Paragraph>
                        <Button
                            type="primary"
                            size="large"
                            className="bg-cyan-500 border-none mt-4 hover:bg-cyan-600 transition-colors"
                        >
                            Comienza Ahora
                        </Button>
                    </div>
                </div>

                {/* Características */}
                <div className="container mx-auto px-4 py-12">
                    <Row gutter={[24, 24]}>
                        {features.map((feature, idx) => (
                            <Col xs={24} sm={12} md={8} key={idx}>
                                <Card className="bg-gray-800 border-none hover:shadow-lg transition-shadow p-6">
                                    <Title level={4} className="text-cyan-400 mb-2">
                                        {feature.title}
                                    </Title>
                                    <Paragraph className="text-gray-300">
                                        {feature.description}
                                    </Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Content>

            <Footer className="bg-gray-800 text-gray-500 text-center py-6">
                ©2025 SIS - Sistema Integral en Riesgos Laborales
            </Footer>
        </Layout>
    );
}
