import React, { useEffect, useState } from 'react';
import { Title } from 'components/titulo';
import TextDinamic from 'components/ButtonDinamic/buttonDinamic';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from 'api/config/configfire';
import { Avatar, Grid, TextField, useMediaQuery } from '@mui/material';
import user from 'assets/images/icons/man.png';
import labor from 'assets/images/icons/labor.png';
import privacy from 'assets/images/icons/privacy.png';
import table from 'assets/images/icons/table.png';
import ButtonSave from 'components/ButtonSave/ButtonSave';
import { FormContent, Labels, MessageCard, TabContainer, Tabs } from 'components/Tab/styled';
import {
  labelsLaboral,
  labelsPersonal,
  labelsPrivacy,
  namesLaboral,
  namesPersonal,
  namesPrivacy,
  typesLaboral,
  typesPersonal,
  typesPrivacy
} from './variables';
import { FormFieldsValidator, calculateAge } from './validaciones';
import { Conecction } from 'components/ButtonDB/ButtonConection';
// import { Conecction } from 'components/ButtonDB/ButtonConection';
const FormHire = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [personalFormValues, setPersonalFormValues] = useState({});
  const [laboralFormValues, setLaboralFormValues] = useState({});
  const [privacyFormValues, setPrivacyFormValues] = useState({});
  // const [buttonColor, setButtonColor] = useState('red');
  const [isLocalDatabaseActive, setLocalDatabaseActive] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const onlineHandler = () => {
      if (!isOnline) {
        setIsOnline(true);
      }
    };

    const offlineHandler = () => {
      if (isOnline) {
        setIsOnline(false);
      }
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
    const isAllFieldsFilled =
      FormFieldsValidator({
        fields: ['0', '1', '2', '3', '4', '5', '6'],
        formValues: personalFormValues
      }) &&
      FormFieldsValidator({
        fields: ['0', '1', '2', '3'],
        formValues: laboralFormValues
      }) &&
      FormFieldsValidator({
        fields: ['0', '1', '2'],
        formValues: privacyFormValues
      });

    if (isAllFieldsFilled) {
      setMessage(''); // Si todos los campos están llenos, oculta el mensaje de aviso
    }
  }, [personalFormValues, laboralFormValues, privacyFormValues]);
  const handleSubmit = async () => {
    try {
      // Validación de campos personales
      const isPersonalFormValid = FormFieldsValidator({
        fields: ['0', '1', '2', '3', '4', '5', '6'],
        formValues: personalFormValues
      });

      // Validación de campos laborales
      const isLaboralFormValid = FormFieldsValidator({
        fields: ['0', '1', '2', '3'],
        formValues: laboralFormValues
      });

      // Validación de campos de privacidad
      const isPrivacyFormValid = FormFieldsValidator({
        fields: ['0', '1', '2'],
        formValues: privacyFormValues
      });

      if (!isPersonalFormValid || !isLaboralFormValid || !isPrivacyFormValid) {
        setMessage('Por favor complete todos los campos de información personal y laboral antes de guardar.');
        setMessageType('error');
        //setButtonColor('red'); // Asegúrate de establecer el color del botón en rojo
        return;
      }

      const usuariosRef = collection(db, 'usuarios');
      const userDocRef = doc(usuariosRef, `Datos de : ${personalFormValues['0']} ${personalFormValues['1']}`);

      const age = calculateAge(personalFormValues['4']);

      const personalData = {
        Nombre: personalFormValues['0'] || '',
        Apellido: personalFormValues['1'] || '',
        'Tipo de Documento': personalFormValues['2'] || '',
        'Número de Documento': personalFormValues['3'] || '',
        'Fecha de Nacimiento': personalFormValues['4'] || '',
        Género: personalFormValues['5'] || '',
        Edad: age.toString()
      };

      const laboralData = {
        Empresa: laboralFormValues['0'] || '',
        Cargo: laboralFormValues['1'] || '',
        'Inicio de Trabajo': laboralFormValues['2'] || '',
        Salario: laboralFormValues['3'] || ''
      };

      const privacyData = {
        Correo: privacyFormValues['0'] || '',
        Usuario: privacyFormValues['1'] || '',
        Password: privacyFormValues['2'] || ''
      };

      await setDoc(userDocRef, {
        'Datos Personales': personalData,
        'Datos Laborales': laboralData,
        'Datos de Privacidad': privacyData
      });

      setPersonalFormValues({});
      setLaboralFormValues({});
      setPrivacyFormValues({});
      setMessage('Datos guardados correctamente en Firestore');
      setMessageType('success');

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000); // Ocultar el mensaje después de 3 segundos
    } catch (error) {
      console.error('Error al guardar los datos en Firestore:', error);
    }
  };
  const isMobile = useMediaQuery('(max-width: 600px)');
  return (
    <>
      <TabContainer>
        {isMobile && ( // Oculta los Tabs en modo móvil
          <>
            <Tabs $active={activeTab === 'defecto'} onClick={() => setActiveTab('defecto')}>
              <Avatar src={user} sx={{ marginBottom: '10px' }} />
              <Labels>defecto</Labels>
            </Tabs>
          </>
        )}
        <Tabs $active={activeTab === 'personal'} onClick={() => setActiveTab('personal')}>
          <Avatar src={user} sx={{ marginBottom: '10px' }} />
          <Labels>Personal</Labels>
        </Tabs>
        <Tabs $active={activeTab === 'laboral'} onClick={() => setActiveTab('laboral')}>
          <Avatar src={labor} sx={{ marginBottom: '10px' }} />
          <Labels>Laboral</Labels>
        </Tabs>
        <Tabs $active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')}>
          <Avatar src={privacy} sx={{ marginBottom: '10px' }} />
          <Labels>Privado</Labels>
        </Tabs>
        <Tabs $active={activeTab === 'table'} onClick={() => setActiveTab('table')}>
          <Avatar src={table} sx={{ marginBottom: '10px' }} />
          <Labels>Tabla</Labels>
        </Tabs>
        <Tabs $active={activeTab === 'xd'} onClick={() => setActiveTab('xd')}>
          <Avatar src={table} sx={{ marginBottom: '10px' }} />
          <Labels>xd</Labels>
        </Tabs>
      </TabContainer>
      <Grid container justifyContent="center" alignItems="center" marginBottom={'30px'}>
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
          <ButtonSave onClick={handleSubmit}>Guardar</ButtonSave>
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
          {message && <MessageCard type={messageType}>{message}</MessageCard>}
        </Grid>
      </Grid>
      {!isOnline && (
        <>
          <Conecction
            onClick={() => {
              setLocalDatabaseActive(!isLocalDatabaseActive);
              //console.log('Clicked');
            }}
            validacion={isLocalDatabaseActive}
          />
        </>
      )}

      <FormContent>
        {activeTab === 'defecto' && <></>}
        {activeTab === 'personal' && (
          <>
            <Title titulo="Información personal" />
            <TextDinamic
              number={7}
              labels={labelsPersonal}
              names={namesPersonal}
              types={typesPersonal}
              values={Object.values(personalFormValues)}
              capitalization="primera"
              onChange={(newValues) => {
                const age = calculateAge(newValues['4']); // Calcular la edad usando la nueva fecha de nacimiento
                setPersonalFormValues((prevValues) => ({
                  ...prevValues,
                  ...newValues,
                  6: age !== undefined ? age.toString() : prevValues['4'] // Almacenar la edad en el índice 6
                }));
              }}
              localbase={!isOnline && !isLocalDatabaseActive}
            />
            <TextField id="outlined-basic" label="Outlined" variant="filled" sx={{ width: '90%', color: 'red' }} />
          </>
        )}
        {activeTab === 'laboral' && (
          <>
            <Title titulo="Información Laboral" />
            <TextDinamic
              number={4}
              labels={labelsLaboral}
              names={namesLaboral}
              types={typesLaboral}
              values={Object.values(laboralFormValues)}
              capitalization="primera"
              onChange={(newValues) => setLaboralFormValues({ ...laboralFormValues, ...newValues })}
              localbase={!isOnline && !isLocalDatabaseActive}
            />
          </>
        )}
        {activeTab === 'privacy' && (
          <>
            <Title titulo="Información Privada" />
            <TextDinamic
              number={3}
              labels={labelsPrivacy}
              names={namesPrivacy}
              types={typesPrivacy}
              values={Object.values(privacyFormValues)}
              capitalization="primera"
              onChange={(newValues) => setPrivacyFormValues({ ...privacyFormValues, ...newValues })}
              localbase={!isOnline && !isLocalDatabaseActive}
            />
          </>
        )}
        {activeTab === 'table' && <></>}
        {activeTab === 'xd' && <></>}
      </FormContent>
    </>
  );
};

export default FormHire;
