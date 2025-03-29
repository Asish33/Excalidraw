import express from "express"
import jwt from "jsonwebtoken"
import { CustomReq, middleware } from "./middlewares";
import {JWT_SECRET} from "@repo/common-backend/config"
const app = express()
app.use(express.json())


app.post('/signup',(req,res)=>{
    const {email,password}= req.body;

   res.json({ //should add db logic here
    id:1
   })
})

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  const token = jwt.sign(
     {
        email,
     },
     JWT_SECRET
  );

  res.json({
    token,
  });
});

app.post("/room",middleware, (req:CustomReq, res) => {
  const email = req.email;
  res.json({
    email  
  })  //should be a db call
});

app.listen(3001,()=>{
    console.log("server is running on the port 3001")
})