import { ApolloError } from "apollo-server-express";
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  UseMiddleware,
  Ctx
} from "type-graphql";

//=========== Schema ==========//
import { userStatus, userSchema } from "../schema/user";

//=========== Models ==========//
import User from "../../models/user";

//=========== Services ==========//
import { isAuth } from "../../config/auth";
import { MyContext } from "../../services/type-declarations";

@Resolver()
export class userResolver {
  @Mutation(() => userStatus, { description: "Create user" })
  async create_user(
    @Arg("full_name") full_name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<userStatus> {
    try {
      const lowercase = email.toLowerCase();

      const findEmail = await User.findOne({ email: lowercase });

      if (findEmail) {
        return {
          message: "User with email already exist",
          value: false
        };
      }

      const newUser = new User({
        full_name,
        email: lowercase,
        password
      });

      const savedUser = newUser.save();

      return {
        message: "Account created",
        value: true,
        user: savedUser
      };
    } catch (err) {
      throw err;
    }
  }

  @Mutation(() => userStatus, { description: "Login for users" })
  async user_login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<userStatus> {
    try {
      const lowercase = email.toLowerCase();
      const user = await User.findOne({ email: lowercase });

      if (!user) {
        return {
          message: "Incorrect login details",
          value: false
        };
      }

      const isMatch: boolean = await user.verifyPass(password);

      if (!isMatch) {
        return {
          message: "Incorrect login details",
          value: false
        };
      }

      const token: string = await user.jwtToken();

      return {
        message: token,
        value: true,
        user
      };
    } catch (err) {
      throw err;
    }
  }

  @Query(() => userSchema, { description: "Get user profile" })
  @UseMiddleware(isAuth)
  async user_profile(@Ctx() { payload }: MyContext): Promise<userSchema> {
    try {
      const { userId } = payload!;
      const user = await User.findById(userId);

      if (!user) {
        throw new ApolloError("User not found");
      }

      return user;
    } catch (err) {
      throw err;
    }
  }
}
