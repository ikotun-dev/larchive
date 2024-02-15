import { Request, Response, Router } from "express";
import { Md5 } from 'ts-md5'
import jwt from 'jsonwebtoken'
import db from "../models/db";

const userRouter = Router()

var insertUserQuery = `INSERT into users (username, password) VALUES (?, ?)`
var checkExistingUsernameQuery = `SELECT * FROM users WHERE username = ?`
const createNewUser = async (req: Request, res: Response) => {
  console.log("entered")
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
        res.json({ "message": "User with this username already exists", "statusCode": 401 }).status(400)
      } else {
        db.run(insertUserQuery, [username, hashedPassword], (insertErr) => {
          if (insertErr) {
            console.error(insertErr.message
            )
          }
          console.log(`User ${username} created successfully`)
          return res.json({ "message": "User created successfully", "statusCode": 201 }).status(201)
        })
      }
    })

  }
}

const login = async (req: Request, res: Response) => {
  console.log("entered..login")
  const username = req.body?.username
  const password = req.body?.password
  if (!username || !password) {
    res.json({ "message": "Invalid Request" }).status(400)
  }
  console.log("Right before db stuff")
  console.log(`${username}, ${password}`)
  db.get(checkExistingUsernameQuery, [username], (err, existingUser) => {
    console.log(`${err} , ${existingUser}`)

    if (err == null && !existingUser) {
      console.log("....")
      res.json({ 'message': "Invalid username", "statusCode": 404 }).status(404)
    }
    if (existingUser) {
      const hashedPassword = Md5.hashStr(password)
      const validateUserQuery = `SELECT * FROM users WHERE username = ? AND password = ?`
      console.log(hashedPassword)
      db.get(validateUserQuery, [username, hashedPassword], (validateQueryErr, user: any) => {
        if (validateQueryErr) {
          console.error(validateQueryErr.message)
        } if (!user) {
          res.json({ "message": "user does not exist", "statusCode": 401 })
        }
        const { id, username } = user
        const accessToken = jwt.sign({ userId: id }, "collins", { expiresIn: "1d" })
        console.log(`${username} logged in successfully`)
        res.status(200).json({ "message": "login succesful", "accessToken": `${accessToken}`, "statusCode": 200 })
      })
    }
  })
}

userRouter.post("/signup", createNewUser)
userRouter.post("/login", login)

export default userRouter
