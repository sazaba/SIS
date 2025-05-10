
// src/App.jsx
import React, { useEffect, useState } from 'react';
import 'antd/dist/reset.css';  // Para Ant Design v5+
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './Views/HomePage';
import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';
import MyContext from './context/Mycontext';
import NavigationBar from './Views/NavigationBar';
import ProtectedRoute from './components/ProtectedRoute';
import GestionUsuarios from './components/GestionUsuarios';
import userApi from './api/services/userApi'
import LoadingComponent from './components/LoadingComponent';
import GestionEmpresas from './components/GestionEmpresas';
import GestionTareas from './components/GestionTareas';
import AdminLayout from './components/adminLayout';
import AsignacionEmpresas from './components/AsignacionEmpresas';
import PrestadorLayout from './components/PrestadorLayout';
import MisTareas from './components/MisTareas';
import AsignacionTareas from './components/AsignacionTareas';




const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      actualizarToken(storedToken);
      userApi.validateToken(storedToken).then((response) => {
        const { nombre, perfil, cedula } = response.data;
        actualizarNombreDB(nombre);
        actualizarPerfilDB(perfil);
        actualizarCedulaDB(cedula)
        // Una vez que el token se ha validado, establece isLoading en false
        setIsLoading(false);
      }).catch((error) => {
        console.error('Error al validar el token:', error.response ? error.response.data : error.message);
        localStorage.removeItem('token');
        // Si el token no es válido, también establece isLoading en false
        setIsLoading(false);
      });
    } else {
      // Si no hay token almacenado, establece isLoading en false
      setIsLoading(false);
    }
  }, []);


  const [userInfo, setUserInfo] = useState([]);
  const [nombreDB, setNombreDB] = useState('');
  const [cedulaDB, setCedulaDB] = useState(0)
  const [perfilDB, setPerfilDB] = useState('');
  const [token, setToken] = useState();

  const actualizarNombreDB = (nuevoNombre) => {
    setNombreDB(nuevoNombre);
  };
  const actualizarPerfilDB = (nuevoPerfil) => {
    setPerfilDB(nuevoPerfil)
  };
  const actualizarToken = (nuevoToken) => {
    setToken(nuevoToken);
  };
  const actualizarUserInfo = (nuevaInfo) => {
    setUserInfo([nuevaInfo])
  }
  const actualizarCedulaDB = (nuevaCedula) => {
    setCedulaDB(nuevaCedula)
  }

  const sharedData = {
    nombreDB,
    actualizarNombreDB,
    perfilDB,
    actualizarPerfilDB,
    token,
    actualizarToken,
    userInfo,
    actualizarUserInfo,
    cedulaDB,
    actualizarCedulaDB

  };

  return (
    <Router>
      <MyContext.Provider value={sharedData}>
        <NavigationBar />
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/profile-page" element={<ProfilePage />} />


            {/* Dashboard Admin con sidebar */}
            <Route path="/admin" element={<ProtectedRoute element={<AdminLayout />} />}>
              <Route index element={<Navigate replace to="usuarios" />} />
              <Route path="usuarios" element={<GestionUsuarios />} />
              <Route path="empresas" element={<GestionEmpresas />} />
              <Route path="tareas" element={<GestionTareas />} />
              <Route path="asignacion-empresas" element={<AsignacionEmpresas />} />
              <Route path="asignacion-tareas" element={<AsignacionTareas />} />
            </Route>
            {/* Dashboard Prestador con sidebar */}
            <Route path="/prestador" element={<ProtectedRoute element={<PrestadorLayout />} />} >
              <Route index element={<MisTareas />} />
              <Route path="mis-tareas" element={<MisTareas />} />
            </Route>

            {/* Rutas legacy (opcionalmente se pueden redirigir a /admin/...) */}
            <Route path="/gestion-usuarios" element={<ProtectedRoute element={<GestionUsuarios />} />} />
            <Route path="/gestion-empresas" element={<ProtectedRoute element={<GestionEmpresas />} />} />
            <Route path="/gestion-tareas" element={<ProtectedRoute element={<GestionTareas />} />} />




          </Routes>
        )}
      </MyContext.Provider>
    </Router>
  );
};

export default App;
