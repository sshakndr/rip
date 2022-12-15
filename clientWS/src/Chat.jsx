import React, {useRef, useState} from "react";
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from "./Message";
import colorsall from "./colors";

const Chat = () =>{
    const [messages,setMessages] = useState([]);
    const [value,setValue] = useState('');
    const [connected,setConnected] = useState(false);
    const [username,setUsername] = useState('');
    const socket = useRef();

    const secretweapon = colorsall.join(' ');

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000');
        socket.current.onopen = () =>{
            setConnected(true);
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message));
        }
        socket.current.onmessage = (event) =>{
            const message = JSON.parse(event.data);
            setMessages(prev => [...prev,message]);

        }
        socket.current.onclose = () =>{
            console.log('Closed');
        }
        socket.current.onerror = () =>{
            console.log('Error');
        }
    }

    function sendMessage() {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        if (value.trim().startsWith('/nt')) {
            message.event = 'new_theme';
            message.message = value.replace('/nt','');
        }
        if (value.trim().startsWith('/t')) {
            message.event = 'get_theme';
            message.message = value.replace('/t','');
        }
        socket.current.send(JSON.stringify(message));
        setValue('');
    }



    if(!connected){
        return (
            <div className='w-full h-full'>
                <p className='text-center text-2xl font-bold mt-32 text-red-400'>One_Chat</p>
                <form
                    className='mx-auto my-4 w-min px-4 py-2 border rounded'
                    onSubmit={async (event) => {
                    event.preventDefault();
                    if(username.trim().length!==0)connect();
                    else setUsername('');
                    }}
                >
                    <input
                        type='text'
                        placeholder='Enter your name'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        autoFocus
                        className='outline-0 border rounded'
                    />
                    <button type='submit' className='mx-16 border rounded mt-2'>Login</button>
                </form>
                <p className={secretweapon}></p>
            </div>
        )
    }

    return(
        <div className='h-full flex flex-col' id='box'>
            <ScrollToBottom className='border rounded h-full overflow-scroll overflow-x-hidden overflow-y-hidden px-2 pb-4'>
                {messages.map(mess =>
                    <div key={mess.id}>

                        <Message message={mess.message} event={mess.event} username={mess.username}/>
                    </div>
                )}
            </ScrollToBottom>
            <div className='my-2'>
                <form
                    className='mx-auto flex'
                    onSubmit={async (event) => {
                        event.preventDefault();
                        if(value.trim().length!==0) sendMessage();
                    }}
                >
                    <input
                        value={value}
                        onChange={e=>setValue(e.target.value)}
                        type='text'
                        autoFocus
                        className='w-full mr-2 outline-0 border rounded'
                    />
                    <button type='submit' className='rounded bg-blue-200 px-2'>Send</button>
                </form>

            </div>
        </div>
    );
}

export default Chat;