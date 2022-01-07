import {UserService} from "../services/User";
import {imageUpload} from "../utils/imgUpload";

export class User {
    static async register(req, res, next) {
        try {
            const {role, name, email, password} = req.body
            const {file} = req
            const fileName = imageUpload(file)
            const user = await UserService.register(role, name, email, password, fileName)
            res.status(201)
            res.json(user)
        } catch (e) {
            next(e)
        }
    }

    static async login(req, res, next) {
        try {
            const {email, password} = req.body
            const token = await UserService.login(email, password)
            res.status(201)
            res.json({token})
        } catch (e) {
            next(e)
        }
    }

    static async startGame(req, res, next) {
        try {
            const {game_id, answer} = req.body
            const {userId} = req
            const result = await UserService.startGame(game_id, answer, userId)
            res.status(201)
            res.json(result)
        } catch (e) {
            next(e)
        }
    }

    static async help_50(req, res, next) {
        try {
            const {game_id} = req.body
            const data = await UserService.help_50(game_id)
            res.status(201)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }

    static async hallHelp(req, res, next) {
        try {
            const {userId} = req
            const {game_id} = req.body
            const data = await UserService.hallHelp(userId, game_id)
            res.status(200)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }

    static async gameStatistics(req, res, next) {
        try {
            const {userId} = req
            const data = await UserService.gameStatistics(userId)
            res.status(200)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }

    static async bestPlayers(req, res, next) {
        try {
            const data = await UserService.bestPlayers()
            res.status(200)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }

    static async addQuestions(req, res, next) {
        try {
            const {ask, answers} = req.body
            await UserService.addQuestions(ask, answers)
            res.status(200)
            res.json({message: 'asc successfully inserted'})
        } catch (e) {
            next(e)
        }
    }

    static async getQuestions(req, res, next) {
        try {
            const questions = await UserService.getQuestions()
            res.status(200)
            res.json(questions)
        } catch (e) {
            next(e)
        }
    }

    static async deleteQuestion(req, res, next) {
        try {
            const {id} = req.params
            await UserService.deleteQuestion(id)
            res.status(200)
            res.json({message: 'The question successfully removed'})
        } catch (e) {
            next(e)
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const {id} = req.params
            await UserService.deleteUser(id)
            res.status(200)
            res.json({message: 'The user successfully removed'})
        } catch (e) {
            next(e)
        }
    }

    static async userStats(req, res, next) {
        try {
            const data = await UserService.userStats()
            res.status(200)
            res.json(data)
        } catch (e) {
            next(e)
        }
    }
}