import express from 'express'
import { getColumsByBoard ,createColumn,renameColumn,reOrderColumn} from '../controllers/column.controller';

const router = express.Router();


router.get('/getColumsByBoard/:boardId',getColumsByBoard);
router.post('/createColumn',createColumn);
router.put('/renameColumn/:columnId',renameColumn);
router.put('/reOrderColumn',reOrderColumn);
 


export default router;