//VacancieController.js

import { collection, deleteDoc, doc, getDocs, getDoc, setDoc, updateDoc, query, where } from '@firebase/firestore';
import { db } from 'api/config/configfire';
// Asegúrate de importar la instancia de Firestore correctamente desde tu archivo de configuración
import axios from 'axios';

// Referencia a la colección 'usuarios'
const vacanciesRef = collection(db, 'Vancantes');
//fireController.js
export const isNameInUse = async (dni, usuariosRef) => {
  try {
    // Crear una consulta para buscar documentos con el DNI proporcionado
    const q = query(usuariosRef, where('Detalles de Vacantes.vacancyName', '==', dni));

    // Obtener los documentos que coinciden con la consulta
    const querySnapshot = await getDocs(q);

    // Verificar si se encontró algún documento con el DNI proporcionado
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if DNI is in use:', error);
    throw error;
  }
};

export const createVacancies = async (
  data,
  departmentId,
  setVacanciesFormValues,
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
    // Verificar si el DNI ya está en uso
    const dniInUse = await isNameInUse(data.vacancyName, vacanciesRef);
    if (dniInUse) {
      setMessage('Ya existe ese nombre de la vacante');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 4000); // Ocultar el mensaje después de 4 segundos
      // Limpiar el campo del número de documento solo si está en uso
      setVacanciesFormValues((prevValues) => ({
        ...prevValues,
        0: '' // Limpiar el valor del campo del número de documento
      }));
      return; // Detener el proceso de guardado
    }

    // Guardar el usuario en la base de datos de la API
    const apiResponse = await axios.post('http://localhost:8080/api/vacante', {
      ...data,
      departmentId: departmentId
    });

    const apiData = apiResponse.data;
    // Si no hay conexión a Internet, mostrar mensaje y limpiar campos

    // Obtener el ID generado por la API
    const nextId = apiData.id;

    // Crear el objeto userData con los datos del usuario
    const userData = {
      id: nextId.toString(),
      'Detalles de Vacantes': {
        vacancyName: data.vacancyName,
        description: data.description,
        workType: data.workType,
        department: data.department,
        departmentId: departmentId,
        creationDate: data.creationDate,
        status: data.status
      }
    };

    // Guardar el documento en Firestore con el ID generado por la API
    await setDoc(doc(vacanciesRef, nextId.toString()), {
      id: nextId.toString(),
      'Detalles de Vacantes': userData['Detalles de Vacantes']
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
    setVacanciesFormValues({});
    return nextId.toString(); // Retorna el ID del documento creado
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

// Función para obtener todos los documentos de la colección 'usuarios'
export const getVacancies = async () => {
  try {
    const querySnapshot = await getDocs(vacanciesRef);
    const users = [];
    const apiResponse = await axios.get(`http://localhost:8080/api/vacante`);
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

export const updateVacancies = async (docId, data, datafire) => {
  try {
    // Realizar la solicitud de actualización a través de Axios
    const apiResponse = await axios.put(`http://localhost:8080/api/vacante/${docId}`, { ...data });
    console.log('Response from API Update:', apiResponse.data);

    // Verificar si la actualización en la API fue exitosa
    if (apiResponse.status === 200) {
      // Obtener el documento actual de Firestore
      const usuarioDoc = await getDoc(doc(vacanciesRef, docId));
      if (usuarioDoc.exists()) {
        // Actualizar solo los campos relevantes en Firestore
        const newData = {
          'Detalles de Vacantes': datafire['Detalles de Vacantes']
        };
        await updateDoc(doc(vacanciesRef, docId), newData);
        console.log(updateDoc);
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
export const deleteVacancies = async (docId) => {
  try {
    await deleteDoc(doc(vacanciesRef, docId));
    console.log('Document successfully deleted');
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};
