import { Field, ID, ObjectType, Int, InputType } from "type-graphql";

@ObjectType({
  description: "Schema for quiz"
})
export class quizSchema {
  @Field(() => ID)
  _id: string;

  @Field(() => Int)
  number: number;

  @Field()
  question: string;

  @Field()
  A: string;

  @Field()
  B: string;

  @Field()
  C: string;

  @Field()
  D: string;

  @Field()
  answer: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType({
  description: "sending other values along with quiz schema"
})
export class quizStatus {
  @Field()
  message: string;

  @Field()
  value: boolean;

  @Field(() => quizSchema, { nullable: true })
  quiz?: quizSchema;
}

@InputType()
class answerPairs implements Partial<quizSchema> {
  @Field(() => Int)
  number: number;

  @Field()
  answer: string;
}

@InputType({
  description: "Type to pass to mutation when user wants to submit a quiz"
})
export class submitInput {
  @Field(() => [answerPairs])
  question_response_pairs: Array<answerPairs>;
}
