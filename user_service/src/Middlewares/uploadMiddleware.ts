import cloudinary from "../config/cloudinary"
import multer  from "multer"
import {CloudinaryStorage} from "multer-storage-cloudinary"

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:()=>({
        folder:"Qluster",
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ quality: "auto", fetch_format: "auto" }]
    })
})
const upload = multer( {storage:storage})
module.exports = upload