import React, { useContext } from 'react';
import { NotificationContext } from '../../context/DataContext';

const NotificationList = () => {
  const { notifications } = useContext(NotificationContext);

  return (
    <div className="notification-list">
      <h2>Notificaciones</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;