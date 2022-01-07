import db from "../utils/db";
import bcrypt from "bcrypt";
import HttpError from "http-errors";
import jwt from "jsonwebtoken";

const {JWT_SECRET} = process.env

export class UserService {
    static async register(role, name, email, password, fileName) {
        const hashPass = await bcrypt.hash(password, 10);
        const [{insertId}] = await db.promise().execute('INSERT INTO users (`role`, `name`, `email`, `password`, `avatar`) VALUES(?,?,?,?,?)', [
            role, name, email, hashPass, fileName
        ])
        return this.getUserById(insertId)
    }

    static async getUserById(id) {
        const [user] = await db.promise().execute('SELECT * FROM users WHERE id = ?', [
            id
        ])
        delete user[0].password
        return user[0]
    }

    static async getUserByEmail(email) {
        const [user] = await db.promise().execute('SELECT * FROM users WHERE email = ?', [
            email
        ])
        return user[0]
    }

    static async login(email, password) {
        const user = await this.getUserByEmail(email)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!user || !isMatch) {
            throw HttpError(403, 'invalid email or password')
        }
        const token = jwt.sign({userId: user.id, role: user.role}, JWT_SECRET)

        return token
    }

    static async startGame(game_id, answer, userId) {
        const [game] = await db.promise().execute('SELECT * FROM game WHERE id = ?', [
            game_id
        ])
        if (!game[0]) {
            throw HttpError(403, `not game with id ${game_id}`)
        }
        await db.promise().execute('INSERT INTO users_answers (`user_id`, `game_id`) VALUES(?,?)', [
            userId, game[0].id
        ])
        const gameJson = JSON.parse(game[0].answers)

        for (let i of gameJson.answers) {
            if (answer.toLowerCase() === i.value.toLowerCase() && i.correct === true) {
                await db.promise().execute('UPDATE users_answers SET count = ?', [
                    1
                ])
                return {
                    ask: game[0].ask,
                    answer,
                    correct: true
                }
            }
        }
        return {
            ask: game[0].ask,
            answer,
            correct: false
        }
    }

    static async help_50(game_id) {
        const [game] = await db.promise().execute('SELECT * FROM game WHERE id = ?', [
            game_id
        ])
        if (!game[0]) {
            throw HttpError(403, `not game with id ${game_id}`)
        }
        const gameJson = JSON.parse(game[0].answers)

        return gameJson.answers.reduce((acc, i, index) => {
            if (i.correct === true) {
                acc[index] = i.value
                acc[index + 1] = gameJson.answers[index + 1].value
            }
            return acc
        }, {})
    }

    static async hallHelp(userId, game_id) {
        const [game] = await db.promise().execute('SELECT * FROM game WHERE id = ?', [
            game_id
        ])
        if (!game[0]) {
            throw HttpError(403, `not game with id ${game_id}`)
        }
        const gameJson = JSON.parse(game[0].answers)

        return gameJson.answers.filter(i => i.correct === true)
    }

    static async gameStatistics(userId) {
        const [games] = await db.promise().execute(
            'SELECT g.*, ua.count FROM game AS g JOIN users_answers AS ua WHERE g.id = ua.game_id AND ua.user_id = ?',
            [userId])

        return games
    }

    static async bestPlayers() {
        const [bestPlayers] = await db.promise().execute(
            'SELECT * FROM users AS u JOIN users_answers AS ua ON u.id = ua.user_id ORDER BY ua.count DESC')

        return bestPlayers
    }

    static async addQuestions(ask, answers) {
        await db.promise().execute('INSERT INTO game (`ask`, `answers`) VALUES(?,?)', [
            ask, JSON.stringify(answers)
        ])
    }

    static async getQuestions() {
        const [questions] = await db.promise().execute(
            'SELECT * FROM game')
        return questions
    }

    static async deleteQuestion(id) {
        const [question] = await db.promise().execute(
            'SELECT * FROM game WHERE id = ?', [id])

        if (!question[0]) {
            throw HttpError(403, `not game with id ${id}`)
        }
        await db.promise().execute(
            'DELETE FROM game WHERE id = ?', [id])
    }

    static async deleteUser(id) {
        const [user] = await db.promise().execute(
            'SELECT * FROM users WHERE id = ?', [id])

        if (!user[0]) {
            throw HttpError(403, `not user with id ${id}`)
        }
        await db.promise().execute(
            'DELETE FROM user WHERE id = ?', [id])
    }

    static async userStats() {
        const [userStats] = await db.promise().execute(
            'SELECT u.name, u.email, g.*, ua.count FROM users_answers AS ua JOIN game AS g ON g.id = ua.game_id JOIN users AS u ON u.id = ua.user_id;'
        )
        return userStats
    }
}