// firestoreUtils.js
import { db } from 'api/config/configfire.js';
import { collection } from 'firebase/firestore'; // Importa la función collection desde 'firebase/firestore'


export const guardarDatosFirestore = async (datos) => {
  try {
    // Accede a la colección 'usuarios' (puedes cambiar el nombre según tu estructura)
    const usuariosRef = collection(db, 'usuarios');

    // Agrega un nuevo documento con los datos del usuario
    await addDoc(usuariosRef, datos);

    console.log('Datos guardados en Firestore correctamente.');
  } catch (error) {
    console.error('Error al guardar los datos en Firestore:', error);
  }
};
