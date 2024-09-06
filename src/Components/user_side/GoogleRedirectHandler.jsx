import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { googleAuthenticate } from '../features/auth/authSlice';

const GoogleRedirectHandler = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const state = urlParams.get('state');
    const code = urlParams.get('code');

    if (state && code) {
      dispatch(googleAuthenticate({ state, code }));
    }
  }, [dispatch, location]);

  return null; // or a loading spinner
};

export default GoogleRedirectHandler;
