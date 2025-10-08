import Header from "./Header.jsx";
import {useState} from "react";

export default function AuthenticateComponent({ onClose }) {
    const [reg, setReg] = useState(true);
    const [regForm, setRegForm] = useState({
        displayName: "",
        email: "",
        password: "",
    })
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    })
    const baseUrl = 'http://localhost:5197/api/account'


    const submitRegForm = async () => {
        if (regForm.displayName !== "" && regForm.email !== "" && regForm.password !== "") {
            const response = await fetch(baseUrl + '/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(regForm)
            })

            if (response.ok) {
                const user = await response.json();
                localStorage.setItem('accessToken', user.accessToken)
                localStorage.setItem('displayName', user.displayName)
                onClose()
            }
        }
    }

    const submitLoginForm = async (e) => {
        e.preventDefault();
        if (loginForm.email !== "" && loginForm.password !== "") {
            const response = await fetch(baseUrl + '/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(loginForm)
            })

            if (response.ok) {
                const user = await response.json();
                localStorage.setItem('accessToken', user.accessToken)
                localStorage.setItem('displayName', user.displayName)
                onClose()
            }
        }
    }


    return (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4 z-40">
            <div className="bg-white rounded-lg w-full max-w-120 h-120 p-6 text-gray-700">
                <button className="px-4 py-2 rounded border text-gray-700 mb-2" onClick={onClose}>Exit</button>
                <div className="flex justify-around items-center mb-5">
                    <button className="p-2 w-[45%] bg-amber-100" onClick={() => setReg(true)}>Registration</button>
                    <button className="p-2 w-[45%] bg-amber-100" onClick={() => setReg(false)}>Login</button>
                </div>

                <div className="w-[95%] mx-auto h-[85%]">

                    {reg ? (
                            <form className="flex flex-col" onSubmit={submitRegForm}>
                                <input className="p-2" placeholder={"Display name"} type={"text"}
                                       onChange={e =>
                                           setRegForm({...regForm, displayName: e.target.value})}/>

                                <input className="p-2" placeholder={"Email"} type={"text"}
                                       onChange={e =>
                                           setRegForm({...regForm, email: e.target.value})}/>

                                <input className="p-2" placeholder={"Password"} type={"text"}
                                       onChange={e =>
                                           setRegForm({...regForm, password: e.target.value})}/>

                                <button type="submit">Submit</button>
                            </form>

                    ) : (
                           <form className='flex flex-col' onSubmit={submitLoginForm}>
                               <input className="p-2" placeholder={'Email'} type={'text'}
                                      onChange={e =>
                                          setLoginForm({...loginForm, email: e.target.value})}/>
                               <input className="p-2" placeholder={'Password'} type={'password'}
                                      onChange={e =>
                                          setLoginForm({...loginForm, password: e.target.value})}/>

                               <button type={'submit'}>Login</button>
                           </form>
                        )}
                </div>


            </div>
        </div>
    )
}