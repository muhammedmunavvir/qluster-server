import express from 'express'
import { createBoard,getBoard,deleteBoard } from '../controllers/boardController';

const router = express.Router();

router.post('/createBoard',createBoard);
router.get('/getBoard/:projectId',getBoard)
router.delete('/deleteBoard/:boardId',deleteBoard)


export default router;