import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { googleLoginOrSignUp, login } from "../../redux/reducers/authSlice";
import toast from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';


function Login() {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleChange = (e) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = {
        email: userInfo.email,
        password: userInfo.password,
      };

      // Dispatch login action
      const actionResult = await dispatch(login(userData));
      const { access } = actionResult.payload;

      // Decode JWT token
      const user = jwtDecode(access);
      toast.success("Login successfully!");

      // Redirect based on user role
      if (user.is_admin) {
        navigate("/user_list");
      } else if (user.is_staff && !user.blocked_for_tasker) {
        navigate("/tasker/profile");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Email or password is incorrect");
      console.error("Login error:", error); // Optional: Log error for debugging
    } finally {
      setLoading(false);
    }
  };

  const continueWithGoogle = async (data) => {
    setLoading(true)
    try {
      const res  = await dispatch(googleLoginOrSignUp(data));
      setLoading(false)
    } catch (err) {
      console.log(err);
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 bg-white p-8 rounded-lg shadow-md w-full max-w-md flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-3 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="pt-3 flex justify-center">
          <GoogleLogin
            onSuccess={credentialResponse => {
              // console.log(credentialResponse);`
              continueWithGoogle(credentialResponse)
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            size="large"
            shape="circle"
            width={300}

          />
        </div>
        <p className="mt-2 text-center block text-sm font-medium leading-6 text-gray-900">
          Don't have an account?{" "}
          <span
            className="text-blue-700 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
