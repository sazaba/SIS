import React, { useContext, useEffect, useState } from 'react';
import MyContext from '../context/Mycontext';

function ProfilePage() {
    const { nombreDB, perfilDB } = useContext(MyContext);
    const [nombre, setNombre] = useState(nombreDB);

    // useEffect para actualizar el nombre cuando cambie en el contexto
    useEffect(() => {
        setNombre(nombreDB);
    }, []);

    return (
        <div>
            <h1>Bienvenido {nombre} </h1>
            <p>Tu perfil es {perfilDB}</p>
        </div>
    );
}

export default ProfilePage;
