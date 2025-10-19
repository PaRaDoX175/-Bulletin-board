import {StrictMode, useEffect} from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ProfileComponent from './components/ProfileComponent.jsx'
import AuthenticateComponent from "./components/AuthenticateComponent.jsx";
import {ModalProvider} from "./contexts/ModalContext.jsx";
import {MantineProvider} from "@mantine/core";
import {useHotkeys, useLocalStorage} from "@mantine/hooks";
import Favorites from "./components/Favorites.jsx";

const router = createBrowserRouter([
    { path: '/', element: <App/> },
    { path: '/profile', element: <ProfileComponent/>},
    { path: '/favorites', element: <Favorites/> }
])

function Root() {
    const [colorScheme, setColorScheme] = useLocalStorage({
        key: "mantine-color-scheme",
        defaultValue: "light",
    });

    const toggleColorScheme = (value) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

    useHotkeys([["mod+J", () => toggleColorScheme()]]);

    useEffect(() => {
        if (colorScheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [colorScheme]);

    return (
        <MantineProvider
            theme={{ colorScheme }}
            withGlobalStyles
            withNormalizeCSS
        >
            <ModalProvider>
                <RouterProvider router={router} />
            </ModalProvider>
        </MantineProvider>
    );
}

createRoot(document.getElementById('root')).render(

    <StrictMode>
        <Root />
    </StrictMode>

)
