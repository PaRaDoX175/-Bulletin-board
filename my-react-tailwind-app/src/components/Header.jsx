import {Menu, User, Plus } from "lucide-react";
import { Link } from 'react-router-dom'
import CreateAdModal from "./CreateAdModal.jsx";
import React, {useState} from "react";

export default function Header({ setShowAuthentication, openCreate }) {


    return (
    <header className="bg-white shadow fixed top-0 left-0 w-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded grid place-items-center font-bold">B</div>
            <Link to={'/'}><h1 className="text-xl font-semibold text-gray-800">Bulletin Board</h1></Link>
        </div>

        <div className="hidden md:flex items-center gap-3 text-gray-700">
          {/*<button className="px-3 py-1 rounded hover:bg-gray-100" onClick={() => setActiveTab("home")}>Home</button>*/}
          {/*<button className="px-3 py-1 rounded hover:bg-gray-100" onClick={() => setActiveTab("myads")}>My Ads</button>*/}
          <button onClick={openCreate} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2">
            <Plus />Create
          </button>
          <div className="p-2" >
              {/*<Link to={'/authentication'}><User /></Link>*/}
              {localStorage.getItem('displayName') !== null ? (
                  <Link to={'/profile'}>
                      <div className="w-8 h-8 bg-blue-600 text-white rounded grid place-items-center font-bold">{localStorage.getItem('displayName')[0]}</div>
                  </Link>

              ) : (
                <User onClick={() => setShowAuthentication(true)} />
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
