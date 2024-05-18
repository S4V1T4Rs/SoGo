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

import {
  ActionContainer,
  ContainerButton,
  DeleteButton,
  EditButton,
  NeumorphicButton,
  NeumorphicTableCell,
  NeumorphicTableHeaderCell,
  SelectContainer
} from './Styled';

import { deleteVacancies, getVacancies, updateVacancies } from '../../Controller/VacancieController';
import UserCard from '../Movil/MovilVacante';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedType, setSelectedType] = useState('Vacantes');
  const [pendingChanges, setPendingChanges] = useState({});
  const [columnWidths, setColumnWidths] = useState({});
  const [resizingColumn, setResizingColumn] = useState(null);
  const [startX, setStartX] = useState(0);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getVacancies();
        setUsers(usersData);
        console.log(usersData);
        initializePendingChanges(usersData);
        setServerError(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setServerError(true);
      }
    };

    fetchUsers();
    // // Verificar el estado del servidor cada 5 segundos
    // const intervalId = setInterval(fetchUsers, 5000);

    // return () => clearInterval(intervalId);
  }, []);

  const initializePendingChanges = (usersData) => {
    const initialChanges = {};
    usersData.forEach((user) => {
      initialChanges[user.id] = {
        'Detalles de Vacantes': { ...user['Detalles de Vacantes'] }
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
        ['Detalles de Vacantes']: {
          ...(prevChanges[userId]?.['Detalles de Vacantes'] || users.find((user) => user.id === userId)['Detalles de Vacantes']),
          [field]: newValue
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
    // console.log('User ID:', userId); // Verificar que el userId es correcto
    // if (!userId) {
    //   console.error('Missing user ID.');
    //   return;
    // }
    console.log('User ID:', userId); // Verificar que el userId es correcto
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
        ...changesForUser['Detalles de Vacantes']
      };

      const updatedUserDataFire = {
        ...userToUpdateFire,
        ['Detalles de ' + selectedType]: {
          ...changesForUser['Detalles de ' + selectedType],
          ...changesForUser['Detalles de ' + selectedType]
        }
      };

      console.log('Data to update:', updatedUserData);

      await updateVacancies(userId, updatedUserData, updatedUserDataFire);

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

      const apiResponse = await axios.delete(`http://localhost:8080/api/vacante/${userId}`);
      console.log('Response from API Delete:', apiResponse.data);

      await deleteVacancies(userId);

      const updatedUsers = await getVacancies();
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
          {users[currentIndex] && users[currentIndex]['Detalles de Vacantes'] ? <UserCard user={users[currentIndex]} /> : null}

          <Grid item container justifyContent="center" marginTop={2}>
            <ContainerButton>
              <NeumorphicButton onClick={goToPreviousUser} disabled={currentIndex === 0}>
                Anterior
              </NeumorphicButton>
              <NeumorphicButton onClick={goToNextUser} disabled={currentIndex === users.length - 1}>
                Siguiente
              </NeumorphicButton>
            </ContainerButton>
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
                  <MenuItem value="Vacantes">Vacantes</MenuItem>
                </Select>
              </SelectContainer>
            </Grid>
          </Grid>

          <Grid item xs={12} md={10} sx={{ backgroundColor: 'green', textAlign: 'center', alignContent: 'center' }}>
            <TableContainer component={Grid} item xs={12} justifyContent="center">
              <Table>
                <TableHead>
                  {selectedType === 'Vacantes' && (
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
                        style={{ width: columnWidths['Descripcion'] }}
                        onMouseDown={(e) => handleColumnResizeStart('Descripcion', e.pageX, e.pageY)}
                      >
                        Descripcion
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['TipoTrabajo'] }}
                        onMouseDown={(e) => handleColumnResizeStart('TipoTrabajo', e.pageX, e.pageY)}
                      >
                        Tipo de Trabajo
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
                          {selectedType === 'Vacantes' && (
                            <>
                              <NeumorphicTableCell>{user.id}</NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={
                                    pendingChanges[user.id]?.['Detalles de Vacantes']?.vacancyName ||
                                    user['Detalles de Vacantes'].vacancyName
                                  }
                                  onChange={(e) => handleInputChange(e, 'vacancyName', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={
                                    pendingChanges[user.id]?.['Detalles de Vacantes']?.description ||
                                    user['Detalles de Vacantes'].description
                                  }
                                  onChange={(e) => handleInputChange(e, 'description', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={
                                    pendingChanges[user.id]?.['Detalles de Vacantes']?.workType || user['Detalles de Vacantes'].workType
                                  }
                                  onChange={(e) => handleInputChange(e, 'workType', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              {/* <NeumorphicTableCell>{user['Datos Personales']?.documentType}</NeumorphicTableCell>
                              <NeumorphicTableCell>{user['Datos Personales']?.documentNumber}</NeumorphicTableCell> */}
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
