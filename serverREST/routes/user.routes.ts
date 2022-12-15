import {Router} from "express";
import {UserController} from "../controller/user.controller";
const userController = new UserController();
const authMiddleware = require("../middleware/auth.middleware");

const router:Router = Router();

router.post('/task',authMiddleware, function(req, res){
    userController.createTask(req,res)
});
router.get('/task',authMiddleware, function(req, res){
    userController.getTasks(req,res)
});
router.put('/task',authMiddleware, function(req, res){
    userController.editTask(req,res)
});
router.put('/task/:id',authMiddleware, function(req, res){
    userController.checkTask(req,res)
});
router.delete('/task/:id',authMiddleware, function(req, res){
    userController.deleteTask(req,res)
});
router.post('/register',function (req,res) {
    userController.register(req,res)
});
router.post('/login',function (req,res) {
    userController.login(req,res)
});
router.get('/auth',authMiddleware,function (req,res) {
    userController.auth(req,res)
});

export {router}