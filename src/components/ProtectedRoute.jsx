
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../context/Mycontext';

const ProtectedRoute = ({ element }) => {
    const { perfilDB } = useContext(MyContext);

    // Verificar si el usuario ha iniciado sesión y tiene perfil de administrador
    const isAuthenticated = perfilDB === 'administrador';

    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
