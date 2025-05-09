import express from "express"
import verifyToken from "../Middlewares/verifyToken"
import { asyncErrorhandler } from "../Middlewares/asyncErrorHandler"
import { endorseSkill, getUserEndorsements, removeEndorsement } from "../Controllers/endorsementController"
const router = express.Router()


router.post("/endorse/:userId", verifyToken, asyncErrorhandler(endorseSkill))
router.post("/remove-endorsement/:userId", verifyToken, asyncErrorhandler(removeEndorsement))
router.get("/endorsements/:userId", verifyToken,asyncErrorhandler(getUserEndorsements))


export default router