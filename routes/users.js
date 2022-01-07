import express from "express";
import {User} from "../controllers/User";
import multer from "multer";
import roleAccess from "../middlewares/role";

let router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

/* role => users. */
router.post('/register', upload.single('avatar'), User.register)
router.post('/login', User.login)
router.post('/start-game', User.startGame)
router.post('/help-50-50', User.help_50)
router.get('/hall-help', User.hallHelp)
router.get('/game-statistics', User.gameStatistics)
router.get('/best-players', User.bestPlayers)

/* role => admin. */
router.post('/add-questions', roleAccess('admin'), User.addQuestions)
router.get('/question', roleAccess('admin'), User.getQuestions)
router.delete('/question/:id', roleAccess('admin'), User.deleteQuestion)
router.delete('/:id', roleAccess('admin'), User.deleteUser)
router.get('/stats', roleAccess('admin'), User.userStats)

export default router;
