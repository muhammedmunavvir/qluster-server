import cloudinary from "../config/cloudinary"
import multer  from "multer"
import {CloudinaryStorage} from "multer-storage-cloudinary"

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:()=>({
        folder:"Qluster",
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ quality: "auto:eco",fetch_format: "auto", width: 1024,crop: "limit"}]
    })
})
const upload = multer( {storage:storage})
export default upload