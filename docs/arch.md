This application uses `MERN` Stack. The Implementation is split into Frontend and Backend. Both Frontend and Backend use TypeScript, for strong (static) typing, and to catch errors earlier during development. Backend is architected using "Clean Architecture" by Robert Cecil Martin. Meanwhile, Frontend is architected using "Domain-driven design (DDD)". This ensures that our application is modular, scalable, easily testable, and easily understandable to readers of its code. For Cloud hosting, Heroku was chosen for its simplicity of deployment and environment configuration, and its free pricing plan.

Stack:
- Backend:
  - NodeJs & ExpressJs
  - Database: MongoDB
  - Testing: Jest
  - Features RESTful Apis to be used from Frontend
- Frontend:
  - React with Material-UI
  - Testing: Jest, React Testing Library
- CI/CD:
    - Github Actions
         -  Github Actions were chosen over Travis CI, as Github Actions integrate directly with Github Repositories and PRs
    - Continuous Deployment made to Heroku
