import HttpError from "http-errors";
import jwt from "jsonwebtoken";

const {JWT_SECRET} = process.env

function roleAccess(role) {
    return function (req, res, next) {
        try {
            const {authorization} = req.headers
            if (!authorization) {
                throw HttpError(403, 'user not authorize')
            }
            const token = authorization.split(' ')[1]
            const data = jwt.verify(token, JWT_SECRET)

            if (!data) {
                throw HttpError(403)
            }
            if (data.role != role) {
                return res.json({
                    status: 403,
                    message: 'not found'
                })
            }
            req.user = data
            next()
        } catch (e) {
            next(e)
        }
    }
}

export default roleAccess;