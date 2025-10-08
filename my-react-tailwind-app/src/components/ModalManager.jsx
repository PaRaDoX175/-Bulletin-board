import {createPortal} from "react-dom";

export default function ModalManager({ children }) {
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            {children}
        </div>,
        document.body
    );
}