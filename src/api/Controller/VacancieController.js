//VacancieController.js

import { db } from 'api/config/configfire';
import { isDniInUse } from './validaciones';
import { collection, deleteDoc, doc, getDocs, getDoc, setDoc, updateDoc } from '@firebase/firestore';
// Asegúrate de importar la instancia de Firestore correctamente desde tu archivo de configuración
import axios from 'axios';

// Referencia a la colección 'usuarios'
const usuariosRef = collection(db, 'Vancantes');
//fireController.js
export const createUsuario = async (
  data,
  setPersonalFormValues,
  setLaboralFormValues,
  setMessage,
  setMessageType,
  allFieldsFilled
  // isOnline,
  // isLocalDatabaseActive
) => {
  try {
    if (!allFieldsFilled) {
      setMessage('Todos los campos de los tabs deben estar llenos');
      setMessageType('error');
      return;
    }
    // // Verificar si el DNI ya está en uso
    // const dniInUse = await isDniInUse(data.NumeroDocumento, usuariosRef);
    // if (dniInUse) {
    //   setMessage('El número de DNI ya está en uso.');
    //   setMessageType('error');
    //   setTimeout(() => {
    //     setMessage('');
    //     setMessageType('');
    //   }, 4000); // Ocultar el mensaje después de 4 segundos
    //   // Limpiar el campo del número de documento solo si está en uso
    //   setPersonalFormValues((prevValues) => ({
    //     ...prevValues,
    //     3: '' // Limpiar el valor del campo del número de documento
    //   }));
    //   return; // Detener el proceso de guardado
    // }

    // Guardar el usuario en la base de datos de la API
    const apiResponse = await axios.post('http://localhost:8080/api/vacancie', {
      ...data
    });

    const apiData = apiResponse.data;
    // Si no hay conexión a Internet, mostrar mensaje y limpiar campos

    // Obtener el ID generado por la API
    const nextId = apiData.idCall;

    // Crear el objeto userData con los datos del usuario
    const userData = {
      id: nextId.toString(),
      'Datos Personales': {
        Nombre: data.Nombre,
        Apellido: data.Apellido,
        Edad: data.Edad,
        TipoDocumento: data.TipoDocumento,
        NumeroDocumento: data.NumeroDocumento,
        FechaNacimiento: data.FechaNacimiento,
        Género: data.Género
      },
      'Datos Laborales': {
        Cargo: data.Cargo,
        Empresa: data.Empresa,
        InicioTrabajo: data.InicioTrabajo,
        Salario: data.Salario
      }
    };

    // Guardar el documento en Firestore con el ID generado por la API
    await setDoc(doc(usuariosRef, nextId.toString()), {
      id: nextId.toString(),
      'Datos Personales': userData['Datos Personales'],
      'Datos Laborales': userData['Datos Laborales']
    });

    // Manejar la respuesta de la API según sea necesario
    console.log('Respuesta de la API:', apiData);
    // if (isOnline && isLocalDatabaseActive) {
    //   setMessage('Los datos se han guardado en la base de datos local.');
    //   setMessageType('success');
    //   setTimeout(() => {
    //     setMessage('');
    //     setMessageType('');
    //   }, 8000);
    //   setPersonalFormValues({});
    //   setLaboralFormValues({});
    // } else {
    // Manejar la respuesta de la API según sea necesario
    console.log('Respuesta de la API:', apiResponse);
    setMessage('Datos guardados correctamente en tu API y FIRESTORE');
    setMessageType('success');
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 8000);
    setPersonalFormValues({});
    setLaboralFormValues({});
    return nextId.toString(); // Retorna el ID del documento creado
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

// Función para obtener todos los documentos de la colección 'usuarios'
export const getUsuarios = async () => {
  try {
    const querySnapshot = await getDocs(usuariosRef);
    const users = [];
    const apiResponse = await axios.get(`http://localhost:8080/api/call`);
    console.log('Response from API Update:', apiResponse.data);
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      // Assign unique identifier to each user
      userData.id = doc.id;
      users.push(userData);
    });
    return users;
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

export const updateUsuario = async (docId, data, datafire) => {
  try {
    // Realizar la solicitud de actualización a través de Axios
    const apiResponse = await axios.put(`http://localhost:8080/api/call/${docId}`, { ...data });
    console.log('Response from API Update:', apiResponse.data);

    // Verificar si la actualización en la API fue exitosa
    if (apiResponse.status === 200) {
      // Obtener el documento actual de Firestore
      const usuarioDoc = await getDoc(doc(usuariosRef, docId));
      if (usuarioDoc.exists()) {
        // Actualizar solo los campos relevantes en Firestore
        const newData = {
          'Datos Personales': datafire['Datos Personales'],
          'Datos Laborales': datafire['Datos Laborales']
        };
        await updateDoc(doc(usuariosRef, docId), newData);
        console.log('Document successfully updated in Firestore');
        return apiResponse.data;
      } else {
        throw new Error('Document does not exist in Firestore');
      }
    } else {
      console.error('Error updating document in API:', apiResponse.data);
      throw new Error('Failed to update document in API');
    }
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Función para eliminar un documento en Firestore
export const deleteUsuario = async (docId) => {
  try {
    await deleteDoc(doc(usuariosRef, docId));
    console.log('Document successfully deleted');
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};
