import { Field, ID, ObjectType, Int } from "type-graphql";

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

@ObjectType({ description: "Type for resolvers that require pagination" })
export class PageInfo {
  @Field()
  hasNextPage: boolean;

  @Field()
  endCursor: Date;
}

@ObjectType({
  description: "Getting multiple quizes, Makes pagination easier"
})
export class QuizConnection {
  @Field(() => [quizSchema])
  edges: Array<quizSchema>;

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo;
}
