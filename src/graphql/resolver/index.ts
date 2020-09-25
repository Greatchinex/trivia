import { quizResolver } from "./quiz";
import { userResolver } from "./user";

export default [quizResolver, userResolver] as const;
