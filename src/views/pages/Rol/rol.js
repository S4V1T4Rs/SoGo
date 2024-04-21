import React, { useState, useEffect } from 'react';
import BinaryTree from 'components/ArbolGeneologico/tree';
import admin from 'components/ArbolGeneologico/img/admin1.png';
import rrhh from 'components/ArbolGeneologico/img/human-resources.png';

const Trees = () => {
  const [selectedRole, setSelectedRole] = useState('Dueña'); // Establecer 'Dueña' como valor inicial

  const rolesData = [
    {
      name: 'Dueña',
      image: 'images/1.jpg',
      description: 'Este rol tiene el control total sobre el sistema.',
      children: [
        {
          name: 'Administrador',
          image: admin,
          description: 'Este rol tiene permisos administrativos sobre el sistema.',
          children: [
            {
              name: 'Tú (Ejemplo)',
              image: 'images/tu.jpg',
              description: 'Esta es tu descripción.'
            },
            {
              name: 'Otro Rol (Ejemplo)',
              image: 'images/otro.jpg',
              description: 'Esta es la descripción de otro rol.'
            }
          ]
        },
        {
          name: 'RR.HH.',
          image: rrhh,
          description: 'Este rol maneja los recursos humanos de la empresa.',
          children: [
            {
              name: 'Analista de RR.HH.',
              image: 'images/analista.jpg',
              description: 'Descripción del analista de RR.HH.'
            },
            {
              name: 'Asistente de RR.HH.',
              image: 'images/asistente.jpg',
              description: 'Descripción del asistente de RR.HH.'
            }
          ]
        }
      ]
    },
    {
      name: 'Administrador',
      image: 'images/2.jpg',
      description: 'Este rol tiene permisos administrativos sobre el sistema.',
      children: [
        {
          name: 'Empleado 1',
          image: 'images/tu.jpg',
          description: 'Descripción del Empleado 1.',
          children: [{ name: 'Tú', image: 'images/tu.jpg', description: 'Esta es tu descripción.' }]
        },
        {
          name: 'Empleado 2',
          image: 'images/otro.jpg',
          description: 'Descripción del Empleado 2.',
          children: [{ name: 'Tú', image: 'images/tu.jpg', description: 'Esta es tu descripción.' }]
        }
      ]
    }
  ];

  useEffect(() => {
    // Aquí puedes agregar cualquier efecto adicional que desees realizar cuando cambie el rol seleccionado.
  }, [selectedRole]);

  const handleRoleClick = (roleName) => {
    setSelectedRole(roleName);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => handleRoleClick('Dueña')}
          style={{
            padding: '10px 20px',
            borderRadius: '20px',
            border: 'none',
            background: selectedRole === 'Dueña' ? '#ccc' : '#fff', // Cambiar color de fondo si es el rol seleccionado
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            marginRight: '10px'
          }}
        >
          Dueña
        </button>
        <button
          onClick={() => handleRoleClick('Administrador')}
          style={{
            padding: '10px 20px',
            borderRadius: '20px',
            border: 'none',
            background: selectedRole === 'Administrador' ? '#ccc' : '#fff', // Cambiar color de fondo si es el rol seleccionado
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
          }}
        >
          Administrador
        </button>
        {/* Agrega más botones para otros roles si es necesario */}
      </div>
      {selectedRole && (
        <div>
          <h2 style={{ textAlign: 'center' }}>Ramas para {selectedRole}</h2>
          <BinaryTree data={rolesData.find((role) => role.name === selectedRole).children} />
        </div>
      )}
    </div>
  );
};

export default Trees;
