import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './redux/store.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                style: {
                    borderRadius: '50px',
                    background: '#333',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 400,
                },
            }}
        />
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
)
