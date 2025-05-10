import express from "express"
import { asyncErrorhandler } from "../Middlewares/asyncErrorHandler"
import { getNotePad, updateNotePad } from "../Controllers/notePadControllers"
const router = express.Router()

router.get("/getnotepad/:channelId",asyncErrorhandler(getNotePad))
router.put("/updatenote/:channelId",asyncErrorhandler(updateNotePad))

export default router