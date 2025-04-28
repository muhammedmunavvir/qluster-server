import express from 'express'
import {createTask,getAllTask,updateTask,getTaskById,deleteTask} from '../controllers/taskController'
import {asyncErrorhandler }from "../middleware/asyncErrorHandler"

const router = express.Router();

router.post('/createTask',asyncErrorhandler(createTask))
router.get('/getAllTask',getAllTask)
router.put('/updateTask/:id',updateTask)
router.get('/getTaskById/:id',getTaskById)
router.delete('/deleteTask/:id',deleteTask)

export default router;