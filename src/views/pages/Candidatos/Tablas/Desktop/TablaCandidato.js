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
  SelectContainer,
  StyledOption,
  StyledSelect
} from './Styled';

import { candidatesRef, deleteCandidate, getCandidates, updateCandidate } from '../../Controller/CandidateController';
import UserCard from '../Mobil/MovilCandidato';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedType, setSelectedType] = useState('Personales');
  const [pendingChanges, setPendingChanges] = useState({});
  const [columnWidths, setColumnWidths] = useState({});
  const [resizingColumn, setResizingColumn] = useState(null);
  const [startX, setStartX] = useState(0);
  const [serverError, setServerError] = useState(false);
  const [vacancies, setVacancies] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/vacante');
        setVacancies(response.data);
      } catch (error) {
        console.error('Error fetching vacancies:', error);
      }
    };

    fetchVacancies();
  }, []);
  useEffect(() => {
    const fetchRol = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/rol');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching vacancies:', error);
      }
    };

    fetchRol();
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getCandidates();
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
        'Datos Personales': { ...user['Datos Personales'] },
        'Datos Laborales': { ...user['Datos Laborales'] },
        ' Cuenta ': { ...user[' Cuenta '] },
        ' Estado ': { ...user[' Estado '] }
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
        },
        [' Cuenta ']: {
          ...(prevChanges[userId]?.[' Cuenta '] || users.find((user) => user.id === userId)[' Cuenta ']),
          [field]: newValue
        },
        [' Estado ']: {
          ...(prevChanges[userId]?.[' Estado '] || users.find((user) => user.id === userId)[' Estado ']),
          [field]: newValue
        }
      }
    }));

    if (['selectVacancies', 'selectionStatus', 'selectRol'].includes(field)) {
      const estado = pendingChanges[userId]?.[' Estado '] || users.find((user) => user.id === userId)[' Estado '];
      if (estado) {
        const vacancyName = field === 'selectVacancies' ? newValue : estado.selectVacancies;
        const selectionStatus = field === 'selectionStatus' ? newValue : estado.selectionStatus;
        const rolName = field === 'selectRol' ? newValue : estado.selectRol;
        saveSelection(userId, vacancyName, selectionStatus, rolName);
      }
    }
  };

  const saveSelection = async (userId, vacancyName, selectionStatus, rolName) => {
    try {
      // Actualizar estado de selección en la API
      const apiResponse = await axios.put(`http://localhost:8080/api/candidato/${userId}`, {
        selectVacancies: vacancyName,
        selectionStatus: selectionStatus,
        selectRol: rolName
      });
      console.log('Selection status updated in API:', apiResponse.data);

      // Actualizar estado de selección en Firestore en la sección 'Cuenta'
      const candidateDocRef = doc(candidatesRef, userId);
      console.log('Document reference in Firestore:', candidateDocRef.path);
      const updatedDocSnapshot = await getDoc(candidateDocRef);
      if (updatedDocSnapshot.exists()) {
        console.log('Document data in Firestore before update:', updatedDocSnapshot.data());

        // Verificar que los valores no sean undefined antes de actualizar
        const newData = {
          ' Estado ': {
            ...updatedDocSnapshot.data()[' Estado '],
            ...(vacancyName !== undefined && { selectVacancies: vacancyName }),
            ...(selectionStatus !== undefined && { selectionStatus: selectionStatus }),
            ...(rolName !== undefined && { selectRol: rolName })
          }
        };
        await updateDoc(candidateDocRef, newData);
        console.log('Selection status updated in Firestore in the "Cuenta" section:', vacancyName);
      } else {
        console.log('Document does not exist in Firestore');
      }
    } catch (error) {
      console.error('Error updating selection status:', error);
      throw error;
    }
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
        ...changesForUser['Datos Personales'],
        ...changesForUser[' Cuenta '],
        ...changesForUser[' Estado ']
      };

      const updatedUserDataFire = {
        ...userToUpdateFire,
        ['Datos ' + selectedType]: {
          ...changesForUser['Datos ' + selectedType],
          ...changesForUser['Datos ' + selectedType]
        }
      };

      console.log('Data to update:', updatedUserData);

      await updateCandidate(userId, updatedUserData, updatedUserDataFire);

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

      const apiResponse = await axios.delete(`http://localhost:8080/api/candidato/${userId}`);
      console.log('Response from API Delete:', apiResponse.data);

      await deleteCandidate(userId);

      const updatedUsers = await getCandidates();
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
                  <MenuItem value="Personales">Personal</MenuItem>
                  <MenuItem value="Laborales">Laboral</MenuItem>
                  <MenuItem value="Cuenta">Cuenta</MenuItem>
                  <MenuItem value="Estado">Estado</MenuItem>
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
                        style={{ width: columnWidths['salaryExpectation'] }}
                        onMouseDown={(e) => handleColumnResizeStart('salaryExpectation', e.pageX, e.pageY)}
                      >
                        Expectativa de Salario
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['experience'] }}
                        onMouseDown={(e) => handleColumnResizeStart('experience', e.pageX, e.pageY)}
                      >
                        Experiencia
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['position'] }}
                        onMouseDown={(e) => handleColumnResizeStart('position', e.pageX, e.pageY)}
                      >
                        Puesto
                      </NeumorphicTableHeaderCell>

                      {/* <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['Salario'] }}
                        onMouseDown={(e) => handleColumnResizeStart('Salario', e.pageX, e.pageY)}
                      >
                        Salario
                      </NeumorphicTableHeaderCell> */}

                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['Acciones'] }}
                        onMouseDown={(e) => handleColumnResizeStart('Acciones', e.pageX, e.pageY)}
                      >
                        Acciones
                      </NeumorphicTableHeaderCell>
                    </TableRow>
                  )}

                  {selectedType === 'Cuenta' && (
                    <TableRow>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['id'] }}
                        onMouseDown={(e) => handleColumnResizeStart('id', e.pageX, e.pageY)}
                      >
                        ID
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['email'] }}
                        onMouseDown={(e) => handleColumnResizeStart('email', e.pageX, e.pageY)}
                      >
                        Email
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['password'] }}
                        onMouseDown={(e) => handleColumnResizeStart('password', e.pageX, e.pageY)}
                      >
                        Password
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['Acciones'] }}
                        onMouseDown={(e) => handleColumnResizeStart('Acciones', e.pageX, e.pageY)}
                      >
                        Acciones
                      </NeumorphicTableHeaderCell>
                    </TableRow>
                  )}

                  {selectedType === 'Estado' && (
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
                        style={{ width: columnWidths['NumeroDocumento'] }}
                        onMouseDown={(e) => handleColumnResizeStart('NumeroDocumento', e.pageX, e.pageY)}
                      >
                        Número de Documento
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['NombreVacante'] }}
                        onMouseDown={(e) => handleColumnResizeStart('NombreVacante', e.pageX, e.pageY)}
                      >
                        Nombre Vacante
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['EstadoVacante'] }}
                        onMouseDown={(e) => handleColumnResizeStart('EstadoVacante', e.pageX, e.pageY)}
                      >
                        Estado Vacante
                      </NeumorphicTableHeaderCell>
                      <NeumorphicTableHeaderCell
                        style={{ width: columnWidths['EstadoRol'] }}
                        onMouseDown={(e) => handleColumnResizeStart('EstadoRol', e.pageX, e.pageY)}
                      >
                        Estado Rol
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
                                  value={pendingChanges[user.id]?.['Datos Personales']?.firstName || user['Datos Personales'].firstName}
                                  onChange={(e) => handleInputChange(e, 'firstName', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.['Datos Personales']?.lastName || user['Datos Personales'].lastName}
                                  onChange={(e) => handleInputChange(e, 'lastName', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.['Datos Personales']?.ages || user['Datos Personales'].ages}
                                  onChange={(e) => handleInputChange(e, 'ages', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>{user['Datos Personales']?.documentType}</NeumorphicTableCell>
                              <NeumorphicTableCell>{user['Datos Personales']?.documentNumber}</NeumorphicTableCell>
                            </>
                          )}

                          {selectedType === 'Laborales' && (
                            <>
                              <NeumorphicTableCell>{user.id}</NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={
                                    pendingChanges[user.id]?.['Datos Laborales']?.salaryExpectation ||
                                    user['Datos Laborales'].salaryExpectation
                                  }
                                  onChange={(e) => handleInputChange(e, 'salaryExpectation', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.['Datos Laborales']?.experience || user['Datos Laborales'].experience}
                                  onChange={(e) => handleInputChange(e, 'experience', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.['Datos Laborales']?.position || user['Datos Laborales'].position}
                                  onChange={(e) => handleInputChange(e, 'position', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>

                              {/* <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.['Datos Laborales']?.Salario || user['Datos Laborales'].Salario}
                                  onChange={(e) => handleInputChange(e, 'Salario', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell> */}
                            </>
                          )}

                          {selectedType === 'Cuenta' && (
                            <>
                              <NeumorphicTableCell>{user.id}</NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.[' Cuenta ']?.email || user[' Cuenta '].email}
                                  onChange={(e) => handleInputChange(e, 'email', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  type="password"
                                  value={pendingChanges[user.id]?.[' Cuenta ']?.password || user[' Cuenta '].password}
                                  onChange={(e) => handleInputChange(e, 'password', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                            </>
                          )}

                          {selectedType === 'Estado' && (
                            <>
                              <NeumorphicTableCell>{user.id}</NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.['Datos Personales']?.firstName || user['Datos Personales'].firstName}
                                  onChange={(e) => handleInputChange(e, 'firstName', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <TextField
                                  value={pendingChanges[user.id]?.['Datos Personales']?.lastName || user['Datos Personales'].lastName}
                                  onChange={(e) => handleInputChange(e, 'lastName', user.id)}
                                  disabled={currentIndex !== user.id}
                                />
                              </NeumorphicTableCell>

                              <NeumorphicTableCell>{user['Datos Personales']?.documentNumber}</NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <StyledSelect
                                  value={pendingChanges[user.id]?.[' Estado ']?.selectVacancies || user[' Estado '].selectVacancies}
                                  onChange={(e) => handleInputChange(e, 'selectVacancies', user.id)}
                                >
                                  <StyledOption value="">Seleccione una vacante</StyledOption>
                                  {vacancies.map((vacancy) => (
                                    <StyledOption key={vacancy.id} value={vacancy['Detalles de Vacantes']?.vacancyName}>
                                      {vacancy.vacancyName}
                                    </StyledOption>
                                  ))}
                                </StyledSelect>
                              </NeumorphicTableCell>
                              <NeumorphicTableCell>
                                <StyledSelect
                                  value={pendingChanges[user.id]?.[' Estado ']?.selectionStatus || user[' Estado '].selectionStatus}
                                  onChange={(e) => handleInputChange(e, 'selectionStatus', user.id)}
                                >
                                  <StyledOption value="">Seleccione un estado</StyledOption>
                                  <StyledOption value="nuevo">Nuevo</StyledOption>
                                  <StyledOption value="aceptado">Aceptado</StyledOption>
                                  <StyledOption value="entrevistado">Entrevistado</StyledOption>
                                  <StyledOption value="seleccionado">Seleccionado</StyledOption>
                                  <StyledOption value="descartado">Descartado</StyledOption>
                                </StyledSelect>
                              </NeumorphicTableCell>

                              {/* <NeumorphicTableCell>
                                <StyledSelect
                                  value={pendingChanges[user.id]?.[' Estado ']?.selectRol || user[' Estado '].selectRol}
                                  onChange={(e) => handleInputChange(e, 'selectRol', user.id)}
                                >
                                  <StyledOption value="">Seleccione una roles</StyledOption>
                                  {roles.map((rol) => (
                                    <StyledOption key={rol.id} value={rol['Detalles de Roles']?.rolName}>
                                      {rol.rolName}
                                    </StyledOption>
                                  ))}
                                </StyledSelect>
                              </NeumorphicTableCell> */}
                              <NeumorphicTableCell>
                                <Select
                                  value={pendingChanges[user.id]?.[' Estado ']?.selectRol || user[' Estado '].selectRol}
                                  onChange={(e) => handleInputChange(e, 'selectRol', user.id)}
                                >
                                  <MenuItem value="ssss">Seleccione una roles</MenuItem>
                                  {roles.map((role) => (
                                    <MenuItem key={role.rolName} value={role.rolName}>
                                      {role.rolName}
                                    </MenuItem>
                                  ))}
                                </Select>
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
