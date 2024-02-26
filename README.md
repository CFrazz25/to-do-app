
# To Do App

This is a pretty basic To Do app, broken down into three different setups to communicate fully:

- Frontend Application
    - React and NextJS

    I choose these because I have experience with them, and believe they are both very powerful and flexible tools to create a fast and dynamic frontend.

    To run the frontend part, go into the clients directory `cd client` , run `npm install`, set up your
    `.env` file and add `NEXT_PUBLIC_API_URL="http://localhost:5084/api"`. Then you should be set up to run it with `npm run dev` and open up http://localhost:3000/ in your browser.


- Backend Application
    - C#/.NET

    I have not used C#/.NET environment before, but have been eager to learn it, and due to the requirements of the project to use this tech stack on the backend side, I have really enjoyed getting to learn it so far. Since I'm not familiar with with the ORMs C# uses, I decided to have the database use raw sql for everything, and choose Postgres. After referencing the database portion and getting postgres set up, you can run `cd TodoApi`, then `dotnet run` and your backend app should be running at http://localhost:5084/api/ToDo in your browser.

- Database layer
    - Postgres
    I think using raw postgres instead of ORMs allows for a lot more control, and there's typically a learning curve with new ORMs, so figured it would be faster to get this running, with my experience as well. To get this running, you'll need to download Postgres on your local machine. I enjoy using PgAdmin for a nice user friendly Postgres Admin tool. You can use anything really though to manage the database. You can run the db migration in the `scripts` folder within the .NET application (`cd TodoApi`) . Then you'll need to update your `ConnectionStrings` in your `appsettings` files to connect your postgres database. You can reference what's in there already, and change the username.

