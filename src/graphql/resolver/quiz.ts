import { Resolver, Query, Mutation } from "type-graphql";

//=========== Schema ==========//
import { quizSchema } from "../schema/quiz";

//=========== Models ==========//
import Quiz from "../../models/quiz";

//=========== Services ==========//
import { quiz_data } from "../../services/quiz-data";

@Resolver()
export class quizResolver {
  @Query(() => String)
  async hello_world() {
    return "Hello People";
  }

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
}
