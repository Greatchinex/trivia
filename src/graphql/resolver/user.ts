import { Resolver, Mutation, Arg } from "type-graphql";

//=========== Schema ==========//
import { userStatus } from "../schema/user";

//=========== Models ==========//
import User from "../../models/user";

//=========== Services ==========//

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
}
