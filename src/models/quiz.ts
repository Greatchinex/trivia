import { createSchema, Type, typedModel } from "ts-mongoose";

const quizSchema: any = createSchema(
  {
    number: Type.number(),

    question: Type.string(),

    /*** Question Options: Answer options is not dynamic so Just A - D option and that is
     * why it is structured This way
     */
    A: Type.string(),

    B: Type.string(),

    C: Type.string(),

    D: Type.string(),

    // Correct option
    answer: Type.string()
  },
  { timestamps: true }
);

export default typedModel("Quiz", quizSchema);
