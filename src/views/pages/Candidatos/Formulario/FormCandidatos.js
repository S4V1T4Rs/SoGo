import React, { useEffect, useState } from 'react';
import { Title } from 'components/titulo';
import axios from 'axios';
import TextDinamic from 'components/ButtonDinamic/buttonDinamic';
// import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
// import { db } from 'api/config/configfire';
import { Avatar, Grid, useMediaQuery } from '@mui/material';
import user from 'assets/images/icons/man.png';
import table from 'assets/images/icons/table.png';
import ButtonSave from 'components/ButtonSave/ButtonSave';
import { FormContent, Labels, MessageCard, TabContainer, Tabs } from 'Style/Tab/styled';

// import axios from 'axios';

import { Conecction } from 'components/ButtonDB/ButtonConection';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from 'api/config/configfire';
import { calculateAge } from '../../CallPages/FormCall/validaciones';
import {
  labelsCuenta,
  labelsLaboral,
  labelsPersonal,
  namesCuenta,
  namesLaboral,
  namesPersonal,
  typesCuenta,
  typesLaboral,
  typesPersonal
} from '../../Candidatos/Values/variables';
import { isPersonalFormFilled, isLaboralFormFilled, isCuentaFormFilled } from '../../CallPages/FormCall/validarTabs';
import { createCandidates } from '../Controller/CandidateController';
import UserTable from '../Tablas/Desktop/TablaCandidato';
import { StyleSheetManager } from 'styled-components';
// import { isDniInUse } from 'api/Controller/validaciones';

