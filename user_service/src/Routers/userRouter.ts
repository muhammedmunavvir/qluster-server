import express from "express"
import { asyncErrorhandler } from "../Middlewares/asyncErrorHandler"
import { login, signup } from "../Controllers/userController"
const router = express.Router()

router.post("/signup",asyncErrorhandler(signup))
router.post("/login",asyncErrorhandler(login))


export default router
