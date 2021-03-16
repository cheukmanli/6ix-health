import { AwilixContainer, createContainer, InjectionMode } from 'awilix';
import { generalInjection, GeneralRegistrations } from './general';
import { FormFillerRegistrations, formFillerInjection } from './formFiller';
import { PatientRegistrations, patientInjection } from './patient';
import { SDCFormRegistrations, SDCFormInjection } from './sdcForm';
import {
  SDCFormResponseRegistrations,
  SDCFormResponseInjection,
} from './sdcFormResponse';

type MyCradle = FormFillerRegistrations &
  PatientRegistrations &
  SDCFormRegistrations &
  SDCFormResponseRegistrations &
  GeneralRegistrations;

export type EnvironmentTypes = 'production' | 'development' | 'test';

export const defaultInjectionOptions = {
  /*
    If true, will run the database that is used in test environments (PouchDB as of this writing) with a remote database instead of using built in browser database (IndexedDB). As of this writing, what this means is that these test-environment specific databases will allow the developer to have data stored in an external database (e.g. CouchDB, or [for easier setup] PouchDB Server).

    Optional reads if you decide to use this option:
    - https://pouchdb.com/guides/databases.html
    - https://pouchdb.com/guides/setup-couchdb.html#installing-couchdb
  */
  runPouchDbAsStandaloneServer: false,
};

function configureInjection(
  environment: EnvironmentTypes,
  injectionOptions = defaultInjectionOptions
) {
  const container = createContainer<MyCradle>({
    injectionMode: InjectionMode.PROXY,
  });

  function configureEnvironmentSpecificDependencies() {
    function registerProdDependencies() {
      // register any production environment specific dependencies (classes/values/etc) here
      generalInjection().registerProdDependencies(container);
    }
    function registerDevDependencies() {
      // register any development environment specific dependencies (classes/values/etc) here
      generalInjection().registerDevDependencies(container);
    }
    function registerTestDependencies() {
      // register any test environment specific dependencies (classes/values/etc) here
      generalInjection().registerTestDependencies(container);
      formFillerInjection(injectionOptions).registerTestDependencies(container);
      patientInjection(injectionOptions).registerTestDependencies(container);
      SDCFormInjection(injectionOptions).registerTestDependencies(container);
      SDCFormResponseInjection().registerTestDependencies(container);
    }

    function registerProdAndDevCommonDependencies() {
      // register any dependencies that are shared between production and development environments here
      formFillerInjection(
        injectionOptions
      ).registerProdAndDevCommonDependencies(container);
      patientInjection(injectionOptions).registerProdAndDevCommonDependencies(
        container
      );
      SDCFormInjection(injectionOptions).registerProdAndDevCommonDependencies(
        container
      );
      SDCFormResponseInjection().registerProdAndDevCommonDependencies(
        container
      );
    }

    if (environment === 'production' || environment === 'development') {
      registerProdAndDevCommonDependencies();

      if (environment === 'production') {
        registerProdDependencies();
      } else {
        registerDevDependencies();
      }
    } else {
      registerTestDependencies();
    }
  }

  function registerEnvironmentIndependentDependencies() {
    // configure any environment independent dependencies here
    formFillerInjection(
      injectionOptions
    ).registerEnvironmentIndependentDependencies(container);
    patientInjection(
      injectionOptions
    ).registerEnvironmentIndependentDependencies(container);
    SDCFormInjection(
      injectionOptions
    ).registerEnvironmentIndependentDependencies(container);
    SDCFormResponseInjection().registerEnvironmentIndependentDependencies(
      container
    );
  }

  registerEnvironmentIndependentDependencies();
  configureEnvironmentSpecificDependencies();

  return container;
}

export class DiContainer {
  private static instance: AwilixContainer<MyCradle>;

  private static isDisposed = false;

  public static setupInjection(
    environment: EnvironmentTypes = process.env.NODE_ENV,
    options = defaultInjectionOptions
  ) {
    if (!DiContainer.instance || this.isDisposed) {
      DiContainer.instance = configureInjection(
        environment || process.env.NODE_ENV,
        options
      );
      this.isDisposed = false;
    }

    return DiContainer.instance;
  }

  public static dispose() {
    DiContainer.instance.dispose();
    DiContainer.isDisposed = true;
  }
}

export const diContainer = () => DiContainer.setupInjection();
