import HttpError from "http-errors";
import jwt from "jsonwebtoken";

const {JWT_SECRET} = process.env

const EXCLUDE = [
    '/user/login',
    '/user/register',
]

function authorization(req, res, next) {
    try {
        const {url} = req
        if (EXCLUDE.includes(url)) {
            return next()
        }
        const {authorization} = req.headers
        if(!authorization){
            throw HttpError(403, 'user not authorize')
        }
        const token = authorization.split(' ')[1]
        const data = jwt.verify(token, JWT_SECRET)
        if (!data) {
            throw HttpError(403)
        }
        let userId = data.userId
        req.userId = userId
        req.user = data
        next()
    } catch (e) {
        next(e)
    }
}

export default authorization;