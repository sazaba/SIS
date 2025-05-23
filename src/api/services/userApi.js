import axios from 'axios';

const userApi = axios.create({
    baseURL: 'http://localhost:3001',
});

// Interceptor para adjuntar automáticamente el token del contexto a las solicitudes
userApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const api = {
    // Funciones relacionadas con usuarios
    createUser: (userData) => userApi.post('/users/create', userData),
    updateUser: (cedula, userData) => userApi.put(`/users/update/${cedula}`, userData),
    getUsers: () => userApi.get('/users/usuarios'),
    deleteUser: (cedula) => userApi.delete(`/users/delete/${cedula}`),

    // Funciones relacionadas con empresas
    createEmpresa: (empresaData) => userApi.post('/empresas/create', empresaData),
    updateEmpresa: (nit, empresaData) => userApi.put(`/empresas/update/${nit}`, empresaData),
    getEmpresas: () => userApi.get('/empresas/empresas'),
    deleteEmpresa: (nit) => userApi.delete(`/empresas/delete/${nit}`),

    // Funciones relacionadas con tareas
    getTareasCompleto: () => userApi.get('/tareas/completo'),
    getCatalogos: () => userApi.get('/tareas/catalogos'),
    createTarea: tareaData => userApi.post('/tareas', tareaData),
    updateTarea: (idTarea, tareaData) => userApi.put(`/tareas/${idTarea}`, tareaData),
    deleteTarea: idTarea => userApi.delete(`/tareas/${idTarea}`),

    // Funciones relacionadas con autenticación
    login: (credentials) => userApi.post('/auth/login', credentials),
    logout: () => { },
    validateToken: (token) => userApi.post('/auth/validate-token', { token }),

    // Funciones relacionadas con Asignar Usuarios a Empresas
    getUsuariosEmpresa: () => userApi.get('/usuarios_empresa/list'),
    createUsuariosEmpresa: data => userApi.post('/usuarios_empresa/create', data),
    deleteUsuariosEmpresa: (usuario_cedula, id_empresa) =>
        userApi.delete(`/usuarios_empresa/delete/${usuario_cedula}/${id_empresa}`),
    getUsuariosOptions: () => userApi.get('/usuarios_empresa/options/usuarios'),
    getEmpresasOptions: () => userApi.get('/usuarios_empresa/options/empresas'),

    // OBTENER EMPRESAS DE USUARIO en MisTareas.jsx
    getEmpresasByUsuario: (cedula) => userApi.get(`/usuarios_empresa/mis-empresas/${cedula}`),


    // Funciones relacionadas con asignación empresa ↔ tarea
    getEmpresaTareas: (filters) =>
        userApi.get('/empresa-tareas', { params: filters }),
    assignTareaToEmpresa: (data) =>
        userApi.post('/empresa-tareas', data),
    unassignTareaFromEmpresa: (idEmpresa, idTarea) =>
        userApi.delete('/empresa-tareas', {
            params: { idEmpresa, idTarea }
        }),

    // funciones de gestionPrestadorTarea - UNIFICADAS en /gestion-prestador-tareas
    getGestionTareas: (empresaId) =>
        userApi.get('/gestion-prestador-tareas', { params: { empresaId } }),
    createGestionTarea: (data) =>
        userApi.post('/gestion-prestador-tareas', data),
    updateGestionTarea: (data) =>
        userApi.put('/gestion-prestador-tareas', data),
    deleteGestionTarea: (empresaId, tareaId) =>
        userApi.delete('/gestion-prestador-tareas', { params: { empresaId, tareaId } }),

    getHistorialGestion: (empresaId, tareaId) =>
        userApi.get('/gestion-prestador-tareas/historial', {
            params: { empresaId, tareaId }
        }),
    deleteHistorialItem: (id) =>
        userApi.delete(`/gestion-prestador-tareas/historial/${id}`),
};



export default api;
