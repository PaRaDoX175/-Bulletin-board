import {Menu, User, Plus } from "lucide-react";
import {Link, useNavigate} from 'react-router-dom'
import React, {useContext} from "react";
import {ModalContext} from "../contexts/ModalContext.jsx";
import {isJwtValid} from "../utils/isJwtValid.js";

export default function Header() {
    const { openCreate } = useContext(ModalContext)
    const { openAuthentication } = useContext(ModalContext)
    const navigate = useNavigate()

    const checkToken = () => {
        const isValid = isJwtValid(localStorage.getItem('accessToken'))
        if (isValid) {
            navigate('/profile')
        }
    }

    return (
    <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded grid place-items-center font-bold">B</div>
            <Link to={'/'}><h1 className="text-xl font-semibold text-gray-800">Bulletin Board</h1></Link>
        </div>

        <div className="hidden md:flex items-center gap-3 text-gray-700">
          {/*<button onClick={openCreate(() => )} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2">*/}
          {/*  <Plus />Create*/}
          {/*</button>*/}
          <div className="p-2" >
              {localStorage.getItem('displayName') !== null ? (
                  <div onClick={checkToken} className="w-8 h-8 bg-blue-600 text-white rounded grid place-items-center font-bold">{localStorage.getItem('displayName')[0]}</div>
              ) : (
                <User onClick={openAuthentication} />
              )}
              </div>
        </div>

        <div className="md:hidden text-gray-700">
          <Menu />
        </div>
      </div>
    </header>
  );
}
