// src/api/axiosConfig.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosConfig = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Set your API URL here
    withCredentials: true, // Allows cookies to be sent with requests
});

export default axiosConfig;

