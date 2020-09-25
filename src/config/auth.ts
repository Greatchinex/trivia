import { MiddlewareFn } from "type-graphql";
import { ApolloError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//======= Type Declaration ========//
import { MyContext } from "../services/type-declarations";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new ApolloError("Not Authorized, Please login again");
  }

  try {
    const token = (authorization as string).split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    throw new ApolloError("Not Authorized, Please login again");
  }
  return next();
};
