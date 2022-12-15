import React from "react";

const Message = (message) =>{
    const clr = getUserColor(message.username);

    function getUserColor(username) {
        let color = 'stone';
        let bright = 400;
        switch (username[0].charCodeAt(0) % 17) {
            case 0:
                color = 'red';
                break;
            case 1:
                color = 'orange';
                break;
            case 2:
                color = 'amber';
                break;
            case 3:
                color = 'yellow';
                break;
            case 4:
                color = 'lime';
                break;
            case 5:
                color = 'green';
                break;
            case 6:
                color = 'emerald';
                break;
            case 7:
                color = 'teal';
                break;
            case 8:
                color = 'cyan';
                break;
            case 9:
                color = 'sky';
                break;
            case 10:
                color = 'blue';
                break;
            case 11:
                color = 'indigo';
                break;
            case 12:
                color = 'violet';
                break;
            case 13:
                color = 'purple';
                break;
            case 14:
                color = 'fuchsia';
                break;
            case 15:
                color = 'pink';
                break;
            case 16:
                color = 'rose';
                break;
        }
        switch (username[0].charCodeAt(1) % 7) {
            case 0:
                bright = 300;
                break;
            case 1:
                bright = 400;
                break;
            case 2:
                bright = 500;
                break;
            case 3:
                bright = 600;
                break;
            case 4:
                bright = 700;
                break;
            case 5:
                bright = 800;
                break;
            case 6:
                bright = 900;
                break;
        }
        return `text-${color}-${bright}`
    }

    if(message.event === 'connection') return (
        <p className='text-slate-400'>user {message.username} connected</p>
    )

    if(message.event === 'get_theme') return (
        <p><b className={clr} >{message.username} </b> obtained new theme: <b>{message.message}</b></p>
    )

    return (
        <p><b className={clr} >{message.username}:</b> {message.message}</p>
    )
}
export default Message;