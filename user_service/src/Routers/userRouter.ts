import express from "express"
import { asyncErrorhandler } from "../Middlewares/asyncErrorHandler"
import { login, logOut, signup } from "../Controllers/userController"
import verifyToken from "../Middlewares/verifyToken"
const router = express.Router()

router.post("/signup",asyncErrorhandler(signup))
// router.get("/verify-email", asyncErrorhandler(verifyEmail)); // New route
router.post("/login",asyncErrorhandler(login))
router.post("/logout",asyncErrorhandler(logOut))
// router.get("/userin",verifyToken,asyncErrorhandler(logedUser))



export default router
