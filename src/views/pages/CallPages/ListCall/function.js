//function.js
import { db } from 'api/config/configfire';
import { collection, deleteDoc, doc, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import { calculateAge } from '../FormCall/validaciones';
export const getUsers = async () => {
  const usuariosRef = collection(db, 'usuarios');
  const querySnapshot = await getDocs(usuariosRef);
  const users = [];
  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    // Assign unique identifier to each user
    userData.id = doc.id;
    users.push(userData);
  });
  return users;
};

// Function to update user data in Firestore
export const updateUser = async (userId, updatedUserData) => {
  try {
    if (!userId) {
      throw new Error('userId is undefined or null.');
    }

    const userDocRef = doc(db, 'usuarios', userId);
    await updateDoc(userDocRef, updatedUserData);
    console.log('User data updated successfully.');
  } catch (error) {
    console.error('Error updating user data:', error);
  }
};

// Function to delete user from Firestore
export const deleteUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error('userId is undefined or null.');
    }

    const userDocRef = doc(db, 'usuarios', userId);
    await deleteDoc(userDocRef);
    console.log('User deleted successfully.');
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

export const handleSubmit = async (personalFormValues, laboralFormValues, usuariosRef) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Generar el nuevo ID autoincrementable
    let lastId = 0;
    querySnapshot.forEach((doc) => {
      const docId = doc.data().id.split('-')[1]; // Obtener el número del ID
      const docIdNumber = parseInt(docId); // Convertir el número del ID a entero
      if (!isNaN(docIdNumber) && docIdNumber > lastId) {
        lastId = docIdNumber;
      }
    });

    // Generar el nuevo ID en formato "YYYY-MM"
    const newId = `${currentYear}-${(lastId + 1).toString().padStart(2, '0')}`;

    const userDocRef = doc(usuariosRef, newId);
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
      id: userDocRef, // Guardar el ID generado automáticamente
      'Datos Personales': personalData,
      'Datos Laborales': laboralData
    });
  } catch (error) {
    console.error('Error al guardar los datos en Firestore:', error);
  }
};
