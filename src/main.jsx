
import App from './App.jsx'
import ReactDOM from 'react-dom/client';
import './index.css'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google';
const GOOGLE_CLIENT_ID=import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID





const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>

    <App />
    </GoogleOAuthProvider>
  </Provider>
);