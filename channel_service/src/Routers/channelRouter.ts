import express from "express";
import { asyncErrorhandler } from "../Middlewares/asyncErrorHandler";
import { addParticipant, createChannel, removeParticipant } from "../Controllers/channelControllers";
import verifyToken from "../Middlewares/verifyToken";
const router = express.Router()

router.post("/createchannel",verifyToken,asyncErrorhandler(createChannel))
router.patch("/addParticipant/:channelId",asyncErrorhandler(addParticipant))
router.patch("/removeParticipant/:channelId",asyncErrorhandler(removeParticipant))

export default router