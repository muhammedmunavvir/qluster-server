import express from "express"
import { asyncErrorhandler } from "../Middlewares/asyncErrorHandler"
import { googleLogin, logedUser, login, logOut, signup } from "../Controllers/userController"
import verifyToken from "../Middlewares/verifyToken"
const router = express.Router()

router.post("/signup",asyncErrorhandler(signup))
// router.get("/verify-email", asyncErrorhandler(verifyEmail)); // New route
router.post("/login",asyncErrorhandler(login))
router.post("/logout",asyncErrorhandler(logOut))
router.get("/userin",verifyToken,asyncErrorhandler(logedUser))
router.post("/google-login", asyncErrorhandler(googleLogin));




export default router
