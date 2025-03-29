import express from "express";
import jwt from "jsonwebtoken";
import { CustomReq, middleware } from "./middlewares";
import { JWT_SECRET } from "@repo/common-backend/config";
import { UserSchema, SigninSchema } from "@repo/common/types";

const app = express();
app.use(express.json());

app.post("/signup", (req, res) => {
  const data = UserSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      message: "check inputs",
    });
    return;
  }

  res.json({
    //should add db logic here
    id: 1,
  });
});

app.post("/signin", (req, res) => {
  const data = SigninSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "check inputs",
    });
    return;
  }
  const email = req.body.email;
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

app.post("/room", middleware, (req: CustomReq, res) => {
  const email = req.email;
  res.json({
    email,
  }); //should be a db call
});

app.listen(3001, () => {
  console.log("server is running on the port 3001");
});
