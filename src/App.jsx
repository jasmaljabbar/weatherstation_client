import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './redux/reducers/authSlice';
import HomePage from './Components/user_side/Home';
import Register from './Components/user_side/Register';
import Login from './Components/user_side/Login';
import { Toaster } from 'react-hot-toast';
import NotFound from './Components/common/NotFount';
import UserLayout from './Components/user_side/UserLayout';
import UserList from './Components/admin_side/UserList';
import Weather from './Components/weather/Weather';
import AdminLayout from './Components/admin_side/AdminLayout';

const ProtectedRoute = ({ element, isAuthenticated, redirectTo }) => {
  return isAuthenticated ? element : <Navigate to={redirectTo} replace />;
};

function App() {
  const [user, setUser] = useState(null);
  const accessToken = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const userObject = userString ? JSON.parse(userString) : null;
  
  console.log(userObject);
  console.log(userObject?.is_admin);
  
  const dispatch = useDispatch();
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  useEffect(() => {
    const authenticateUser = async () => {
      if (accessToken) {
        try {
          const decodedUser = jwtDecode(accessToken);
          await setUser(decodedUser);

          // Dispatch the login action and await the result
          await dispatch(login({ accessToken }));
          
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
        }
      }
    };

    authenticateUser();
  }, [accessToken, dispatch]);

  console.log('isAuthenticated:', isAuthenticated);
  if(user){
    console.log(user);
  }
  console.log(user);

  return (
    <>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route
            path="/register"
            element={
              <ProtectedRoute
                element={<Register />}
                isAuthenticated={!isAuthenticated}
                redirectTo="/"
              />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<UserLayout />}
                isAuthenticated={isAuthenticated}
                redirectTo="/login"
              />
            }
          >
            <Route index element={<Weather/>}/>
          </Route>
          <Route
            path="/user_list"
            element={
              <ProtectedRoute
                element={< AdminLayout/>}
                isAuthenticated={userObject?.is_admin}
                redirectTo="/"
              />
            }
          >
             <Route index element={<UserList />} />
          </Route>
          <Route
            path="/login"
            element={
              <ProtectedRoute
                element={<Login />}
                isAuthenticated={!isAuthenticated}
                redirectTo="/"
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;