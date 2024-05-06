import React, { useEffect, useState } from 'react';
import { Title } from 'components/titulo';
import TextDinamic from 'components/ButtonDinamic/buttonDinamic';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from 'api/config/configfire';
import { Avatar, Grid, useMediaQuery } from '@mui/material';
import user from 'assets/images/icons/man.png';
import table from 'assets/images/icons/table.png';
import ButtonSave from 'components/ButtonSave/ButtonSave';
import { FormContent, Labels, MessageCard, TabContainer, Tabs } from 'Style/Tab/styled';
import { labelsLaboral, labelsPersonal, namesLaboral, namesPersonal, typesLaboral, typesPersonal } from './variables';
import { FormFieldsValidator, calculateAge } from './validaciones';
import { Conecction } from 'components/ButtonDB/ButtonConection';
import { isPersonalFormFilled, isLaboralFormFilled } from './validarTabs';
import UserTable from '../ListCall/listCall';
//import { isEducateFormFilled, isPersonalFormFilled } from './validarTabs';
// import { Conecction } from 'components/ButtonDB/ButtonConection';
const FormCall = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [personalFormValues, setPersonalFormValues] = useState({});
  const [laboralFormValues, setLaboralFormValues] = useState({});
  //const [educateFormValues, setEducateFormValues] = useState({});
  //const [privacyFormValues, setPrivacyFormValues] = useState({});
  // const [buttonColor, setButtonColor] = useState('red');
  const [isLocalDatabaseActive, setLocalDatabaseActive] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState(false);
  // useEffect(() => {
  //if (activeTab !== 'personal') {
  //setPersonalFormValues({});
  // }
  //}, [activeTab]);

  useEffect(() => {
    const onlineHandler = () => {
      if (isOnline) {
        setIsOnline(true);
      }
    };

    const offlineHandler = () => {
      if (!isOnline) {
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

  // useEffect(() => {
  //   const isPersonalTab = activeTab === 'personal';
  //   const isLaboralTab = activeTab === 'laboral';

  //   const isTabFieldsFilled =
  //     (isPersonalTab && isPersonalFormFilled(personalFormValues, ['0', '1', '2', '3', '4', '5', '6'])) ||
  //     (isLaboralTab && isLaboralFormFilled(laboralFormValues, ['0', '1', '2', '3']));

  //   setIsAllFieldsFilled(isTabFieldsFilled);
  //   if (isTabFieldsFilled) {
  //     setMessage(''); // Si todos los campos están llenos, oculta el mensaje de aviso
  //   }
  // }, [activeTab, personalFormValues, laboralFormValues]);

  useEffect(() => {
    const isAllFieldsFilled =
      FormFieldsValidator({
        fields: ['0', '1', '2', '3', '4', '5', '6'],
        formValues: personalFormValues
      }) &&
      FormFieldsValidator({
        fields: ['0', '1', '2', '3'],
        formValues: laboralFormValues
      });
    setIsAllFieldsFilled(isAllFieldsFilled);
    if (isAllFieldsFilled) {
      setMessage(''); // Si todos los campos están llenos, oculta el mensaje de aviso
    }
  }, [personalFormValues, laboralFormValues]);
  const handleNextTab = () => {
    switch (activeTab) {
      case 'personal':
        setActiveTab('laboral');
        break;
      case 'laboral':
        setActiveTab('table');
        break;
      default:
        // En caso de que la pestaña actual sea la última, puedes manejarlo de diferentes maneras
        // Por ejemplo, puedes volver a la primera pestaña o mantener la última pestaña activa
        // Aquí simplemente lo volveremos a la primera pestaña
        setActiveTab('personal');
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      const isPersonalFormValid = isPersonalFormFilled(personalFormValues, ['0', '1', '2', '3', '4', '5', '6']);
      const isLaboralFormValid = isLaboralFormFilled(laboralFormValues, ['0', '1', '2', '3']);

      if (!isPersonalFormValid || !isLaboralFormValid) {
        setMessage('Debe que rellenar todos los campos de cada pestañas');
        setMessageType('error');
        return;
      }

      const dni = personalFormValues['3'];
      const usuariosRef = collection(db, 'usuarios');
      const querySnapshot = await getDocs(usuariosRef);
      let dniRepeated = false;

      querySnapshot.forEach((doc) => {
        if (doc.data()['Datos Personales']['Número de Documento'] === dni) {
          dniRepeated = true;
        }
      });

      if (dniRepeated) {
        setMessage('El número de DNI ya está en uso.');
        setMessageType('error');
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 8000); // Ocultar el mensaje después de 8 segundos

        // Limpiar el campo del número de documento
        setPersonalFormValues((prevValues) => ({
          ...prevValues,
          3: '' // Limpiar el valor del campo del número de documento
        }));

        return;
      }

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      let lastId = 0;
      querySnapshot.forEach((doc) => {
        const docId = doc.data().id.split('-')[1];
        const docYear = doc.data().id.split('-')[0];
        const docIdNumber = parseInt(docId);
        if (!isNaN(docIdNumber) && docYear === currentYear.toString() && docIdNumber > lastId) {
          lastId = docIdNumber;
        }
      });

      // Generar el nuevo ID en formato "YYYY-MM"
      const newId = `${currentYear}-${(lastId + 1).toString().padStart(2, '0')}`;

      const userDocRef = doc(usuariosRef, `Datos de : ${personalFormValues['0']} ${personalFormValues['1']}`); // Utilizar el nuevo ID generado

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

      await setDoc(userDocRef, {
        id: newId, // Utilizar el nuevo ID generado automáticamente
        'Datos Personales': personalData,
        'Datos Laborales': laboralData
      });

      setPersonalFormValues({});
      setLaboralFormValues({});
      setMessage('Datos guardados correctamente en Firestore');
      setMessageType('success');

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      console.error('Error al guardar los datos en Firestore:', error);
    }
  };

  //const isMobile = useMediaQuery('(max-width: 600px)');
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={1}>
          <TabContainer>
            {/* {isMobile && ( // Oculta los Tabs en modo móvil
          <>  
            <Tabs $active={activeTab === 'defecto'} onClick={() => setActiveTab('defecto')}>
              <Avatar src={user} sx={{ marginBottom: '10px' }} />
              <Labels>defecto</Labels>
            </Tabs>
          </>
        )} */}
            <Tabs
              $active={activeTab === 'personal'}
              onClick={() => setActiveTab('personal')}
              style={{
                backgroundColor: isPersonalFormFilled(personalFormValues, ['0', '1', '2', '3', '4', '5', '6']) ? '#d1ead1' : 'initial'
              }}
            >
              <Avatar src={user} sx={{ marginBottom: '10px' }} />
              <Labels>Personal</Labels>
            </Tabs>
            <Tabs
              $active={activeTab === 'laboral'}
              onClick={() => setActiveTab('laboral')}
              style={{ backgroundColor: isLaboralFormFilled(laboralFormValues, ['0', '1', '2', '3']) ? '#d1ead1' : 'initial' }}
            >
              <Avatar src={user} sx={{ marginBottom: '10px' }} />
              <Labels>Laboral</Labels>
            </Tabs>
            <Tabs $active={activeTab === 'table'} onClick={() => setActiveTab('table')}>
              <Avatar src={table} sx={{ marginBottom: '10px' }} />
              <Labels>Tabla</Labels>
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
          <Grid container justifyContent="center" alignItems="center" marginBottom={'30px'}>
            {activeTab === 'laboral' ? (
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
                <ButtonSave onClick={handleSubmit}>Guardar</ButtonSave>
              </Grid>
            ) : (
              isAllFieldsFilled && (
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
                  <ButtonSave onClick={handleNextTab}>Siguiente</ButtonSave>
                </Grid>
              )
            )}
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
        <Grid item xs={12} md={9}>
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
            {activeTab === 'table' && (
              <>
                {' '}
                <UserTable />
              </>
            )}
            {activeTab === '4' && <></>}
            {activeTab === '5' && <></>}
            {activeTab === '6' && <></>}
          </FormContent>
        </Grid>
        {!useMediaQuery('(max-width:600px)') && (
          <Grid item xs={12} md={2}>
            {' '}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0px' }}>
              {message && <MessageCard type={messageType}>{message}</MessageCard>}
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default FormCall;
