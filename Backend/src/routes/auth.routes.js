import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { registerValidationRules, validate,loginValidator } from "../validator/validators.js";
import { verifyemail } from "../controllers/auth.controller.js";
import { VerifyLogin } from "../controllers/auth.controller.js";
import { getMe } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";
import { authUserMiddleware} from "../middleware/auth.middleware.js";
import { uploadMiddleware } from "../middleware/upload.middleware.js";


const authRouter = Router();

// Register endpoint with validation middleware
authRouter.post("/register",registerValidationRules(),validate,register);

authRouter.post('/login',loginValidator,VerifyLogin)


authRouter.get('/get-me',authUserMiddleware,getMe)
authRouter.get('/verifyemail',verifyemail)

authRouter.post("/logout", logout);

export default authRouter;