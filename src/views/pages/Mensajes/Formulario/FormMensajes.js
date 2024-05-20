//Mensaje.js
import React, { useCallback, useEffect, useState } from 'react';
import { Title } from 'components/titulo';
import axios from 'axios';
import emailjs from 'emailjs-com';
import TextDinamic from 'components/ButtonDinamic/buttonDinamic';
// import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
// import { db } from 'api/config/configfire';
import { Avatar, Grid, useMediaQuery } from '@mui/material';
import user from 'assets/images/icons/man.png';
import table from 'assets/images/icons/table.png';
import ButtonSave from 'components/ButtonSave/ButtonSave';
import { FormContent, Labels, MessageCard, TabContainer, Tabs } from 'Style/Tab/styled';
// import { calculateAge } from './validaciones';
// import axios from 'axios';
// import { isPersonalFormFilled, isLaboralFormFilled } from './validarTabs';
// import UserTable from '../ListCall/listCall';

import { Conecction } from 'components/ButtonDB/ButtonConection';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from 'api/config/configfire';
import { useSelector } from 'react-redux';
import { isPersonalFormFilled } from '../../CallPages/FormCall/validarTabs';

import Widget from 'components/Widgett/widget';

import { labelsMensaje, namesMensaje, typesMensaje } from '../Values/Arreglo';
import { createMensaje } from '../Controller/mensajeController';

