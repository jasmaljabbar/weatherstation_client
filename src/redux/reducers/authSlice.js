import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from '../actions/authService';
import {jwtDecode} from 'jwt-decode';
import { CLIENT_API } from '../../axios';

const user = JSON.parse(localStorage.getItem('user'));
const token = JSON.parse(localStorage.getItem('token'));
const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));

const initialState = {
    user: user ? user : null,
    isError: false,
    isLoading: false,
    isAuthenticated: !!user,
    isAdmin: user ? user.isadmin : false,
    is_staff: user ? user.is_staff : false,
    isSuccess: false,
    requested_to_tasker: false,
    token: token ? token : null,
    refreshToken: refreshToken ? refreshToken : null,
    message: '',
    taskerDetails: null, // Add this for tasker details
    google_auth_success:false,
};

export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            return await authService.register(userData);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
    try {
        return await authService.login(user);
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const admin_login = createAsyncThunk("auth/admin_login", async (user, thunkAPI) => {
    try {
        return await authService.admin_login(user);
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const googleLoginOrSignUp = createAsyncThunk(
    'auth/googleAuthentication',
    async (userCredentials, thunkAPI) => {
      try {
        console.log(userCredentials,'....,,,,,,.......');
        
        const response = await CLIENT_API.post('/account/google/', userCredentials);
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errors[0]?.message || "An unknown error occurred");
  }
  }
  );



export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
        try {
            await authService.logout();
            localStorage.removeItem('user');
            localStorage.clear();
            return true;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateToken(state, action) {
            state.token = action.payload;
            const updatedUser = { ...state.user, accessToken: action.payload };
            state.user = updatedUser;
            localStorage.setItem('user', JSON.stringify(updatedUser));
        },
        setInitialState(state, action) { // Correctly define setInitialState
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isadmin = action.payload.isadmin;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = action.payload;
                state.token = action.payload.access;
                state.refreshToken = action.payload.refresh;
                state.isSuccess = true;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.isSuccess = false;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(login.fulfilled, (state, action) => {
                const user = jwtDecode(action.payload.access);
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = user;
                state.token = action.payload.access;
                state.refreshToken = action.payload.refresh;
                state.is_staff = user.is_staff;
                state.isAdmin = user.is_admin;
                state.requested_to_tasker = user.requested_to_tasker;
                state.profile_photo = user.profile_photo; // Add profile photo
                state.username = user.username; // Add username
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', JSON.stringify(action.payload.access));
                localStorage.setItem('refreshToken', JSON.stringify(action.payload.refresh));
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.isSuccess = false;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.token = null;
                state.refreshToken = null;
                state.user = null;
                state.isSuccess = true;
                state.isAdmin = false;
                localStorage.clear();
            })
            .addCase(logout.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
                state.isSuccess = false;
            }).addCase(googleLoginOrSignUp.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(googleLoginOrSignUp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.google_auth_success = true;
                console.log(action.payload.user);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                localStorage.setItem('token', JSON.stringify(action.payload.access));
                localStorage.setItem('refreshToken', JSON.stringify(action.payload.refresh));
            })  
            .addCase(googleLoginOrSignUp.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { updateToken, setInitialState } = authSlice.actions;
export default authSlice.reducer;
