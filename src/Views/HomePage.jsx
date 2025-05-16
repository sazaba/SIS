// src/pages/HomePage.jsx

import React from 'react';
import { Layout, Button, Typography, Row, Col, Card } from 'antd';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CommunityCarousel from './CommunityCarousel';

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function HomePage() {
    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
        ],
    };

    const benefits = [
        { title: 'Reducción de Accidentes', desc: 'Control de riesgos disminuye lesiones y días perdidos.' },
        { title: 'Cumplimiento Legal', desc: 'Evita sanciones cumpliendo la Ley 29783.' },
        { title: 'Mejora Continua', desc: 'Auditorías y retroalimentación permanente.' },
        { title: 'Bienestar Laboral', desc: 'Ambiente saludable aumenta la moral.' },
    ];

    const steps = [
        { title: 'Planificar', desc: 'Identifica peligros y evalúa riesgos.' },
        { title: 'Hacer', desc: 'Implementa controles y acciones.' },
        { title: 'Verificar', desc: 'Mide desempeño y realiza auditorías.' },
        { title: 'Actuar', desc: 'Adapta y mejora basado en resultados.' },
    ];

    return (
        <Layout className="bg-gray-900 text-gray-100 min-h-screen">
            {/* HERO */}
            <Content className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-gray-900/80 animate-fadeIn" />
                <div className="relative z-10 text-center px-6">
                    <Title
                        level={1}
                        className="!text-white font-extrabold text-4xl sm:text-5xl md:text-6xl mb-4 transform transition-transform hover:scale-105"
                    >
                        Sistema Integral en Riesgos Laborales
                    </Title>
                    <Paragraph className="!text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Implementa un SG-SST efectivo para proteger a tus colaboradores, reducir costos y elevar la productividad.
                    </Paragraph>
                    <Button
                        type="primary"
                        size="large"
                        className="bg-cyan-500 text-white font-semibold border-none py-3 px-8 rounded-full hover:bg-cyan-600 transition"
                    >
                        Contáctanos
                    </Button>
                </div>
            </Content>

            {/* BENEFICIOS */}
            <Content className="py-20 px-4 sm:px-8 lg:px-16">
                <div className="max-w-6xl mx-auto text-center">
                    <Title level={2} className="!text-white font-extrabold mb-12">
                        Beneficios del SG-SST
                    </Title>
                    <Row gutter={[32, 32]}>
                        {benefits.map((b, i) => (
                            <Col xs={24} sm={12} md={6} key={i}>
                                <Card className="bg-gray-800 border-none p-8 hover:shadow-2xl transition-shadow">
                                    <Title level={4} className="!text-cyan-300 font-semibold mb-3">
                                        {b.title}
                                    </Title>
                                    <Paragraph className="!text-gray-300 leading-snug">
                                        {b.desc}
                                    </Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Content>

            {/* CARRUSEL */}
            <Content className="py-20 bg-gray-800">
                <div className="max-w-5xl mx-auto px-4">
                    <Title level={3} className="!text-white font-semibold text-center mb-8">
                        Únete a Nuestra Comunidad
                    </Title>
                    <CommunityCarousel settings={carouselSettings} />
                </div>
            </Content>

            {/* CÓMO FUNCIONA (PHVA) */}
            <Content className="py-20 px-4 sm:px-8 lg:px-16">
                <div className="max-w-6xl mx-auto text-center">
                    <Title level={2} className="!text-white font-extrabold mb-12">
                        Cómo Funciona (Ciclo PHVA)
                    </Title>
                    <Row gutter={[32, 32]}>
                        {steps.map((s, i) => (
                            <Col xs={24} sm={12} md={6} key={i}>
                                <Card className="bg-gray-800 border-none p-8 hover:shadow-2xl transition-shadow">
                                    <Title level={4} className="!text-cyan-300 font-semibold mb-2">
                                        {s.title}
                                    </Title>
                                    <Paragraph className="!text-gray-300">
                                        {s.desc}
                                    </Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Content>

            {/* LLAMADA A LA ACCIÓN FINAL */}
            <Content className="py-20 bg-blue-900 text-center px-4">
                <Title level={2} className="!text-white font-extrabold mb-6">
                    ¿Listo para llevar tu SG-SST al siguiente nivel?
                </Title>
                <Paragraph className="!text-gray-200 mb-8">
                    Contacta a nuestros expertos y recibe asesoría personalizada.
                </Paragraph>
                <Button
                    type="primary"
                    size="large"
                    className="bg-white text-blue-900 font-semibold border-none py-3 px-8 rounded-full hover:bg-gray-200 transition"
                >
                    Solicitar Asesoría
                </Button>
            </Content>

            {/* FOOTER */}
            <Footer className="bg-gray-800 text-white text-center py-6">
                ©2025 SIS - Sistema Integral en Riesgos Laborales
            </Footer>
        </Layout>
    );
}
