//VacancieController.js

import { collection, deleteDoc, doc, getDocs, getDoc, setDoc, updateDoc } from '@firebase/firestore';
import { db } from 'api/config/configfire';
// Asegúrate de importar la instancia de Firestore correctamente desde tu archivo de configuración
import axios from 'axios';

// Referencia a la colección 'usuarios'
const mensajeRef = collection(db, 'Mensaje');
//fireController.js
// export const isNameInUse = async (dni, departamentosRef) => {
//   try {
//     // Crear una consulta para buscar documentos con el DNI proporcionado
//     const q = query(usuariosRef, where('Detalles de Vacantes.vacancyName', '==', dni));

//     // Obtener los documentos que coinciden con la consulta
//     const querySnapshot = await getDocs(q);

//     // Verificar si se encontró algún documento con el DNI proporcionado
//     return !querySnapshot.empty;
//   } catch (error) {
//     console.error('Error checking if DNI is in use:', error);
//     throw error;
//   }
// };

export const createMensaje = async (
  data,
  //   departmentId,
  setDepartmentFormValues,
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
    // const dniInUse = await isNameInUse(data.vacancyName, departamentosRef);
    // if (dniInUse) {
    //   setMessage('El número de DNI ya está en uso.');
    //   setMessageType('error');
    //   setTimeout(() => {
    //     setMessage('');
    //     setMessageType('');
    //   }, 4000); // Ocultar el mensaje después de 4 segundos
    //   // Limpiar el campo del número de documento solo si está en uso
    //   setVacanciesFormValues((prevValues) => ({
    //     ...prevValues,
    //     0: '' // Limpiar el valor del campo del número de documento
    //   }));
    //   return; // Detener el proceso de guardado
    // }

    // Guardar el usuario en la base de datos de la API
    const apiResponse = await axios.post('http://localhost:8080/api/mensaje', {
      ...data
      //   departmentId: departmentId
    });

    const apiData = apiResponse.data;
    // Si no hay conexión a Internet, mostrar mensaje y limpiar campos

    // Obtener el ID generado por la API
    const nextId = apiData.id;

    // Crear el objeto userData con los datos del usuario
    const mensajeData = {
      id: nextId.toString(),
      'Detalles de Mensajes': {
        addressee: data.addressee,
        description: data.description,
        status: data.status
      }
    };

    // Guardar el documento en Firestore con el ID generado por la API
    await setDoc(doc(mensajeRef, nextId.toString()), {
      id: nextId.toString(),
      'Detalles de Mensajes': mensajeData['Detalles de Mensajes']
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
    setDepartmentFormValues({});
    return nextId.toString(); // Retorna el ID del documento creado
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

// Función para obtener todos los documentos de la colección 'usuarios'
export const getMensaje = async () => {
  try {
    const querySnapshot = await getDocs(mensajeRef);
    const mensajes = [];
    const apiResponse = await axios.get(`http://localhost:8080/api/mensaje`);
    console.log('Response from API Update:', apiResponse.data);
    querySnapshot.forEach((doc) => {
      const mensajeData = doc.data();
      // Assign unique identifier to each user
      mensajeData.id = doc.id;
      mensajes.push(mensajeData);
    });
    return mensajes;
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

export const updateMensaje = async (docId, data, datafire) => {
  try {
    // Realizar la solicitud de actualización a través de Axios
    const apiResponse = await axios.put(`http://localhost:8080/api/mensaje/${docId}`, { ...data });
    console.log('Response from API Update:', apiResponse.data);

    // Verificar si la actualización en la API fue exitosa
    if (apiResponse.status === 200) {
      // Obtener el documento actual de Firestore
      const mensajesDoc = await getDoc(doc(mensajeRef, docId));
      if (mensajesDoc.exists()) {
        // Actualizar solo los campos relevantes en Firestore
        const newData = {
          'Detalles de Mensajes': datafire['Detalles de Departamentos']
        };
        await updateDoc(doc(mensajeRef, docId), newData);
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
export const deleteMensaje = async (docId) => {
  try {
    await deleteDoc(doc(mensajeRef, docId));
    console.log('Document successfully deleted');
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};
