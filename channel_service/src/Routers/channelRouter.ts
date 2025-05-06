import express from "express";
import { asyncErrorhandler } from "../Middlewares/asyncErrorHandler";
import { addParticipant, createChannel, getChannel, removeParticipant } from "../Controllers/channelControllers";
import verifyToken from "../Middlewares/verifyToken";
const router = express.Router()

router.post("/createchannel",verifyToken,asyncErrorhandler(createChannel))
router.patch("/addParticipant/:channelId",asyncErrorhandler(addParticipant))
router.patch("/removeParticipant/:channelId",asyncErrorhandler(removeParticipant))
router.get("/getchannel/:projectId",verifyToken,asyncErrorhandler(getChannel))

export default router