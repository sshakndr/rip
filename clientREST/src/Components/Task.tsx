import {ITask} from "../models";
import React, {useState} from "react";
import axios from "axios";

interface TaskProps {
    task: ITask
    onDelete:(id:number) => void
    onEdit:(task:ITask) => void
}

export function Task({task,onDelete,onEdit}:TaskProps) {
    const [readiness,setReadiness] = useState(task.readiness);
    const [editing,setEditing] = useState(false);
    const [value,setValue] = useState('');

    const btnReadinessClasses = ['py-2 px-4 ml-2 rounded border',readiness?'bg-green-400':'bg-yellow-400'];

    async function check(){
        const response = await axios.put(`http://localhost:5000/api/task/${task.id}`,{},{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}});
        if(response.status===200) setReadiness(prev => !prev);
    }
    async function deleteTask() {
        const response = await axios.delete(`http://localhost:5000/api/task/${task.id}`,{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}});
        if(response.status===200) onDelete(task.id);
    }
    async function editTask(event:React.FormEvent) {
        event.preventDefault();
        if(value.trim().length!==0){
            const response = await axios.put(`http://localhost:5000/api/task`,{text:value,id:task.id},{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}});
            if(response.status===200){
                setEditing(false);
                setValue('');
                onEdit(response.data);
            }
        }

    }

    return(
        <div
            className="border py-2 px4 rounded flex mb-2"
        >
            <button
            className={btnReadinessClasses.join(' ')}
            onClick={()=>{check()}}
            >

            </button>
            {!editing && <p className="ml-2 mr-auto my-1">{task.text}</p>}
            {editing &&
            <form onSubmit={editTask} className="flex w-full">
                <input
                    type="text"
                    className="border py-1 px-4 w-full outline-0 ml-1"
                    placeholder="Enter task..."
                    value={value}
                    onChange={event => setValue(event.target.value)}
                />
                <button
                    className="py-1 px-1 mr-1 ml-1 rounded border-2 border-slate-100"
                    type="submit"
                >
                    save
                </button>
            </form>
            }
            {!editing && <button
                className="py-1 px-1 mr-1 rounded border-2 border-slate-100"
                onClick={() => {setEditing(true)}}
            >
                edit
            </button>}
            <button
                className="py-1 px-1 mr-2 rounded bg-red-300"
                onClick={editing?()=>{setEditing(false)}:deleteTask}
            >
                {editing?'cancel':'delete'}
            </button>
        </div>
    )
}