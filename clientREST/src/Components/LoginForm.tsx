import React,{useState} from "react";
import axios from "axios";
import {IUserInfo} from "../models";

interface LoginFormProps {
    onLogin:(userInfo:IUserInfo)=>void
}

export function LoginForm({onLogin}:LoginFormProps) {
    const [errmsg,setErrmsg] = useState('');
    const [error,setError] = useState(false);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    async function login(email:string,password:string) {
        const response = await axios.post(`http://localhost:5000/api/login`,{
            email:email,
            pswd:password
        });
        if(response.status===200){
            onLogin(response.data)
        }
        else{
            setError(true);
            setErrmsg(response.data.message);
        }
    }

    async function register(email:string,password:string) {
        const response = await axios.post(`http://localhost:5000/api/register`,{
            email:email,
            pswd:password
        });
        if(response.status===200){
            const res = await axios.post(`http://localhost:5000/api/login`,{
                email:email,
                pswd:password
            });
            if(res.status===200){
                onLogin(res.data)
            }
        }
        else{
            setError(true);
            setErrmsg(response.data.message);
        }
    }

    return(
        <div className='mx-auto rounded border'>
            <p className='text-center my-2'>Login/Rerister</p>
            <div className='flex flex-col'>
                <input
                className='mx-auto outline-0 w-6/12 border mb-2'
                placeholder=""
                value={email}
                onChange={event => setEmail(event.target.value)}
                />
                <input
                className='mx-auto outline-0 w-6/12 border'
                placeholder=""
                value={password}
                onChange={event => setPassword(event.target.value)}
                />
                {error && <p className="text-center mt-1 text-red-500 test-sm">{errmsg}</p>}
                <div className='mx-auto my-2'>
                    <button
                    className='bg-green-300 rounded px-1 mr-2'
                    onClick={()=>{login(email, password)}}
                    >Login</button>
                    <button
                    className='border rounded px-1'
                    onClick={()=>{register(email, password)}}
                    >Register</button>
                </div>
            </div>
        </div>
    )
}