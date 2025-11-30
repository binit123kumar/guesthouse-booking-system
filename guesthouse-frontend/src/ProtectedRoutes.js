// File: guesthouse-frontend/src/ProtectedRoutes.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
    // लोकल स्टोरेज से JWT टोकन प्राप्त करें
    const token = localStorage.getItem('token'); 

    // यदि टोकन मौजूद है, तो बच्चों के रूट्स (डैशबोर्ड) को लोड करें
    // यदि टोकन नहीं है, तो लॉगिन पेज पर भेज दें
    return token ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectedRoutes;