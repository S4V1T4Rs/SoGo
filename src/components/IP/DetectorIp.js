import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from 'api/config/configfire';
import { collection, getDocs, onSnapshot, updateDoc, doc, addDoc, query, where } from 'firebase/firestore';

const IPContainer = styled.div`
  text-align: center;
`;

const IPCard = styled.div`
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-width: 500px;
`;

const IPList = styled.div`
  margin-top: 40px;
`;

const IPComponents = styled.div`
  margin: 20px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-weight: bold;
  margin-top: 20px;
`;

const IPComponent = () => {
  const [currentIP, setCurrentIP] = useState(null);
  const [ips, setIps] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const fetchIPs = async () => {
      try {
        const ipSnapshot = await getDocs(collection(db, 'IPS'));
        const ipList = ipSnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
        setIps(ipList);
      } catch (error) {
        console.error('Error al obtener las IPs:', error);
      }
    };

    const getIPAddress = async () => {
      try {
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        const ipAddress = data.ip;
        setCurrentIP(ipAddress);
        // Verificar si la IP ya está en la base de datos
        const ipQuery = query(collection(db, 'IPS'), where('ip', '==', ipAddress));
        const ipSnapshot = await getDocs(ipQuery);
        const existingIP = ipSnapshot.docs[0];
        if (!existingIP) {
          await addDoc(collection(db, 'IPS'), { ip: ipAddress, active: true });
        } else {
          setIsAuthorized(existingIP.data().active);
        }
      } catch (error) {
        console.error('Error al obtener la IP:', error);
      }
    };

    fetchIPs();
    getIPAddress();

    const unsubscribe = onSnapshot(collection(db, 'IPS'), (snapshot) => {
      const updatedIPs = snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
      setIps(updatedIPs);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleActivation = async (id, active) => {
    try {
      await updateDoc(doc(db, 'IPS', id), { active: !active });
      // No necesitas actualizar el estado de autorización localmente aquí
    } catch (error) {
      console.error('Error al cambiar la activación de la IP:', error);
    }
  };

  if (!isAuthorized) {
    return (
      <IPContainer>
        <h2>No autorizado</h2>
        <ErrorMessage>Lo sentimos, no estás autorizado para acceder a esta página.</ErrorMessage>
      </IPContainer>
    );
  }

  return (
    <IPContainer>
      <IPCard>
        <h2>Tu IP:</h2>
        <p>{currentIP}</p>
      </IPCard>

      <h2>IPs que han accedido a la página:</h2>
      <IPList>
        {ips
          .filter((ipData) => ipData.data.ip !== currentIP) // Filtrar tu propia IP
          .map((ipData) => (
            <IPComponents key={ipData.id}>
              <div>IP: {ipData.data.ip}</div>
              <div>Activa: {ipData.data.active ? 'Sí' : 'No'}</div>
              <button onClick={() => handleToggleActivation(ipData.id, ipData.data.active)}>
                {ipData.data.active ? 'Desactivar' : 'Activar'}
              </button>
            </IPComponents>
          ))}
      </IPList>
    </IPContainer>
  );
};

export default IPComponent;
