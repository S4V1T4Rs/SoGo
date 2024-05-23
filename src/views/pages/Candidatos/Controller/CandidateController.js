//fireController.js
import { db } from 'api/config/configfire';
// import { isDniInUse } from './validations';
import { collection, deleteDoc, doc, getDocs, getDoc, setDoc, updateDoc } from '@firebase/firestore';
// Make sure to import Firestore instance correctly from your configuration file
import axios from 'axios';

// Reference to the 'candidates' collection
export const candidatesRef = collection(db, 'Candidato');

export const createCandidates = async (
  data,
  setPersonalFormValues,
  setLaboralFormValues,
  setCuentaFormValues,
  setMessage,
  setMessageType,
  allFieldsFilled
) => {
  try {
    if (!allFieldsFilled) {
      setMessage('All fields in the tabs must be filled');
      setMessageType('error');
      return;
    }

    // const dniInUse = await isDniInUse(data.IDNumber, candidatesRef);
    // if (dniInUse) {
    //   setMessage('The ID number is already in use.');
    //   setMessageType('error');
    //   setTimeout(() => {
    //     setMessage('');
    //     setMessageType('');
    //   }, 4000);
    //   setPersonalFormValues((prevValues) => ({
    //     ...prevValues,
    //     IDNumber: ''
    //   }));
    //   return;
    // }

    const apiResponse = await axios.post('http://localhost:8080/api/candidato', {
      ...data
    });

    const apiData = apiResponse.data;

    const nextId = apiData.id;

    const userData = {
      id: nextId.toString(),
      'Datos Personales': {
        firstName: data.firstName,
        lastName: data.lastName,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        birthDate: data.birthDate,
        gender: data.gender,
        phone: data.phone,
        ages: data.ages
      },
      'Datos Laborales': {
        salaryExpectation: data.salaryExpectation,
        experience: data.experience,
        position: data.position
        // cv: data.cv,
        // photo: data.photo
      },
      ' Cuenta ': {
        email: data.email,
        password: data.password
      },
      ' Estado ': {}
    };
    // Guardar el documento en Firestore con el ID generado por la API
    await setDoc(doc(candidatesRef, nextId.toString()), {
      id: nextId.toString(),
      'Datos Personales': userData['Datos Personales'],
      'Datos Laborales': userData['Datos Laborales'],
      ' Cuenta ': userData[' Cuenta '],
      ' Estado ': userData[' Estado ']
    });

    console.log('API Response:', apiData);

    setMessage('Data saved successfully in your API and Firestore');
    setMessageType('success');
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 8000);
    setPersonalFormValues({});
    setLaboralFormValues({});
    setCuentaFormValues({});
    return nextId.toString();
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const getCandidates = async () => {
  try {
    const querySnapshot = await getDocs(candidatesRef);
    const candidates = [];
    const apiResponse = await axios.get(`http://localhost:8080/api/candidato`);
    console.log('Response from API Update:', apiResponse.data);
    querySnapshot.forEach((doc) => {
      const candidateData = doc.data();
      candidateData.id = doc.id;
      candidates.push(candidateData);
    });

    return candidates;
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

export const updateCandidate = async (docId, data, datafire) => {
  try {
    const apiResponse = await axios.put(`http://localhost:8080/api/candidato/${docId}`, { ...data });
    console.log('Response from API Update:', apiResponse.data);

    if (apiResponse.status === 200) {
      const candidateDoc = await getDoc(doc(candidatesRef, docId));
      if (candidateDoc.exists()) {
        const newData = {
          'Datos Personales': datafire['Datos Personales'],
          'Datos Laborales': datafire['Datos Laborales'],
          ' Cuenta ': datafire[' Cuenta '],
          ' Estado ': datafire[' Estado ']
        };
        await updateDoc(doc(candidatesRef, docId), newData);
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

export const deleteCandidate = async (docId) => {
  try {
    await deleteDoc(doc(candidatesRef, docId));
    console.log('Document successfully deleted');
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};
