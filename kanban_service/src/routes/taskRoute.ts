import express from 'express'
import {createTask,getAllTask,updateTask,getTaskById,deleteTask} from '../controllers/taskController'

const router = express.Router();

router.post('/createTask',createTask)
router.get('/getAllTask',getAllTask)
router.put('/updateTask/:id',updateTask)
router.get('/getTaskById/:id',getTaskById)
router.delete('/deleteTask/:id',deleteTask)

export default router;