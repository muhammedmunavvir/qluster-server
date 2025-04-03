import express from "express";
import { addComment ,getComments } from "../controllers/commentControllers";

const router = express.Router();


router.post("/addComment",addComment);
router.get("/getComments",getComments);



export default router;