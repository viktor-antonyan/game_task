import express from "express";
import usersRouter from './users'

let router = express.Router();

/* GET home page. */
router.use('/user', usersRouter)

export default router;
