- download postgres
- run the db migrations in the `scripts` folder


- `dotnet clean`
- `dotnet build`
<!-- - `dotnet dev-certs https --trust` leave this alone for now -->
- `dotnet run --launch-profile https` OR just `dotnet run`.
 might run into this issue if running https for NextJS. https://github.com/vercel/next.js/issues/44062 would need to update nextjs config i think


