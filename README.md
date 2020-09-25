# Documentation of Thought process for Building application

## Technologies used

Nodejs, express, MongoDb Database. Graphql for Api Architecture, Typegraphql which makes writing graphql Apis with type script a lot easier.

## Thought Process

Firstly i had to store all questions in the database. there is an array in the **quiz-data.ts** file
inside the services folder that is holding the entire array of questions. In the **quiz.ts** file inside resolver folder there is a Mutation(Post Request) that saves all the questions in the Database.
**save_questions** Mutation.

Secondly i had to find a way to send Random Questions to the client. This will be the quiz taken by the user. In the **quiz.ts** file inside resolver folder there is a Query(Get Request) sends the random questions to the client. **fetch_random_questions** Query.

I also has Mutations for creating a user, User Login and a Query which fetches logged in user profile cause only logged in user can take a quiz so that we can use that data to calculate their percentage score. **create_user** **user_login** **user_profile**. There are located inside **user.ts** file in the resolvers folder.

I also had to think about how to calculate the percentage score of the user. Visualizing how this will work in terms of user interface and application flow, If a user selects an answer the front end developer stores the answer they selected in a browser storage(Local storage, IndexedDb). And when the user clicks the submit button a request will be made to the **submit_quiz** Mutation, The data coming in the Mutation arguments(Request Body) will be the answer the user selected along with the question ID. And the mutation will check the user answer and compare to the correct answer in the DB. That enables me to calculate the percentage based on what the user answered.

Some additional Queries are **get_all_questions** fetches all questions in DB, **get_all_users** fetches all users in DB.

#### JWT was used for Authentication

## Testing

Paste the link in the browser url tab. It opens the graphql playground(Like postman for Rest Api). It is self documenting as u will see all Queries and Mutations There.
