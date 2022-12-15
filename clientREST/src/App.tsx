import React, {useEffect, useState} from 'react';
import {Task} from "./Components/Task";
import {LoginForm} from "./Components/LoginForm";
import {ITask,IUserInfo} from "./models";
import axios from "axios";

function App() {
    const [auth,setAuth] = useState(false);
    const [tasks,setTasks] = useState<ITask[]>([]);
    const [loading,setLoading] = useState(false);
    const [creating,setCreating] = useState(false);
    const [value,setValue] = useState('')

    function deleteTask(id:number){
        let tsk = tasks;
        let index:number = -1;
        for(let i=0;i<tsk.length;i++) if(tsk[i].id===id){
            index=i;
            break;
        }
        return index;
    }

    async function fetchTasks(){
        setLoading(true);
        const response = await axios.get<ITask[]>('http://localhost:5000/api/task',
            {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}});
        setTasks(response.data);
        setLoading(false);
    }

    const deleteHandler = (id:number) =>{
        let index = deleteTask(id);
        setTasks([...tasks.slice(0, index), ...tasks.slice(index + 1)])
    }
    const submitHandler = async (event:React.FormEvent) =>{
        event.preventDefault();
        if(value.trim().length!==0){
            const response = await axios.post('http://localhost:5000/api/task',{text:value},{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}});
            if(response.status===200) setTasks(prev => [...prev,response.data]);
            setValue('');
            setCreating(false);
        }
    }
    const editHandler = async (task:ITask) => {
        let index = -1;
        for(let i=0;i<tasks.length;i++){
            if(tasks[i].id===task.id) index = i;
        }
        setTasks([...tasks.slice(0, index), task,...tasks.slice(index + 1)]);
    }
    const loginHandler = (userInfo:IUserInfo) =>{
        setAuth(true);
        const token = userInfo.token;
        localStorage.setItem('token',token);
        fetchTasks();
    }

    const authHandler = async (token: string) => {
        const response = await axios.get<IUserInfo>('http://localhost:5000/api/auth',
            {headers: {Authorization: `Bearer ${token}`}});
        if(response.status===200){
            localStorage.setItem('token',response.data.token);
            setAuth(true);
            fetchTasks();
        }
    }

    function logout(){
        localStorage.removeItem('token');
        setAuth(false);
        setTasks([]);
    }

    useEffect(()=>{
        const token = localStorage.token;
        if(token!==undefined) authHandler(token);
    },[])
  return (
      <div className="static">
          <div className="container mx-auto max-w-2xl pt-5">
              <h1 className="text-center text-2xl font-bold mb-5">TODO_LIST</h1>
              {loading && <p>Loading...</p>}
              {!auth && <LoginForm onLogin={loginHandler}/>}
              {auth && tasks.map(tasks => {
                  return <Task task={tasks} onDelete={deleteHandler} onEdit={editHandler} key={tasks.id}/>
              })}
              {auth && !creating && <button
                  className="rounded border border-2 border-slate-100 py-1 px-3"
                  onClick={()=>{setCreating(prev => !prev)}}
              >
                  +
              </button>}
              {auth && creating && <div
                  className="border py-2 px4 rounded flex justify-start mb-2"
              >

                  <form onSubmit={submitHandler} className="flex w-full">
                      <input
                          type="text"
                          className="border py-1 px-4 ml-1 w-full outline-0"
                          placeholder="Enter task..."
                          value={value}
                          onChange={event => setValue(event.target.value)}
                      />
                      <button
                          className="py-1 px-1 mr-1 ml-1 rounded border-2 border-slate-100 flex-none"
                          type="submit"
                      >
                          create
                      </button>
                  </form>
                  <button
                      className="py-1 px-1 mr-2 rounded bg-red-300"
                      onClick={()=>{setCreating(prev => !prev)}}
                  >
                      cancel
                  </button>
              </div>}
          </div>
          {auth && <button
              className="absolute right-2 top-2 border rounded px-1"
              onClick={logout}
          >exit</button>}
      </div>
  );
}

export default App;