const Mensajes = () => {
  const customization = useSelector((state) => state.customization);
  const [activeTab, setActiveTab] = useState('vacancies');
  const [mensajeFormValues, setMensajeFormValues] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  //   const [isAllFieldsFilled, setIsAllFieldsFilled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLocalDatabaseActive, setLocalDatabaseActive] = useState(false);
  const [fromEmail, setFromEmail] = useState('');

  useEffect(() => {
    // Verificar si todos los campos están llenos
    if (isPersonalFormFilled(mensajeFormValues, ['0', '1'])) {
      // Si todos los campos están llenos, limpiar el mensaje
      setMessage('');
      setMessageType('');
      setAllFieldsFilled(true);
    } else {
      setAllFieldsFilled(false);
    }
  }, [mensajeFormValues]);

  useEffect(() => {
    const onlineHandler = () => setIsOnline(true);
    const offlineHandler = () => setIsOnline(false);
    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);

    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }, []);

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

  //FormVacantes.js
  const handleSubmit = useCallback(async () => {
    try {
      const departmentsData = {
        addressee: mensajeFormValues['0'] || '',
        description: mensajeFormValues['1'] || '',
        status: mensajeFormValues['2'] || ''
      };

      console.log('Datos antes de enviar:', departmentsData);

      if (isOnline) {
        // Enviar el email usando EmailJS
        // const data = {
        //   service_id: 'service_3s0l5ro',
        //   template_id: 'template_5uma89g',
        //   user_id: 'FgothyKKiUkNGL3k6',
        //   template_params: {
        //     to_name: 'sogo',
        //     from_email: departmentsData.addressee,
        //     from_name: fromEmail,
        //     message: departmentsData.description
        //   }
        // };
        const templateParams = {
          to_name: 'sogo',
          from_email: departmentsData.addressee,
          from_name: fromEmail,
          message: departmentsData.description
          // Utiliza la dirección de correo electrónico ingresada por el usuario como el remitente
        };
        //await axios.get('https://api.emailjs.com/api/v1.0/email/send', data);
        emailjs
          .send('service_3s0l5ro', 'template_5uma89g', templateParams, 'FgothyKKiUkNGL3k6')
          .then
          //   (response) => {
          //     console.log('Email enviado:', response.status, response.text);
          //     setMessage('Email enviado correctamente');
          //     setMessageType('success');
          //     setTimeout(() => {
          //       setMessage('');
          //       setMessageType('');
          //     }, 8000);
          //   },
          //   (error) => {
          //     console.error('Error al enviar email:', error);
          //     setMessage('Error al enviar el email');
          //     setMessageType('error');
          //     setTimeout(() => {
          //       setMessage('');
          //       setMessageType('');
          //     }, 20000);
          //   }
          ();
        await createMensaje({ ...departmentsData }, setMensajeFormValues, setMessage, setMessageType, allFieldsFilled);
      } else {
        const apiResponse = await axios.post('http://localhost:8080/api/mensaje', { ...departmentsData });
        console.log('Respuesta de la API:', apiResponse.data);
        setMessage('Datos guardados correctamente en tu API');
        setMessageType('success');
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 8000);
        const nextId = apiResponse.data.id;
        const departmentsRef = collection(db, 'Mensaje');
        await setDoc(doc(departmentsRef, nextId.toString()), {
          id: nextId.toString(),
          'Detalles de Mensajes': departmentsData
        });
      }
      setMensajeFormValues({});
    } catch (error) {
      console.error('Error al guardar los datoss:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
        setMessageType('error');
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 20000);
      }
    }
  }, [isOnline, mensajeFormValues, allFieldsFilled]);

  const isMobile = useMediaQuery('(min-width:0px) and (max-width:1536px)');
  return (
    <>
      <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid item xs={12} md={11} xl={1}>
          <TabContainer mobile={isMobile}>
            {/* {isMobile && ( // Oculta los Tabs en modo móvil
          <>  
            <Tabs $active={activeTab === 'defecto'} onClick={() => setActiveTab('defecto')}>
              <Avatar src={user} sx={{ marginBottom: '10px' }} />
              <Labels>defecto</Labels>
            </Tabs>
          </>
        )} */}
            <Tabs
              $active={activeTab === 'vacancies'}
              $darkMode={customization.darkMode}
              onClick={() => setActiveTab('vacancies')}
              style={{
                borderRadius: `${customization.borderRadius}px`,
                backgroundColor: isPersonalFormFilled(mensajeFormValues, ['0', '1'])
                  ? customization.darkMode
                    ? '#112d15' // Modo oscuro: verde oscuro
                    : '#a4eeb9' // Modo claro: verde claro
                  : 'initial'
              }}
            >
              <Avatar src={user} sx={{ marginBottom: '10px' }} />
              <Labels $darkMode={customization.darkMode}>Departamento</Labels>
            </Tabs>
            <Tabs
              $active={activeTab === 'table'}
              $darkMode={customization.darkMode}
              onClick={() => setActiveTab('table')}
              style={{
                borderRadius: `${customization.borderRadius}px`
              }}
            >
              <Avatar src={table} sx={{ marginBottom: '10px' }} />
              <Labels $darkMode={customization.darkMode}>Tabla</Labels>
            </Tabs>
          </TabContainer>
          {useMediaQuery('(max-width:600px)') && (
            <Grid item xs={12} md={2}>
              {' '}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0px' }}>
                {message && <MessageCard type={messageType}>{message}</MessageCard>}
              </Grid>
            </Grid>
          )}
          <Grid container justifyContent="center" alignItems="center" marginBottom={'10px'}>
            {activeTab === 'vacancies' ? (
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
          <FormContent $darkMode={customization.darkMode}>
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
            {activeTab === 'vacancies' && (
              <>
                <Title titulo="Información personal" />
                <TextDinamic
                  number={2}
                  labels={labelsMensaje}
                  names={namesMensaje}
                  types={typesMensaje}
                  values={Object.values(mensajeFormValues)}
                  capitalization="primera"
                  onChange={(newValues) => {
                    setMensajeFormValues((prevValues) => ({
                      ...prevValues,
                      ...newValues
                    }));
                  }}
                  localbase={!isOnline && !isLocalDatabaseActive}
                />
                <Grid container justifyContent="center" alignItems="center" marginBottom={'10px'}>
                  <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
                    <input
                      type="email"
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      placeholder="Tu dirección de correo electrónico"
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {activeTab === 'table' && (
              <>
                <Grid item xs={12} md={12}>
                  <>
                    <Widget />
                  </>
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

export default Mensajes;
