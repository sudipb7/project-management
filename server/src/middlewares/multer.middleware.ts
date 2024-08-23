import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.memoryStorage();

export const upload = multer({ storage });