const TaxData = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [personalFormValues, setPersonalFormValues] = useState({});
  const [laboralFormValues, setLaboralFormValues] = useState({});
  const [cuentaFormValues, setCuentaFormValues] = useState({});
  //const [age] = useState('');
  // const [isLocalDatabaseActive, setLocalDatabaseActive] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  //   const [isAllFieldsFilled, setIsAllFieldsFilled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLocalDatabaseActive, setLocalDatabaseActive] = useState(false);
  // const [connectionButtonClicked] = useState(false);
  const [serverActive, setServerActive] = useState(false);
  useEffect(() => {
    // Función para verificar el estado del servidor
    const checkServerStatus = async () => {
      try {
        // Realiza una petición al servidor para verificar si está activo
        const response = await axios.get('http://localhost:8080/api/candidato');
        if (response.status === 200) {
          // Si el servidor responde correctamente, lo marcamos como activo
          setServerActive(true);
          setMessage(''); // Limpiamos el mensaje
          setMessageType('');
        }
      } catch (error) {
        // Si hay un error o el servidor no está activo, lo marcamos como inactivo y mostramos el mensaje
        setServerActive(false);
        setMessage('El servidor está apagado');
        setMessageType('error');
      }
    };

    // Llamamos a la función para verificar el estado del servidor cada 10 segundos
    const intervalId = setInterval(checkServerStatus, 3000);

    // Limpia el intervalo cuando el componente se desmonta o actualiza
    return () => clearInterval(intervalId);
  }, [serverActive]);

  useEffect(() => {
    // Verificar si todos los campos están llenos
    if (
      isPersonalFormFilled(personalFormValues, ['0', '1', '2', '3', '4', '5', '6']) &&
      isLaboralFormFilled(laboralFormValues, ['0', '1', '2']) &&
      isCuentaFormFilled(cuentaFormValues, ['0', '1'])
    ) {
      // Si todos los campos están llenos, limpiar el mensaje
      setMessage('');
      setMessageType('');
      setAllFieldsFilled(true);
    } else {
      setAllFieldsFilled(false);
    }
  }, [personalFormValues, laboralFormValues, cuentaFormValues]);

  useEffect(() => {
    const onlineHandler = () => {
      setIsOnline(true);
      // syncDataWithFirebase();
    };

    const offlineHandler = () => {
      setIsOnline(false);
    };

    const handleOnline = onlineHandler;
    const handleOffline = offlineHandler;

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);
  useEffect(() => {
    if (isOnline) {
      setMessage('');
      setMessageType('');
    }
  }, [isOnline]);
  useEffect(() => {
    // Mostrar el mensaje solo si no se ha hecho clic en el botón de conexión y el mensaje es verdadero
    if (!isLocalDatabaseActive && !message && !isOnline) {
      setMessage('¡Debes activar la base de datos local para guardar los datos sin conexión!');
      setMessageType('error');
    }
  }, [isLocalDatabaseActive, message, isOnline]);
  // const syncDataWithFirebase = async () => {
  //   try {
  //     setSyncing(true);
  //     // Obtén los datos de tu API
  //     const response = await axios.get('http://localhost:8080/api/data');
  //     const apiData = response.data;

  //     // Guarda los datos en Firebase uno por uno
  //     for (const data of apiData) {
  //       await createUsuario(data);
  //     }

  //     setSyncing(false);
  //   } catch (error) {
  //     console.error('Error al sincronizar datos con Firebase:', error);
  //     setSyncing(false);
  //   }
  // };

  // useEffect(() => {
  //   // Mostrar el mensaje solo si no se ha hecho clic en el botón de conexión y showMessage es verdadero
  //   if (!connectionButtonClicked || message) {
  //     setMessage('¡Debes activar la base de datos local para guardar los datos sin conexión!');
  //     setMessageType('error');
  //   }
  // }, [connectionButtonClicked, message]);

  //FormCaDos.js
  const handleSubmit = async () => {
    try {
      // Referencia a la colección 'usuarios'
      const candidatoRef = collection(db, 'Candidato');
      // Comprobación de valores personalFormValues y laboralFormValues
      if (!personalFormValues || !laboralFormValues) {
        console.error('Los valores personalFormValues o laboralFormValues son undefined.');
        return;
      }

      const age = calculateAge(personalFormValues['4']);
      const personalData = {
        firstName: personalFormValues['0'] || '',
        lastName: personalFormValues['1'] || '',
        documentType: personalFormValues['2'] || '',
        documentNumber: personalFormValues['3'] || '',
        birthDate: personalFormValues['4'] || '',
        gender: personalFormValues['5'] || '',
        phone: personalFormValues['6'] || '',
        ages: age.toString()
      };
      const laboralData = {
        salaryExpectation: laboralFormValues['0'] || '',
        experience: laboralFormValues['1'] || '',
        position: laboralFormValues['2'] || ''
        // cv: laboralFormValues['3'] || '',
        // photo: laboralFormValues['3'] || ''
      };

      const cuentaData = {
        email: cuentaFormValues['0'] || '',
        password: cuentaFormValues['1'] || ''
      };

      // Si hay conexión a internet, guardar los datos en Firestore y en tu API
      if (isOnline) {
        await createCandidates(
          { ...personalData, ...laboralData, ...cuentaData },
          setPersonalFormValues,
          setLaboralFormValues,
          setCuentaFormValues,
          setMessage,
          setMessageType,
          allFieldsFilled
        );
      } else {
        // Verificar si el DNI ya está en uso
        // Si no hay conexión a internet, guardar los datos solo en tu API
        const apiResponse = await axios.post('http://localhost:8080/api/candidato', {
          ...personalData,
          ...laboralData,
          ...cuentaData
        });

        // Manejar la respuesta de la API según sea necesario
        console.log('Respuesta de la API:', apiResponse.data);
        setMessage('Datos guardados correctamente en tu API');
        setMessageType('success');
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 8000);
        setPersonalFormValues({});
        setLaboralFormValues({});
        const apiData = apiResponse.data;
        // Si no hay conexión a Internet, mostrar mensaje y limpiar campos

        // Obtener el ID generado por la API
        const nextId = apiData.id;
        // Guardar el documento en Firestore
        await setDoc(doc(candidatoRef, nextId.toString()), {
          id: nextId.toString(),
          'Datos Personales': personalData,
          'Datos Laborales': laboralData,
          ' Cuenta ': cuentaData
        });
      }

      // // Guardar el documento en Firestore
      // await setDoc(doc(usuariosRef, nextId.toString()), {
      //   id: nextId.toString(),
      //   'Datos Personales': personalData,
      //   'Datos Laborales': laboralData
      // });

      // // Mostrar mensaje adicional cuando se guarda en Firestore además de la API
      // setMessage('Datos guardados correctamente en Firestore además de la API');
      // setMessageType('success');

      // setTimeout(() => {
      //   setMessage('');
      //   setMessageType('');
      // }, 8000);
      // setPersonalFormValues({});
      // setLaboralFormValues({});
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      if (error.response && error.response.data && error.response.data.error) {
        // Si la respuesta contiene un mensaje de error, mostrarlo al usuario
        setMessage(error.response.data.error);
        setMessageType('error');
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 20000);
      }
      setPersonalFormValues((prevValues) => ({
        ...prevValues,
        3: '' // Limpiar el valor del campo del número de documento
      }));
      // Manejar el error según sea necesario
    }
  };
  const isMobile = useMediaQuery('(min-width:0px) and (max-width:1536px)');
  return (
    <>
      <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid item xs={12} md={11} xl={1}>
          <StyleSheetManager shouldForwardProp={(prop) => prop !== 'tamaño'}>
            <TabContainer mobile={isMobile} tamaño={'87%'}>
              {isMobile && ( // Oculta los Tabs en modo móvil
                <>
                  <Tabs $active={activeTab === 'defecto'} onClick={() => setActiveTab('defecto')}>
                    <Avatar src={user} sx={{ marginBottom: '10px' }} />
                    <Labels>defecto</Labels>
                  </Tabs>
                </>
              )}
              <Tabs
                $active={activeTab === 'personal'}
                onClick={() => setActiveTab('personal')}
                style={{
                  backgroundColor: isPersonalFormFilled(personalFormValues, ['0', '1', '2', '3', '4', '5', '6', '7'])
                    ? '#d1ead1'
                    : 'initial'
                }}
              >
                <Avatar src={user} sx={{ marginBottom: '10px' }} />
                <Labels>Personal</Labels>
              </Tabs>
              <Tabs
                $active={activeTab === 'laboral'}
                onClick={() => setActiveTab('laboral')}
                style={{ backgroundColor: isLaboralFormFilled(laboralFormValues, ['0', '1', '2']) ? '#d1ead1' : 'initial' }}
              >
                <Avatar src={user} sx={{ marginBottom: '10px' }} />
                <Labels>Laboral</Labels>
              </Tabs>
              <Tabs
                $active={activeTab === 'crearcuenta'}
                onClick={() => setActiveTab('crearcuenta')}
                style={{ backgroundColor: isCuentaFormFilled(cuentaFormValues, ['0', '1']) ? '#d1ead1' : 'initial' }}
              >
                <Avatar src={user} sx={{ marginBottom: '10px' }} />
                <Labels>Crear Cuenta</Labels>
              </Tabs>
              <Tabs $active={activeTab === 'table'} onClick={() => setActiveTab('table')}>
                <Avatar src={table} sx={{ marginBottom: '10px' }} />
                <Labels>Tabla</Labels>
              </Tabs>
            </TabContainer>
          </StyleSheetManager>
          {useMediaQuery('(max-width:600px)') && (
            <Grid item xs={12} md={2}>
              {' '}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0px' }}>
                {message && <MessageCard type={messageType}>{message}</MessageCard>}
              </Grid>
            </Grid>
          )}
          <Grid container justifyContent="center" alignItems="center" marginBottom={'10px'}>
            {activeTab === 'laboral' ? (
              <>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
                  <ButtonSave onClick={handleSubmit}>Guardar</ButtonSave>
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
          <Grid container justifyContent="center" alignItems="center" marginBottom={'0px'}>
            {!isOnline && (
              <>
                <Conecction
                  onClick={() => {
                    setLocalDatabaseActive(!isLocalDatabaseActive);
                    // setConnectionButtonClicked(true); // Se hizo clic en el botón de conexión
                    setMessage(''); // Limpiar el mensaje después de hacer clic en el botón de conexión
                    setMessageType(''); // Limpiar el tipo de mensaje después de hacer clic en el botón de conexión
                  }}
                  validacion={isLocalDatabaseActive}
                />
              </>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12} md={11} xl={11}>
          <FormContent>
            {!useMediaQuery('(max-width:600px)') && (
              // <Grid item xs={12} md={2} sx={{ backgroundColor: 'brown' }}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0px' }}>
                <>
                  {message && <MessageCard type={messageType}>{message}</MessageCard>}
                  {/* {!serverActive && <MessageCard type={messageType}>{message}</MessageCard>} */}
                  {/* {(connectionButtonClicked || message) && (
                  <MessageCard type={'error'}>¡Debes activar la base de datos local para guardar los datos sin conexión!</MessageCard>
                )} */}
                </>
              </Grid>
              //</Grid>
            )}
            {activeTab === 'defecto' && <></>}
            {activeTab === 'personal' && (
              <>
                <Title titulo="Información personal" />
                <TextDinamic
                  number={8}
                  labels={labelsPersonal}
                  names={namesPersonal}
                  types={typesPersonal}
                  values={Object.values(personalFormValues)}
                  // values={Object.values(personalFormValues || formData.Nombre, formData.Apellido, formData.TipoDocumento, formData.NumeroDocumento, formData.FechaNacimiento, formData.Género, formData.Edad)}
                  capitalization="primera"
                  onChange={(newValues) => {
                    const age = calculateAge(newValues['4']); // Calcular la edad usando la nueva fecha de nacimiento
                    setPersonalFormValues((prevValues) => ({
                      ...prevValues,
                      ...newValues,
                      6: age !== undefined ? age.toString() : prevValues['4'] // Almacenar la edad en el índice 6
                    }));
                    // setFormData({ ...formData, newValues });
                  }}
                  localbase={(!isOnline && !isLocalDatabaseActive) || !serverActive}
                />
              </>
            )}
            {activeTab === 'laboral' && (
              <>
                <Title titulo="Información Laboral" />
                <TextDinamic
                  number={5}
                  labels={labelsLaboral}
                  names={namesLaboral}
                  types={typesLaboral}
                  values={Object.values(laboralFormValues)}
                  // values={Object.values(laboralFormValues || formData.Empresa, formData.Cargo, formData.InicioTrabajo, formData.Salario)}
                  capitalization="primera"
                  onChange={(newValues) => {
                    setLaboralFormValues({ ...laboralFormValues, ...newValues });
                    // setFormData({ ...formData, newValues });
                  }}
                  localbase={(!isOnline && !isLocalDatabaseActive) || !serverActive}
                />
              </>
            )}
            {activeTab === 'crearcuenta' && (
              <>
                <Title titulo="Crear Cuenta" />
                <TextDinamic
                  number={2}
                  labels={labelsCuenta}
                  names={namesCuenta}
                  types={typesCuenta}
                  values={Object.values(cuentaFormValues)}
                  // values={Object.values(laboralFormValues || formData.Empresa, formData.Cargo, formData.InicioTrabajo, formData.Salario)}
                  capitalization="minuscula"
                  onChange={(newValues) => {
                    setCuentaFormValues({ ...cuentaFormValues, ...newValues });
                    // setFormData({ ...formData, newValues });
                  }}
                  localbase={(!isOnline && !isLocalDatabaseActive) || !serverActive}
                />
              </>
            )}
            {activeTab === 'table' && (
              <>
                <Grid item xs={12} md={12}>
                  <UserTable />
                </Grid>
              </>
            )}
            {activeTab === '4' && <></>}
            {activeTab === '5' && <></>}
            {activeTab === '6' && <></>}
          </FormContent>
        </Grid>
      </Grid>
    </>
  );
};

export default TaxData;
