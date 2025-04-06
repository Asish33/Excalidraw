import express from "express";
import jwt from "jsonwebtoken";
import { CustomReq, middleware } from "./middlewares.js";
import { JWT_SECRET } from "@repo/backend-common/config";
import { UserSchema, SigninSchema, RoomSchema } from "@repo/common/types";
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
          id: ans,
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
  const parsedData = RoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "name for room is not given by the user",
    });
    return;
  }
  if (!id) {
    res.json({
      message: "unauthorized",
    });
    return;
  }
  try {
    const room = await prismaClient.room.create({
      data: {
        adminId: id,
        slug: parsedData.data?.name,
      },
    });

    res.json({
      message: "room is created successfully",
      roomId: room.id,
    });
  } catch (e) {
    res.json({
      message:"Room already exists with the given room name"
    })
    return;
  }
});

app.listen(3001, () => {
  console.log("server is running on the port 3001");
});
