import express from 'express'
import {createTask,getAllTask,updateTask,getTaskById,deleteTask, updateTaskColumn} from '../controllers/taskController'
import {asyncErrorhandler }from "../middleware/asyncErrorHandler"

const router = express.Router();

router.post('/createTask', asyncErrorhandler(createTask));
router.get('/getAllTask', asyncErrorhandler(getAllTask));
router.put('/updateTask/:id', asyncErrorhandler(updateTask));
router.get('/getTaskById/:id', asyncErrorhandler(getTaskById));
router.delete('/deleteTask/:id', asyncErrorhandler(deleteTask));
router.put('/updateTaskcolumn/:id', asyncErrorhandler(updateTaskColumn));


export default router;