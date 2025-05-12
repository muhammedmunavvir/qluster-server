//settings
//change email and password etc

import { changePassword } from '../Controllers/password.controller';
import verifyToken from '../Middlewares/verifyToken';

import express from 'express'

const router = express.Router();

router.put('/change-password',verifyToken ,changePassword)


export default router