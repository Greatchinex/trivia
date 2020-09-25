import { Resolver, Query } from "type-graphql";

@Resolver()
export class quizResolver {
  @Query(() => String)
  async hello_world() {
    return "Hello People";
  }
}
