import express from "express";
import jwt from "jsonwebtoken";
import { CustomReq, middleware } from "./middlewares.js";
import { JWT_SECRET } from "@repo/backend-common/config";
import { UserSchema, SigninSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const data = UserSchema.safeParse(req.body);

  if (!data.success) {
    res.status(400).json({
      message: "check inputs",
    });
    return;
  }
  try {
    const user = await prismaClient.user.create({
      data: {
        email: data.data.email,
        password: data.data.password,
        name: data.data.name,
        picture: data.data.picture || null,
      },
    });
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "erro while creating the user",
      error,
    });
  }
});

app.post("/signin", async (req, res) => {
  const data = SigninSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({
      message: "check inputs",
    });
    return;
  }

  const { email, password } = data.data;
  const user = await prismaClient.user.findUnique({
    where: {
      email,
    },
  });
  const ans = user?.id;
  if (user?.password == password) {
    try {
      const token = jwt.sign(
        {
          ans,
        },
        JWT_SECRET
      );

      res.status(200).json({
        token,
      });
      return;
    } catch (error) {
      res.json({
        message: "error has occured",
        error,
      });
    }
  } else {
    res.json({
      message: "wrong password",
    });
    return;
  }
});

app.post("/room", middleware, async (req: CustomReq, res) => {
  const { id } = req;
  if (!id) {
    res.json({
      message: "unauthorized",
    });
    return;
  }
  const room = prismaClient.room.create({
    data: {
      adminId: id,
      slug: "123",
    },
  });
});

app.listen(3001, () => {
  console.log("server is running on the port 3001");
});
