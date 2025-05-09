import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import userApi from '../api/services/userApi';

const MisTareas = () => {
    const [relaciones, setRelaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

    useEffect(() => {
        const cargarRelaciones = async () => {
            try {
                // Llamamos al endpoint protegido que devuelve solo las empresas del usuario logueado
                const misEmpresas = await userApi.getMisEmpresas();
                setRelaciones(misEmpresas);
            } catch (error) {
                console.error('Error al cargar mis empresas:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarRelaciones();
    }, []);

    const handleSeleccion = (empresa) => {
        setEmpresaSeleccionada(empresa);
        // Ejemplo: guardar en localStorage
        localStorage.setItem('empresaActual', empresa);
        // O redirigir: navigate(`/dashboard/${empresaId}`);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Seleccione la empresa para trabajar</h2>
            <div className="row">
                {relaciones.map((rel, idx) => (
                    <div className="col-12 col-sm-6 col-lg-4 mb-4" key={idx}>
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column justify-content-between">
                                <h5 className="card-title">{rel.empresa_nombre}</h5>
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => handleSeleccion(rel.empresa_nombre)}
                                >
                                    Seleccionar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {empresaSeleccionada && (
                <div className="alert alert-success text-center mt-4" role="alert">
                    Has seleccionado: <strong>{empresaSeleccionada}</strong>
                </div>
            )}
        </div>
    );
};

export default MisTareas;
