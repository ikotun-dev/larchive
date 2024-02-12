import { Request, Response, Router } from "express";
import { Md5 } from 'ts-md5'
import jwt from 'jsonwebtoken'
import db from "../models/db";

const userRouter = Router()

var insertUserQuery = `INSERT into users (username, password) VALUES (?, ?)`
var checkExistingUsernameQuery = `SELECT * FROM users WHERE username = ?`
const createNewUser = async (req: Request, res: Response) => {
  console.log(req.body)
  const username = req.body?.username
  const password = req.body?.password
  if (!username || !password) {
    res.json({ "message": "Invalid request" }).status(400)
  } else {
    console.log(`${username} is trying to signup`)
    const hashedPassword = Md5.hashStr(password)
    db.get(checkExistingUsernameQuery, [username], (err, existingUser) => {
      if (err) {
        console.error(err)
        res.json({ "message": "Internal Server Error" }).status(500)
      } if (existingUser) {
        res.json({ "message": "User with this username already exists" }).status(400)
      } else {
        db.run(insertUserQuery, [username, hashedPassword], (insertErr) => {
          if (insertErr) {
            console.error(insertErr.message
            )
          }
          console.log(`User ${username} created successfully`)
          return res.json({ "message": "User created successfully" }).status(201)
        })
      }
    })

  }
}

const login = async (req: Request, res: Response) => {
  const username = req.body?.username
  const password = req.body?.password
  if (!username || !password) {
    res.json({ "message": "Invalid Request" }).status(400)
  }
  db.get(checkExistingUsernameQuery, [username], (err, existingUser) => {
    if (err) {
      console.error(err.message)
      res.json({ 'message': "Invalid username" }).status(500)
    } if (existingUser) {
      const hashedPassword = Md5.hashStr(password)
      const validateUserQuery = `SELECT * FROM users WHERE username = ? AND password = ?`
      console.log(hashedPassword)
      db.get(validateUserQuery, [username, hashedPassword], (validateQueryErr, user: any) => {
        if (validateQueryErr) {
          console.error(validateQueryErr.message)
        } if (!user) {
          res.json({ "message": "user does not exist" })
        }
        const { id, username } = user
        const accessToken = jwt.sign({ userId: id }, "collins", { expiresIn: "1h" })
        console.log(`${username} logged in successfully`)
        return res.json({ "message": "login succesful", "accessToken": `${accessToken}` }).status(200)
      })
    }
  })
}

userRouter.post("/signup", createNewUser)
userRouter.post("/login", login)

export default userRouter
