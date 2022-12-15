import {Request,Response} from 'express';
import {pool} from "../db";
import {sign} from "jsonwebtoken";

const secretKey = 'rip8';

class UserController {

    public async createTask(req:Request,res:Response){
        const {text,user} = req.body;
        const newTask = await pool.query(`INSERT INTO tasks (text,readiness,user_id) values ($1,$2,$3) RETURNING *`, [text,false,user.id]);
        return res.json(newTask.rows[0]);
    }
    public async deleteTask(req:Request,res:Response){
        const id = req.params.id;
        const {user} = req.body;
        let tasks = await pool.query(`SELECT FROM tasks where id = $1 and user_id = $2`,[id,user.id]);
        if(!tasks.rows[0]) return res.status(204).json({message:'not found'});
        tasks = await pool.query(`DELETE FROM tasks where id = $1 and user_id = $2`,[id,user.id]);
        return res.json(tasks.rows[0]);
    }
    async getTasks(req:Request,res:Response){
        const {user} = req.body;
        const tasks = await pool.query(`SELECT * FROM tasks where user_id = $1`,[user.id]);
        return res.json(tasks.rows);
    }
    public async editTask(req:Request,res:Response){
        const {id,text,user} = req.body;
        let tasks = await pool.query(`SELECT FROM tasks where id = $1 and user_id = $2`,[id,user.id]);
        if(!tasks.rows[0]) return res.status(204).json({message:'not found'});
        const task = await pool.query(`UPDATE tasks set text = $1 where id = $2 and user_id = $3 RETURNING *`,[text,id,user.id]);
        return res.json(task.rows[0]);
    }
    public async checkTask(req:Request,res:Response){
        const id = req.params.id;
        const {user} = req.body;
        let tasks = await pool.query(`SELECT FROM tasks where id = $1 and user_id = $2`,[id,user.id]);
        if(!tasks.rows[0]) return res.status(204).json({message:'not found'});
        const task = await pool.query(`UPDATE tasks set readiness = NOT readiness where id = $1 and user_id = $2 RETURNING *`,[id,user.id]);
        return res.json(task.rows[0]);
    }
    public async register(req:Request,res:Response){
        const {email,pswd} = req.body;
        const usr = await pool.query('SELECT * FROM users where email = $1',[email]);
        if(usr.rows[0]) return res.status(208).json({message:'already exists'});
        const user = await pool.query('INSERT INTO users (email,pswd) VALUES ($1,$2) RETURNING *',[email,pswd]);
        return res.json({message:'user created'});
    }
    public async login(req:Request,res:Response){
        const {email,pswd} = req.body;
        const user = await pool.query('SELECT * FROM users where email = $1',[email]);
        if(!user.rows[0]) return res.status(203).json({message:'invalid user'});
        if(user.rows[0].pswd===pswd){
            const token = sign({id: user.rows[0].id},secretKey);
            return res.json({
                token,
                user:{
                    id: user.rows[0].id,
                    email: user.rows[0].email
                }
            });
        }
        else return res.status(203).json({message:'invalid password'});
    }
    public async auth(req:Request,res:Response){
        const user = await pool.query('SELECT * FROM users where id = $1',[req.body.user.id]);
        if(!user.rows[0]) return res.status(203).json({message:'invalid user'});
        const token = sign({id: user.rows[0].id},secretKey);
        return res.json({
            token,
            user:{
                id: user.rows[0].id,
                email: user.rows[0].email
            }
        });
    }
}

export {UserController}