import express from "express"
import { asyncErrorhandler } from "../Middlewares/asyncErrorHandler"
import { editProfie, googleLogin, logedUser, login, logOut, OthersProfile, signup,  } from "../Controllers/userController"
import verifyToken from "../Middlewares/verifyToken"
import upload from "../Middlewares/uploadMiddleware"
const router = express.Router()

router.post("/signup",asyncErrorhandler(signup))
// router.get("/verify-email", asyncErrorhandler(verifyEmail)); // New route
router.post("/login",asyncErrorhandler(login))
router.post("/logout",asyncErrorhandler(logOut))
router.get("/userin",verifyToken,asyncErrorhandler(logedUser))
router.post("/google-login", asyncErrorhandler(googleLogin));
router.put("/editprofile",verifyToken,upload.fields([{name:"profilePicture",maxCount:1},{name:"coverImage",maxCount:1}]), asyncErrorhandler(editProfie));
router.get("/others-profile/:userId",verifyToken,asyncErrorhandler(OthersProfile))





export default router
