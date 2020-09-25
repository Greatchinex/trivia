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
import { submitInput } from "../schema/quiz";

//=========== Models ==========//
import User from "../../models/user";
import Quiz from "../../models/quiz";

//=========== Services ==========//
import { isAuth } from "../../config/auth";
import { MyContext } from "../../services/type-declarations";
import { calculatePercentage } from "../../services/utility";

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

  @Query(() => [userSchema], { description: "Get all users in DB" })
  async get_all_users(): Promise<userSchema> {
    try {
      const user = await User.find().sort({ createdAt: -1 });

      return user;
    } catch (err) {
      throw err;
    }
  }

  @Mutation(() => String, {
    description: "Calculate % score when user submits the test"
  })
  @UseMiddleware(isAuth)
  async submit_quiz(
    @Arg("data", () => submitInput, {
      description: "This is all the answers selected by the user"
    })
    data: submitInput,
    @Ctx() { payload }: MyContext
  ) {
    try {
      const { userId } = payload!;
      const user = await User.findById(userId);

      if (!user) {
        throw new ApolloError("User not found");
      }

      const { question_response_pairs } = data;
      // Track the number of answers user got correctly
      let answered_correctly: number = 0;

      // Loop through the data and compare answers user selected with what is in DB..
      // This is to determine the correct answers selected by the users and calculate
      // Their percentage Score
      for (let index = 0; index < question_response_pairs.length; index++) {
        let singlePair = question_response_pairs[index];

        // console.log(singlePair.answer);
        // Find question that matches question number
        const findQuestion = await Quiz.findOne({
          number: singlePair.number
        }).select({ _id: 0, answer: 1 });

        // Check if answer user selected matches the correct answer in the DB
        if (singlePair.answer === findQuestion.answer) {
          /*** Add one to the "answered_correctly" variable...At the end of the loop
           * the number will be how many questions the user got correctly. This will enable
           * calculation of percentage
           */
          answered_correctly += 1;
        }
      }

      // Calculate percentage
      const percent: number = calculatePercentage(answered_correctly);

      // Update user percentage score
      await User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            percentage_score: percent
          }
        },
        { new: true }
      );

      return `Your score is ${percent}%`;
    } catch (err) {
      throw err;
    }
  }
}
