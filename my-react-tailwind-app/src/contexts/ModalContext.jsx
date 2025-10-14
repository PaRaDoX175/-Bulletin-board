import {createContext, useContext, useEffect, useState} from "react";
import CreateAdModal from "../components/CreateAdModal.jsx";
import AuthenticateComponent from "../components/AuthenticateComponent.jsx";
import {modalController} from "../modalController.js";
import {checkJwt} from "../utils/isJwtValid.js";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [showCreate, setShowCreate] = useState(false);
    const [showAuthentication, setShowAuthentication] = useState(false);
    const [onAdCreated, setOnAdCreated] = useState(null);

    useEffect(() => {
        modalController.setOpenAuthModal(() => setShowAuthentication(true))
    }, [])

    const openCreate = (callback) => {
        if (checkJwt()) {
            setOnAdCreated(() => callback)
            setShowCreate(true)
        } else {
            openAuthentication()
        }
    };

    const closeCreate = () => setShowCreate(false);
    const openAuthentication = () => setShowAuthentication(true);
    const closeAuthentication = () => setShowAuthentication(false);

    return (
        <ModalContext.Provider value={{ showCreate, openCreate, closeCreate, openAuthentication, closeAuthentication }}>
            {children}

            {showCreate && checkJwt() && <CreateAdModal onClose={closeCreate} onAdCreated={onAdCreated}/>}
            {showAuthentication && <AuthenticateComponent onClose={closeAuthentication}></AuthenticateComponent>}
        </ModalContext.Provider>
    );
};