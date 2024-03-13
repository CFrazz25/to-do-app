- download postgres
- run the db migrations in the `scripts` folder


- `dotnet clean`
- `dotnet build`
<!-- - `dotnet dev-certs https --trust` leave this alone for now -->
- `dotnet run --launch-profile https` OR just `dotnet run`.
 might run into this issue if running https for NextJS. https://github.com/vercel/next.js/issues/44062 would need to update nextjs config i think


"DefaultConnection": "Host=localhost;Port=5432;Database=postgres;Username=christopherfrazzini" - localhost
"DefaultConnection": "Host=host.docker.internal;Port=5432;Database=postgres;Username=christopherfrazzini" - local Docker


docker build -t todoapi .
docker run -p 5084:8080 todoapi


gcloud builds submit --tag gcr.io/the-name-413502/todoapp

gcloud run deploy todoapp --image gcr.io/the-name-413502/todoapp --platform managed --region us-central1 --allow-unauthenticated --add-cloudsql-instances=the-name-413502:us-central1:frazzle



--set-env-vars=DATABASE_URL=YOUR_DATABASE_CONNECTION_STRING