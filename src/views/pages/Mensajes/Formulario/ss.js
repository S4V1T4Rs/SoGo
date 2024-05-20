import React, { useCallback, useEffect, useState } from 'react';
import { Title } from 'components/titulo';
import TextDinamic from 'components/ButtonDinamic/buttonDinamic';
import { Avatar, Grid, useMediaQuery } from '@mui/material';
import user from 'assets/images/icons/man.png';
import table from 'assets/images/icons/table.png';
import ButtonSave from 'components/ButtonSave/ButtonSave';
import { FormContent, Labels, MessageCard, TabContainer, Tabs } from 'Style/Tab/styled';
import { Conecction } from 'components/ButtonDB/ButtonConection';
import { useSelector } from 'react-redux';
import { isPersonalFormFilled } from '../../CallPages/FormCall/validarTabs';
import Widget from 'components/Widgett/widget';
import { labelsMensaje, namesMensaje, typesMensaje } from '../Values/Arreglo';
import emailjs from 'emailjs-com';

const Mensajes = () => {
  const customization = useSelector((state) => state.customization);
  const [activeTab, setActiveTab] = useState('vacancies');
  const [mensajeFormValues, setMensajeFormValues] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLocalDatabaseActive, setLocalDatabaseActive] = useState(false);

  useEffect(() => {
    if (isPersonalFormFilled(mensajeFormValues, ['0', '1'])) {
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
    if (!isLocalDatabaseActive && !message && !isOnline) {
      setMessage('¡Debes activar la base de datos local para guardar los datos sin conexión!');
      setMessageType('error');
    }
  }, [isLocalDatabaseActive, message, isOnline]);

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
        const templateParams = {
          to_email: departmentsData.addressee,
          message: departmentsData.description
        };

        emailjs.send('service_3s0l5ro', 'template_5uma89g', templateParams, 'FgothyKKiUkNGL3k6').then(
          (response) => {
            console.log('Email enviado:', response.status, response.text);
            setMessage('Email enviado correctamente');
            setMessageType('success');
            setTimeout(() => {
              setMessage('');
              setMessageType('');
            }, 8000);
          },
          (error) => {
            console.error('Error al enviar email:', error);
            setMessage('Error al enviar el email');
            setMessageType('error');
            setTimeout(() => {
              setMessage('');
              setMessageType('');
            }, 20000);
          }
        );
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
      console.error('Error al guardar los datos:', error);
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
            <Tabs
              $active={activeTab === 'vacancies'}
              $darkMode={customization.darkMode}
              onClick={() => setActiveTab('vacancies')}
              style={{
                borderRadius: `${customization.borderRadius}px`,
                backgroundColor: isPersonalFormFilled(mensajeFormValues, ['0', '1'])
                  ? customization.darkMode
                    ? '#112d15'
                    : '#a4eeb9'
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
                    setMessage('');
                    setMessageType('');
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
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0px' }}>
                {message && <MessageCard type={messageType}>{message}</MessageCard>}
              </Grid>
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
                  capitalization="minuscula"
                  onChange={(newValues) => {
                    setMensajeFormValues((prevValues) => ({
                      ...prevValues,
                      ...newValues
                    }));
                  }}
                  localbase={!isOnline && !isLocalDatabaseActive}
                />
              </>
            )}

            {activeTab === 'table' && (
              <>
                <Grid item xs={12} md={12}>
                  <Widget />
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
