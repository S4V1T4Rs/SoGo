import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/notificaciones'); // Endpoint para obtener las notificaciones
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Notificaciones de Correos Leídos</h2>
      <table>
        <thead>
          <tr>
            <th>Correo Electrónico</th>
            <th>Fecha de Lectura</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification.id}>
              <td>{notification.email}</td>
              <td>{notification.readDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Notifications;
