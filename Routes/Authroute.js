import express from "express";
import { Loginuser, registerUser } from "../Controllers/authcontroller.js";

const router = express.Router();

// route to register

router.post("/register", registerUser);

// route to login

router.post("/login", Loginuser);

export default router;
