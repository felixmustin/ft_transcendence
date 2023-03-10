import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './form.css';

function Disconnect({ getToken, deleteToken }) {

  const navigate = useNavigate();

    useEffect(() => {
        deleteToken();
        navigate('/');
      }, [])
}

export default Disconnect;
