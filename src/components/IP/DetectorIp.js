import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from 'api/config/configfire';
import { collection, getDocs, onSnapshot, updateDoc, doc, addDoc, query, where } from 'firebase/firestore';
import { isMobile } from 'react-device-detect';

const IPContainer = styled.div`
  text-align: center;
`;

const IPCard = styled.div`
  margin: 20px auto;
  padding: 20px;
  border-radius: 20px;
  background-color: #f0f0f0;
  box-shadow:
    10px 10px 20px #c7c7c7,
    -10px -10px 20px #ffffff;
  max-width: 500px;
`;

const IPCardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const DeviceIcon = styled.span`
  font-size: 44px;
`;

const IPList = styled.div`
  margin-top: 40px;
`;

const IPComponents = styled.div`
  padding: 15px;
  border-radius: 15px;
  background-color: #f0f0f0;
  box-shadow:
    5px 5px 10px #c7c7c7,
    -5px -5px 10px #ffffff;
`;

const ErrorMessage = styled.div`
  color: red;
  font-weight: bold;
  margin-top: 20px;
`;

const ToggleButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const ShutdownButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f44336;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d32f2f;
  }
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
        const ipv4Local = ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.') || ipAddress.startsWith('172.');
        setCurrentIP(ipAddress);

        if (ipv4Local) {
          // Guardar la dirección IPv4 local en la base de datos
          await addDoc(collection(db, 'LocalIPs'), { ip: ipAddress });
        }

        // Verificar si la IP ya está en la base de datos
        const ipQuery = query(collection(db, 'IPS'), where('ip', '==', ipAddress));
        const ipSnapshot = await getDocs(ipQuery);
        const existingIP = ipSnapshot.docs[0];
        if (!existingIP) {
          await addDoc(collection(db, 'IPS'), { ip: ipAddress, active: true, deviceType: isMobile ? 'mobile' : 'pc' });
        } else {
          setIsAuthorized(existingIP.data().active);
        }

        // Obtener coordenadas de geolocalización
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            // Guardar las coordenadas en la base de datos
            await updateDoc(doc(db, 'IPS', existingIP.id), { latitude, longitude });
          });
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
  const handleShutdown = async (ip) => {
    try {
      // Envía la dirección IP al servidor para apagar el dispositivo correspondiente
      const response = await fetch(`http://localhost:8080/api/shutdown`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ip })
      });
      if (response.ok) {
        console.log('La solicitud de apagado fue exitosa');
      } else {
        console.error('Error en la solicitud de apagado:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud de apagado:', error);
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
        <IPCardContent>
          <div>
            <h2>Tu IP:</h2>
            <p>{currentIP}</p>
          </div>
          <DeviceIcon>{isMobile ? '📱' : '💻'}</DeviceIcon>
        </IPCardContent>
      </IPCard>

      <h2>IPs que han accedido a la página:</h2>
      <IPList>
        {ips
          .filter((ipData) => ipData.data.ip !== currentIP) // Filtrar tu propia IP
          .map((ipData) => (
            <IPComponents key={ipData.id}>
              <div>IP: {ipData.data.ip}</div>
              <div>Activa: {ipData.data.active ? 'Sí' : 'No'}</div>
              <div>Latitud: {ipData.data.latitude}</div>
              <div>Longitud: {ipData.data.longitude}</div>
              <DeviceIcon>{ipData.data.deviceType === 'mobile' ? '📱' : '💻'}</DeviceIcon>
              <ToggleButton onClick={() => handleToggleActivation(ipData.id, ipData.data.active)}>
                {ipData.data.active ? 'Desactivar' : 'Activar'}
              </ToggleButton>
              <ShutdownButton onClick={() => handleShutdown(ipData.id, ipData.data.ip)}>Apagar</ShutdownButton>
            </IPComponents>
          ))}
      </IPList>
    </IPContainer>
  );
};

export default IPComponent;
