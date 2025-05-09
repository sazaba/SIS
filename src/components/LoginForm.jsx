import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import userApi from '../api/services/userApi';
import MyContext from '../context/Mycontext';
import LoadingComponent from './LoadingComponent';

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { actualizarNombreDB, actualizarPerfilDB, actualizarToken, token } = useContext(MyContext);
    const [invalidCredentials, setInvalidCredentials] = useState(false);
    const [isLoading, setIsLoading] = useState(false);



    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Activamos loading al comenzar
        try {
            const response = await userApi.login({
                email: email,
                contraseña: password,
            });
            const { token, nombre, perfil } = response.data;

            // Almacena el token en el estado local del componente
            actualizarToken(token);

            // Almacena el token en el localStorage para persistir la sesión
            localStorage.setItem('token', token);
            console.log(localStorage)

            // Actualizar el nombre de la base de datos utilizando el contexto
            actualizarNombreDB(nombre);
            actualizarPerfilDB(perfil);

            // Redirigir a la página principal o a donde sea necesario
            navigate('/profile-page');

        } catch (error) {
            console.error('Error al iniciar sesión:', error.response ? error.response.data : error.message);
            setInvalidCredentials(error.response?.data?.message || 'Credenciales inválidas');
        } finally {
            setIsLoading(false); // Se desactiva loading pase lo que pase
        }
    };

    if (isLoading) {
        return <LoadingComponent />;
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center font-bold">Inicio de Sesión</div>
                        <div className="card-body">
                            <form onSubmit={(e) => handleLogin(e)}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="current-username"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                    />
                                    {invalidCredentials && (
                                        <div className="text-red-700 font-sm text-sm">Credenciales inválidas</div>
                                    )}
                                </div>
                                <button type="submit" className="btn btn-primary bg-blue-700">
                                    Iniciar Sesión
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
