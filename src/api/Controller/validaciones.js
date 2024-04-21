import { getDocs, query, where } from 'firebase/firestore';

export const isDniInUse = async (dni, usuariosRef) => {
  try {
    // Crear una consulta para buscar documentos con el DNI proporcionado
    const q = query(usuariosRef, where('Datos Personales.NumeroDocumento', '==', dni));

    // Obtener los documentos que coinciden con la consulta
    const querySnapshot = await getDocs(q);

    // Verificar si se encontró algún documento con el DNI proporcionado
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if DNI is in use:', error);
    throw error;
  }
};
