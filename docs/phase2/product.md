# product.md

## Clearly describes what was built.
- SDC Form Domain Object
    - What we built during this phase was the implementation of the SDC Form domain object from the server, client, and parser perspective. The implementation of the parser took some work as we had to define the structure of it comprehensively to parse it. We wrote Typescript definitions of the parsed XML to JSON using the CAP SDC Technical Reference Guide_v0.42 as the basis of the documentation. With this, we were able to parse the XML recursively and normalize it into data that the server and client could use.
    - Next, we implemented the use cases/routes that handle the SDC Form from converting an XML string to the proper domain object to persisting this object in a MongoDB database after it is parsed.
    - Lastly, after we knew the shape of our normalized SDC Form, we built the React components to render the object.
- This is different from what we originally proposed in P1 since we moved from using fake/mock data to real SDC data that was provided. Also, with the addition of the MongoDB persistence, our original in-memory database used to store the information may be deprecated in the near-future (or used solely for caching purposes).

## Documents specific progress towards your goal.
- Frontend
    - https://imgur.com/ARpaPdf
    - https://imgur.com/a/ZrHX24W
    - https://imgur.com/5esivNV
    - https://imgur.com/bGU8DAE

- Backend - In the backend, we were able to implement an XML parsing function and incorporate it into the handlers for the GET and POST routes for SDCForms. We are now able to return real SDCForm JSON objects rather than mock ones.
Code for the XML parser:
https://github.com/csc302-fall-2020/proj-6ix/blob/master/server/src/data/SDCForm/parser/SDCFormXMLParser.ts 
https://github.com/csc302-fall-2020/proj-6ix/blob/master/server/src/data/SDCForm/parser/normalize.ts
- Mongo - A mongoDB cluster was successfully brought up on mongodb atlas. We were able to connect to this cluster from our backend via mongoose. We created a schema for the Patient object on our backend and added connections to the mongo cluster, so we now have the ability to perform all CRUD operations concerning Patient objects on a mongo instance. The cluster running on atlas can be seen here: https://drive.google.com/file/d/1Ln83RUl3Vfw0oJgD6_KtzobSwBvNWLQi/view?usp=sharing
The code for the database connection can be seen here;
https://github.com/csc302-fall-2020/proj-6ix/blob/master/server/src/data/Patient/PatientMongoEntityGateway.ts
https://github.com/csc302-fall-2020/proj-6ix/blob/master/server/src/data/Patient/schema/PatientSchema.ts

## High-quality technical documentation/design of your software
- Server
    - API/Database
        - Patients
            - Made up of PatientID and name
            - Operations
                - Create
                - Get
                - Delete
            - Used for being able to associate an SDCFormResponse to a patient
    - Parser
        - Multistep parsing
            1. Take in XML file as string and convert to raw direct mapping to an equivalent JSON output representing an SDCForm
            2. Take this raw JSON output and map to domain entities (e.g. SDCResponseQuestion, SDCSection, etc)
            Used by api to handle any incoming xml files from client that need to be converted to and stored as an intuitive JSON equivalent representation, doing just that task
    - Architecture
        - Uncle Bob’s Clean Architecture
        - Incoming endpoint -> handled by Express router -> specific controller handles a specific endpoint for a given router -> controller interacts with usecase to accomplish business logic for that usecase -> usecase interacts with entity gateways to persist/retrieve/etc on entities in relation to “databases” and return that data -> usecase handles errors thrown or if no errors returns data -> controller sends value/error from usecase as appropriate server response
        - Chosen since it makes the code modular, extensible, “clean” (separation of concerns), easy to read, easy to test, etc
    - Client
        - Patients
            - Made up of PatientID and name
            - Operations
                - Create
                - Get
                - Update
                - Delete
            - Used for being able to associate an SDCFormResponse to a patient
        - SDCForms
            - Operations
                - Create
                - Get
                - Update
                - Delete
            - Usecases
                - Apply CRUD on forms as a form manager to manage the forms available to form fillers
                - Retrieve forms as a form filler to be able to create an SDCFormResponse
        - Architecture
            - DDD (Domain Driven Design)
            - Components dispatch actions -> state management (i.e. Redux) make a call to a service to carry out business logic relating to handling that UI action -> service interacts with repository for that domain feature and if needed, other services to accomplish usecase -> repository does data-fetching/persisting/etc logic relating to that usecase and returns value -> service returns the value appropriate for that usecase -> state management takes received value from service to update application state -> components render/re-render based on new state
            - Chosen since it makes the code modular, extensible, “clean” (separation of concerns), easy to read, easy to test, etc
        - DI (Dependency Injection)
            - Different repositories depending on environment (one of production, development, or test)
                - Production and development environments use real implementation of repository to do data-related logic (e.g. making API calls)
                - Test environment uses fake repository to implement its abstract interface, in here there is no API calls made, just fake simulation of the real implementation (server)
            - Can run the app under any of the environments while developing or writing tests
            - Makes it easy to not be dependent on waiting for real implementation of repositories (which requires api to be done) to be able to be worked on before UI work begins, can work with fake server to drive UI work even before backend people have begun to develop API, improving developer productivity drastically
    - CI/CD using Github Actions

## What did you actually build during this phase?
- How is this different from what you originally proposed? Why?
- CI/CD:
    - We have set up our CI/CD using GIthub Actions. The importance of CI to us is that we can be confident that we’re merging working and tested code. This allows us to catch any bugs, or unexpected behaviour as early as possible. Meanwhile, CD is important to us, because it enables automatic deployment when any code is merged into master branch. The combination of CI/CD allows us to ship out well tested code to customers quickly.

## Technical highlights: interesting bugs, challenges, lessons learned, observations, etc.
- CI/CD:
    - For the parser, challenges were introduced when implementing the SDC schema format. The Cap SDC Technical Reference Guide_v0.42 detailed the whole schema, and with this definition, we implemented the Typescript definitions to properly be able to write functions to parse the XML files. The challenge we faced was the irregularities of the XML schemas. For example, the PKG_LDCT_LUNG_forStudents.xml file had a few irregularities in the schema that do not adhere to the SDC schema documentation.
    - For CD, deploying our app to Heroku was challenging because of how Heroku builds the app and because it's done all through CLI (no GUI). When working on deployment, each time any changes were made, we had to push our code to Heroku, wait for it to deploy then our app would crash, and then finally we can see any errors in the CLI. This lengthy process increased our deployment time for setting up CD. But once the bugs preventing the build were fixed, it worked flawlessly. The lesson learned here was to figure out the deployment of a simple version of our server, and then try to deploy our app.
## Reflect on your teamwork and process. What worked well, what  needs improvement.
- Ideally you will have specific artifacts from your development process to show (for instance, a burndown chart)
    - Worked Well:
        - Great team chemistry. We all helped one another by leveraging the domains we specialised in.
        - Diversity of knowledge/experience. 
            - We all had done PEY thus had a solid background in various technologies that we ended up using.
    - Didn’t Work Well:
        - Time management. Because of other deadlines, and our plan to have an open schedule, we ended up working on the project together near the deadline.
## Triage: What will you build for phase 3, the final demo? (same thing as: “Makes realistic plan for final work towards demo”?)
- CI/CD
- Implement second use case (Active Form Filler) With all endpoints and responses
- Authentication: Implement ability to log in and save data for the users.
- Full database implementation, CRUD requests for all objects should go through mongoDB
