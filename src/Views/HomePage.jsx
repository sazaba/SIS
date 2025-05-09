import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AddTaskIcon from '@mui/icons-material/AddTask';
import QueryStatsIcon from '@mui/icons-material/QueryStats';


const HomePage = () => {
    return (
        <div className="container mx-auto mt-8 flex flex-col items-center">

            <h1 className="text-4xl font-bold mb-4 text-center">Bienvenido a tu Sistema Integral en Riesgos Laborales</h1>
            <p className="text-md mb-4 text-center">
                "Optimiza la gestión integral de seguridad y salud en el trabajo para tu empresa en Colombia con nuestra plataforma especializada. Desde seguimiento de protocolos de seguridad hasta análisis de riesgos, simplificamos el cumplimiento normativo, garantizando un entorno laboral seguro y saludable."<br /><br /> Descubre la tranquilidad de una gestión eficiente con nuestro aplicativo web.
            </p>
            <div className='flex space-x-5 justify-around mt-3'>

                <div className='flex flex-col items-center cursor-pointer'>
                    <AddTaskIcon style={{ fontSize: 70 }} />
                    <p>Gestión a tareas</p>
                </div>

                <div className='flex flex-col items-center cursor-pointer'>
                    <QueryStatsIcon style={{ fontSize: 70 }} />
                    <p>Consultas</p>
                </div>


            </div>
        </div>
    );
};

export default HomePage;
