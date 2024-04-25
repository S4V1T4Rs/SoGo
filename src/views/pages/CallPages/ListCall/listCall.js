import React, { useEffect, useState } from 'react';
import {
  Grid,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  CardContent,
  Card,
  Typography
} from '@mui/material';
import { Delete, Edit, Save } from '@mui/icons-material';

import axios from 'axios';

import UserCard from './userCard';
import { deleteUsuario, getUsuarios, updateUsuario } from 'api/Controller/fireController';
import {
  ActionContainer,
  DeleteButton,
  EditButton,
  NeumorphicButton,
  NeumorphicTableCell,
  NeumorphicTableHeaderCell,
  SelectContainer
} from './styled-listcall';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedType, setSelectedType] = useState('Personales');
  const [pendingChanges, setPendingChanges] = useState({});
  const [columnWidths, setColumnWidths] = useState({});
  const [resizingColumn, setResizingColumn] = useState(null);
  const [startX, setStartX] = useState(0);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsuarios();
        setUsers(usersData);
        initializePendingChanges(usersData);
        setServerError(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setServerError(true);
      }
    };

    fetchUsers();
    // Verificar el estado del servidor cada 5 segundos
    const intervalId = setInterval(fetchUsers, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const initializePendingChanges = (usersData) => {
    const initialChanges = {};
    usersData.forEach((user) => {
      initialChanges[user.id] = {
        'Datos Personales': { ...user['Datos Personales'] },
        'Datos Laborales': { ...user['Datos Laborales'] }
      };
    });
    setPendingChanges(initialChanges);
  };

  const handleInputChange = (e, field, userId) => {
    const newValue = e.target.value;

    setPendingChanges((prevChanges) => ({
      ...prevChanges,
      [userId]: {
        ...prevChanges[userId],
        ['Datos Personales']: {
          ...(prevChanges[userId]?.['Datos Personales'] || users.find((user) => user.id === userId)['Datos Personales']),
          [field]: newValue
        },
        ['Datos Laborales']: {
          ...(prevChanges[userId]?.['Datos Laborales'] || users.find((user) => user.id === userId)['Datos Laborales']),
          [field]: newValue
          // Include laboral data fields here if you also need to edit them
        }
      }
    }));
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleEditButtonClick = (index) => {
    setCurrentIndex(index);
  };

  const handleSaveButtonClick = async (userId) => {
    if (!userId) {
      console.error('Missing user ID.');
      return;
    }

    try {
      const userToUpdateFire = users.find((user) => user.id === userId);
      const userToUpdateApi = users.findIndex((user) => user.id === userId);
      if (!userToUpdateFire) {
        console.error('User not found.');
        return;
      }

      const changesForUser = pendingChanges[userId];

      const updatedUserData = {
        ...userToUpdateApi,
        ...changesForUser['Datos Laborales'],
        ...changesForUser['Datos Personales']
      };

      const updatedUserDataFire = {
        ...userToUpdateFire,
        ['Datos ' + selectedType]: {
          ...changesForUser['Datos ' + selectedType],
          ...changesForUser['Datos ' + selectedType]
        }
      };

      console.log('Data to update:', updatedUserData);

      await updateUsuario(userId, updatedUserData, updatedUserDataFire);

      const updatedUsers = users.map((user) => {
        if (user.id === userId) {
          return { ...updatedUserData, ...updatedUserDataFire };
        }
        return user;
      });

      setUsers(updatedUsers);

      setCurrentIndex(0);
    } catch (error) {
      console.error('Error handling save button click:', error);
    }
  };

  const handleDeleteButtonClick = async (userId) => {
    try {
      if (!userId) {
        console.error('User ID is missing.');
        return;
      }

      const apiResponse = await axios.delete(`http://localhost:8080/api/call/${userId}`);
      console.log('Response from API Delete:', apiResponse.data);

      await deleteUsuario(userId);

      const updatedUsers = await getUsuarios();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const goToPreviousUser = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : users.length - 1));
  };

  const goToNextUser = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
  };

  const handleColumnResizeStart = (columnName, startX) => {
    setResizingColumn(columnName);
    setStartX(startX);
  };

  const handleColumnResize = (event) => {
    if (!resizingColumn) return;

    const newWidth = event.pageX - startX;
    setColumnWidths((prevWidths) => ({
      ...prevWidths,
      [resizingColumn]: newWidth >= 80 ? newWidth : 80 // Minimum width to prevent collapsing
    }));
  };

  const handleColumnResizeStop = () => {
    setResizingColumn(null);
  };

  return (
    <Grid container justifyContent="center">
      {useMediaQuery('(max-width:600px)') ? (
        <>
          {users[currentIndex] && users[currentIndex]['Datos Personales'] ? <UserCard user={users[currentIndex]} /> : null}

          <Grid item container justifyContent="center" marginTop={2}>
            <NeumorphicButton onClick={goToPreviousUser} disabled={currentIndex === 0}>
              Anterior
            </NeumorphicButton>
            <NeumorphicButton onClick={goToNextUser} disabled={currentIndex === users.length - 1}>
              Siguiente
            </NeumorphicButton>
          </Grid>
          <Grid item container justifyContent="center" marginTop={2}>
            <p>Cantidad de registros: {users.length}</p>
          </Grid>
        </>
      ) : (
        <>
          <Grid
            container
            xs={12}
            md={10}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center', // Espacio entre los elementos
              padding: '10px' // Añade un poco de espacio alrededor de los elementos
            }}
          >
            <Grid item xs={11} sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '30px' }}>Lista de Candidatos</Typography>
            </Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
              <SelectContainer>
                <Select value={selectedType} onChange={handleTypeChange}>
                  <MenuItem value="Personales">Personal</MenuItem>
                  <MenuItem value="Laborales">Laboral</MenuItem>
                </Select>
              </SelectContainer>
            </Grid>
          </Grid>

          <Grid item xs={12} md={10} sx={{ backgroundColor: 'green', textAlign: 'center', alignContent: 'center' }}>
            <TableContainer component={Grid} item xs={12} justifyContent="center">
              <Table>
                <TableHead>
                  {selectedType === 'Personales' && (
                    <TableRow>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['id'] }}
                        onMouseDown={(e) => handleColumnResizeStart('id', e.pageX, e.pageY)}
                      >
                        ID
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['Nombre'] }}
                        onMouseDown={(e) => handleColumnResizeStart('Nombre', e.pageX, e.pageY)}
                      >
                        Nombre
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['Apellido'] }}
                        onMouseDown={(e) => handleColumnResizeStart('Apellido', e.pageX, e.pageY)}
                      >
                        Apellido
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['Edad'] }}
                        onMouseDown={(e) => handleColumnResizeStart('Edad', e.pageX, e.pageY)}
                      >
                        Edad
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['TipoDocumento'] }}
                        onMouseDown={(e) => handleColumnResizeStart('TipoDocumento', e.pageX, e.pageY)}
                      >
                        Tipo de Documento
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['NumeroDocumento'] }}
                        onMouseDown={(e) => handleColumnResizeStart('NumeroDocumento', e.pageX, e.pageY)}
                      >
                        Número de Documento
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['Acciones'] }}
                        onMouseDown={(e) => handleColumnResizeStart('Acciones', e.pageX, e.pageY)}
                      >
                        Acciones
                      </NeumorphicTableHeaderCell>
                    </TableRow>
                  )}
                  {selectedType === 'Laborales' && (
                    <TableRow>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['id'] }}
                        onMouseDown={(e) => handleColumnResizeStart('id', e.pageX, e.pageY)}
                      >
                        ID
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['Cargo'] }}
                        onMouseDown={(e) => handleColumnResizeStart('Cargo', e.pageX, e.pageY)}
                      >
                        Cargo
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['Empresa'] }}
                        onMouseDown={(e) => handleColumnResizeStart('Empresa', e.pageX, e.pageY)}
                      >
                        Empresa
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['InicioTrabajo'] }}
                        onMouseDown={(e) => handleColumnResizeStart('InicioTrabajo', e.pageX, e.pageY)}
                      >
                        Inicio de Trabajo
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['Salario'] }}
                        onMouseDown={(e) => handleColumnResizeStart('Salario', e.pageX, e.pageY)}
                      >
                        Salario
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['Acciones'] }}
                        onMouseDown={(e) => handleColumnResizeStart('Acciones', e.pageX, e.pageY)}
                      >
                        Acciones
                      </NeumorphicTableHeaderCell>
                    </TableRow>
                  )}
                </TableHead>
                <TableBody onMouseMove={handleColumnResize} onMouseUp={handleColumnResizeStop}>
                  {serverError ? (
                    <TableRow>
                      <NeumorphicTableCell colSpan={12}>
                        <Card variant="outlined" style={{ margin: 'auto', maxWidth: 400 }}>
                          <CardContent style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                            <p style={{ textAlign: 'center', color: 'red', fontSize: '20px' }}>El servidor se encuentra apagado</p>
                          </CardContent>
                        </Card>
                      </NeumorphicTableCell>
                    </TableRow>
                  ) : (
                    <>
                      {users.map((user, index) => (
                        <TableRow key={index}>
                          {selectedType === 'Personales' && (
                            <>
                              <NeumorphicTableCell>{user.id}</NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.['Datos Personales']?.Nombre || user['Datos Personales'].Nombre}
                                  onChange={(e) => handleInputChange(e, 'Nombre', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.['Datos Personales']?.Apellido || user['Datos Personales'].Apellido}
                                  onChange={(e) => handleInputChange(e, 'Apellido', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.['Datos Personales']?.Edad || user['Datos Personales'].Edad}
                                  onChange={(e) => handleInputChange(e, 'Edad', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>{user['Datos Personales']?.TipoDocumento}</NeumorphicTableCell>
                              <NeumorphicTableCell>{user['Datos Personales']?.NumeroDocumento}</NeumorphicTableCell>
                            </>
                          )}
                          {selectedType === 'Laborales' && (
                            <>
                              <NeumorphicTableCell>{user.id}</NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.['Datos Laborales']?.Cargo || user['Datos Laborales'].Cargo}
                                  onChange={(e) => handleInputChange(e, 'Cargo', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.['Datos Laborales']?.Empresa || user['Datos Laborales'].Empresa}
                                  onChange={(e) => handleInputChange(e, 'Empresa', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={
                                    pendingChanges[user.id]?.['Datos Laborales']?.InicioTrabajo || user['Datos Laborales'].InicioTrabajo
                                  }
                                  onChange={(e) => handleInputChange(e, 'InicioTrabajo', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.['Datos Laborales']?.Salario || user['Datos Laborales'].Salario}
                                  onChange={(e) => handleInputChange(e, 'Salario', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                            </>
                          )}
                          <NeumorphicTableCell>
                            <ActionContainer>
                              {currentIndex !== user.id ? (
                                <EditButton onClick={() => handleEditButtonClick(user.id)}>
                                  <Edit style={{ color: '#d17308' }} />
                                </EditButton>
                              ) : (
                                <NeumorphicButton onClick={() => handleSaveButtonClick(user.id)}>
                                  <Save />
                                </NeumorphicButton>
                              )}
                              <DeleteButton onClick={() => handleDeleteButtonClick(user.id)}>
                                <Delete style={{ color: '#a84343' }} />
                              </DeleteButton>
                            </ActionContainer>
                          </NeumorphicTableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default UserTable;
