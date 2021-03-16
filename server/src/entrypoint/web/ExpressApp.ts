import { Application, Response, default as express } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { SDCFormRouter } from 'entrypoint/web/routers/SDCFormRouter';
import { AppConfig } from 'config/AppConfig';
import { PatientRouter } from './routers/PatientRouter';
import { FormFillerRouter } from './routers/FormFillerRouter';
import { SDCFormResponseRouter } from './routers/SDCFormResponseRouter';

interface Dependencies {
  config: AppConfig;
  SDCFormRouter: SDCFormRouter;
  patientRouter: PatientRouter;
  formFillerRouter: FormFillerRouter;
  SDCFormResponseRouter: SDCFormResponseRouter;
}
export class ExpressApp {
  #app: Application;
  #config: AppConfig;
  #SDCFormRouter: SDCFormRouter;
  #patientRouter: PatientRouter;
  #formFillerRouter: FormFillerRouter;
  #SDCFormResponseRouter: SDCFormResponseRouter;

  constructor({
    config,
    SDCFormRouter,
    patientRouter,
    formFillerRouter,
    SDCFormResponseRouter,
  }: Dependencies) {
    this.#app = express();
    this.#config = { ...config };
    this.#SDCFormRouter = SDCFormRouter;
    this.#patientRouter = patientRouter;
    this.#formFillerRouter = formFillerRouter;
    this.#SDCFormResponseRouter = SDCFormResponseRouter;
  }

  private configApp(): void {
    const app = this.#app;

    app.use(bodyParser.json());
    app.use(cors());

    app.use(this.#SDCFormRouter.getRouter());
    app.use(this.#patientRouter.getRouter());
    app.use(this.#formFillerRouter.getRouter());
    app.use(this.#SDCFormResponseRouter.getRouter());

    if (this.#config.publicDir) {
      app.use(express.static(this.#config.publicDir));

      app.get('/', (req: DecodedExpressRequest, res: Response) => {
        res.sendFile(path.join(this.#config.publicDir as string, 'index.html'));
      });
    }
  }

  boot(): Application {
    if (!this.#app) {
      this.#app = express();
    }

    this.configApp();

    if (
      this.#config.environmentMode === 'production' ||
      this.#config.environmentMode === 'development'
    ) {
      this.#app.listen(this.#config.port, () => {
        // eslint-disable-next-line no-console
        console.log(`App listening on port ${this.#config.port}!`);
      });
    }

    return this.#app;
  }
}
