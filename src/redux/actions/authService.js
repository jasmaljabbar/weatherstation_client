import axios from 'axios';

// export const API_URL = 'http://127.0.0.1:8000/account/api/';

// export const API = 'http://127.0.0.1:8000/account/';

export const BASE_URL = 'http://127.0.0.1:8000/'
export const B_URL = 'http://127.0.0.1:8000'

// export const API_URL_PROFIL = 'http://127.0.0.1:8000/profiles/'

// export const API_URL_ADMIN = 'http://127.0.0.1:8000/adminside/'

const register = async (userData) => {
    try {
        const response = await axios.post(BASE_URL + 'account/api/register/', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

const login = async (userData) => {
    try {
        console.log("Sending userData:", userData);  // Log request payload
        const response = await axios.post(`${BASE_URL}account/api/login/`, userData);
        console.log("Login successful", response.data);
        return response.data;
    } catch (error) {
        console.error("Login failed", error.response ? error.response.data : error);
        throw error.response ? error.response.data : error;
    }
};




const admin_login = async (userData) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await axios.post(BASE_URL + 'adminside/admin_login/', userData, config);
       
        if (response.data) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};



const logout = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
        if (user && user.refreshToken) {
            await axios.post(
                BASE_URL + 'account/api/logout/',
                { refreshToken: user.refreshToken },
                {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                    },
                }
            );
        }
    } catch (error) {
        throw error.response ? error.response.data : error;
    } finally {
        localStorage.removeItem('user');
    }
};




const authService = {
    register,
    login,
    admin_login,
    logout,
};

export default authService;
