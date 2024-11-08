import express from 'express';
import { addFood, listFood, removeFood, updateFood, topSeller } from '../controller/foodController.js';
import multer from 'multer';


const foodRouter = express.Router();

// Image storage engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
});

const upload = multer({ storage: storage });

foodRouter.post("/", upload.single("image"), addFood);
foodRouter.get("/", listFood);
foodRouter.delete("/:id", removeFood);
foodRouter.put("/:id", upload.single("image"), updateFood);
foodRouter.get("/topseller", topSeller);


export default foodRouter       