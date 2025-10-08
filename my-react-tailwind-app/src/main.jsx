import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ProfileComponent from './components/ProfileComponent.jsx'
import AuthenticateComponent from "./components/AuthenticateComponent.jsx";
import {ModalProvider} from "./contexts/ModalContext.jsx";

const router = createBrowserRouter([
    { path: '/', element: <App/> },
    { path: '/profile', element: <ProfileComponent/>}
])

createRoot(document.getElementById('root')).render(

      <StrictMode>
          <ModalProvider>
            <RouterProvider router={router}/>
          </ModalProvider>
      </StrictMode>,

)
