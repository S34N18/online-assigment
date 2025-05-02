import React from 'react';
import Sidebar from './Sidebar';

const ProtectedLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '220px', padding: '2rem', width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;
