// UserCard.js
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import TextDinamic from 'components/ButtonDinamic/buttonDinamic';
import PropTypes from 'prop-types'; // Import PropTypes for props validation
// import { deleteUser, updateUser } from './function'; // Import the updateUser function

import { deleteUsuario, updateUsuario } from 'api/Controller/fireController';
import { calculateAge } from 'views/pages/CallPages/FormCall/validaciones';

const UserCard = ({ user }) => {
  const [editing, setEditing] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({ ...user }); // Initialize with current user data

  useEffect(() => {
    setUpdatedUserData({ ...user }); // Update state when user prop changes
  }, [user]);

  const handleEdit = () => {
    setEditing(true);
  };
  const handleDelete = async () => {
    if (!user.id) {
      console.error('User ID is missing.');
      return;
    }

    await deleteUsuario(user.id); // Llama a la función para eliminar al usuario
  };
  const handleSave = async () => {
    // Ensure user ID is defined
    if (!user.id) {
      console.error('User ID is missing.');
      return;
    }

    // Call the updateUser function to save the updated user data
    await updateUsuario(user.id, updatedUserData);
    setEditing(false);
  };

  const handleDateOfBirthChange = (newDateOfBirth) => {
    const age = calculateAge(newDateOfBirth);
    setUpdatedUserData({
      ...updatedUserData,
      'Datos Personales': {
        ...updatedUserData['Datos Personales'],
        'Fecha de Nacimiento': newDateOfBirth,
        Edad: age.toString() // Convert age to string before updating
      }
    });
  };

  return (
    <Card variant="outlined" style={{ marginBottom: '10px', width: '300px' }}>
      <CardContent>
        {editing ? (
          <>
            <TextDinamic
              number={4}
              labels={['Nombre', 'Apellido', 'Fecha de Nacimiento', 'Edad']}
              values={[
                updatedUserData['Datos Personales'].firstName,
                updatedUserData['Datos Personales'].lastName,
                updatedUserData['Datos Personales'].FechaNacimiento,
                updatedUserData['Datos Personales'].Edad,
                updatedUserData['Datos Personales'].documentType
              ]}
              names={['nombre', 'apellido', 'fechaNacimiento', 'edad']}
              types={['text', 'text', 'date', 'number']}
              capitalization="none"
              onChange={(newValues) => {
                if (newValues[2] !== updatedUserData['Datos Personales'].FechaNacimiento) {
                  handleDateOfBirthChange(newValues[2]);
                } else {
                  setUpdatedUserData({
                    ...updatedUserData,
                    'Datos Personales': {
                      ...updatedUserData['Datos Personales'], // Spread the existing fields
                      firstName: newValues[0],
                      lastName: newValues[1],
                      Edad: newValues[3]
                    }
                  });
                }
              }}
            />

            <TextDinamic
              number={4}
              labels={['Empresa', 'Cargo', 'Inicio de Trabajo', 'Salario']}
              values={[
                updatedUserData['Datos Laborales'].Empresa,
                updatedUserData['Datos Laborales'].Cargo,
                updatedUserData['Datos Laborales'].InicioTrabajo,
                updatedUserData['Datos Laborales'].Salario
              ]}
              names={['empresa', 'cargo', 'inicioTrabajo', 'salario']}
              types={['text', 'text', 'date', 'text']}
              capitalization="none"
              onChange={(newValues) => {
                setUpdatedUserData({
                  ...updatedUserData,
                  'Datos Laborales': {
                    ...updatedUserData['Datos Laborales'], // Spread the existing fields
                    Empresa: newValues[0],
                    Cargo: newValues[1],
                    'Inicio de Trabajo': newValues[2],
                    Salario: newValues[3]
                  }
                });
              }}
            />
          </>
        ) : (
          <>
            <Typography variant="h6" component="div" gutterBottom>
              {user['Datos Personales'].firstName} {user['Datos Personales'].lastName}
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Tipo de Documento: {user['Datos Personales'].documentType}
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Número de Documento: {user['Datos Personales'].documentNumber}
            </Typography>
            {/* <Typography variant="body2" component="p" gutterBottom>
              Empresa: {user['Datos Laborales'].Empresa}
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Cargo: {user['Datos Laborales'].Cargo}
            </Typography> */}
          </>
        )}
        {editing ? (
          <Button variant="outlined" color="primary" onClick={handleSave}>
            Guardar
          </Button>
        ) : (
          <>
            <Button variant="outlined" color="primary" onClick={handleEdit} style={{ marginRight: '5px' }}>
              Modificar
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Eliminar
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.any,
    'Datos Personales': PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      documentType: PropTypes.string,
      documentNumber: PropTypes.string,
      FechaNacimiento: PropTypes.string, // Add PropTypes for Fecha de Nacimiento
      Edad: PropTypes.string, // Add PropTypes for Edad
      id: PropTypes.any // Remove isRequired for id
    }),
    'Datos Laborales': PropTypes.shape({
      Empresa: PropTypes.string,
      Cargo: PropTypes.string,
      InicioTrabajo: PropTypes.string,
      Salario: PropTypes.string
    })
  })
};

export default UserCard;
