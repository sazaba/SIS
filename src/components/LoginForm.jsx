import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ConfigProvider, Card, Form, Input, Button, Typography, Alert, Spin, theme } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';

const { Title, Text } = Typography;
const { darkAlgorithm } = theme;

const LoginForm = () => {
    const navigate = useNavigate();
    const { actualizarNombreDB, actualizarPerfilDB, actualizarToken } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onFinish = async ({ email, password }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userApi.login({ email, contraseña: password });
            const { token, nombre, perfil } = response.data;

            actualizarToken(token);
            localStorage.setItem('token', token);
            actualizarNombreDB(nombre);
            actualizarPerfilDB(perfil);
            navigate('/profile-page');
        } catch (err) {
            const message = err.response?.data?.message || 'Error al iniciar sesión';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
            <div className="flex items-start justify-center min-h-screen bg-gray-950 p-4 pt-20 sm:pt-32">
                <Card className="w-full max-w-md rounded-2xl shadow-lg bg-gray-900 border border-gray-800">
                    <div className="text-center mb-6">
                        <Title level={2} className="!text-white">Iniciar Sesión</Title>
                        <Text className="!text-gray-400">Accede a tu cuenta</Text>
                    </div>

                    {error && <Alert message={error} type="error" showIcon className="mb-4" />}

                    <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
                        <Form.Item
                            name="email"
                            label={<span className="text-gray-300">Correo Electrónico</span>}
                            rules={[{ required: true, message: 'Por favor ingresa tu correo' }]}
                        >
                            <Input
                                prefix={<MailOutlined className="text-gray-400" />}
                                placeholder="tucorreo@ejemplo.com"
                                autoComplete="username"
                                className="bg-gray-800 text-white border border-gray-700 rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={<span className="text-gray-300">Contraseña</span>}
                            rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="********"
                                autoComplete="current-password"
                                className="bg-gray-800 text-white border border-gray-700 rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 border-none rounded-lg"
                            >
                                {loading ? <Spin /> : 'Iniciar Sesión'}
                            </Button>
                        </Form.Item>

                        <Form.Item className="text-center">
                            <Text className="text-gray-500">
                                ¿No tienes cuenta? <Link to="/register" className="text-blue-400 hover:underline">Regístrate</Link>
                            </Text>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </ConfigProvider>
    );
};

export default LoginForm;
