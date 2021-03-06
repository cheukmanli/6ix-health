# proj-6ix

http://proj-6ix-health.herokuapp.com/

- A full-stack application to manage SDC Forms authorized by Form Managers to be used for entry by Form Fillers during the pandemic to capture a given electronic medical report for patients
- A parser that properly reads an SDC Cap formatted XML file and normalizes it into a data structure that we understand clearly in our domain.
- Services to manage Patients, Form Fillers, Form Responses, and validation on Form Responses.


## Setup CI/CD using Github Actions
- No setup required for `CI`.
- Setting up `CD`:
    - `Continuous Integration and Deployment` Action deploys to Heroku.
    - Create a Project on Heroku.
    - Get `HEROKU_API_KEY`, `HEROKU_APP_NAME`, `HEROKU_APP_EMAIL` from the Project, and [add them to Repository Secrets](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository).

## Installation for Server
Run `npm install`


Need to install and run MongoDB.

Instructions for Windows:
- Install MongoDB: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#install-mongodb-community-edition
- After installation, add the MongoDB `bin` folder location to the Path Environment Variable: https://dangphongvanthanh.wordpress.com/2017/06/12/add-mongos-bin-folder-to-the-path-environment-variable/

Instructions for Mac:
- https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

In the `/server` folder, run an instance of MongoDB with `npm run start:mongodb`

If you installed MongoDB Compass along with MongoDB, you can connect to the database with connection string `mongodb://localhost:27017`
