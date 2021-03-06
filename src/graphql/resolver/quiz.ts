import { Resolver, Query, Mutation, UseMiddleware } from "type-graphql";

//=========== Schema ==========//
import { quizSchema } from "../schema/quiz";

//=========== Models ==========//
import Quiz from "../../models/quiz";

//=========== Services ==========//
import { quiz_data } from "../../services/quiz-data";
import { isAuth } from "../../config/auth";

@Resolver()
export class quizResolver {
  @Mutation(() => [quizSchema], {
    description: "Save all quiz questions in DB."
  })
  async save_questions(): Promise<quizSchema> {
    try {
      const quizzes = await Quiz.insertMany(quiz_data);

      return quizzes;
    } catch (err) {
      throw err;
    }
  }

  @Query(() => [quizSchema], {
    description:
      "Fetch ten random questions from database...For only authenticated users"
  })
  @UseMiddleware(isAuth)
  async fetch_random_questions() {
    try {
      const random = await Quiz.aggregate([{ $sample: { size: 10 } }]);

      return random;
    } catch (err) {
      throw err;
    }
  }

  @Query(() => [quizSchema], { description: "Get all questions in DB" })
  async get_all_questions(): Promise<quizSchema> {
    try {
      const questions = await Quiz.find();

      return questions;
    } catch (err) {
      throw err;
    }
  }
}
