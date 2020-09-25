import { Field, ID, ObjectType, Int } from "type-graphql";

//=========== Schema ==========//
import { PageInfo } from "./quiz";

@ObjectType({
  description: "Schema for users"
})
export class userSchema {
  @Field(() => ID)
  _id: string;

  @Field()
  full_name: string;

  @Field()
  email: string;

  @Field(() => Int, { nullable: true })
  percentage_score?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType({
  description: "sending other values along with user schema"
})
export class userStatus {
  @Field()
  message: string;

  @Field()
  value: boolean;

  @Field(() => userSchema, { nullable: true })
  user?: userSchema;
}

@ObjectType({
  description: "Getting multiple users, Makes pagination easier"
})
export class UserConnection {
  @Field(() => [userSchema])
  edges: Array<userSchema>;

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo;
}
