import { AwilixContainer, createContainer, InjectionMode } from 'awilix';
import { SDCFormInjection, SDCFormRegistrations } from './SDCForm';
import { patientInjection, PatientRegistrations } from './patient';
import { formFillerInjection, FormFillerRegistrations } from './formFiller';
import { generalInjection, GeneralRegistrations } from './general';
import {
  SDCFormResponseInjection,
  SDCFormResponseRegistrations,
} from './SDCFormResponse';

/*
  This file is used to configure automatic DI (Dependency Injection). See https://www.youtube.com/watch?v=IKD2-MAkXyQ for information on what dependency injection is and
  its benefits.

  As of this writing, this application uses `awilix` (https://github.com/jeffijoe/awilix)  to carry out automatic
  dependency injection.

  Here is an example of how to configure a class to have its dependency injected by awilix:

  Let's say class A has dependency on getting an instance of class B. Then we can allow class B to be injected by adding an entry to `MyCradle` (see below), the name of all possible things that can be injected. The left side of the entry is the name that will be used by the class that depends on that class/value/etc, while the righthand side will be the type of that field. So taking the example above, we would do

    type MyCradle = .... & {
      b: asClass(B).singleton()
    };

  And now inside class A:

    interface Dependencies {
      b: B; // the name of this object field must match what you used inside the `MyCradle` object
    }

    class A {
      b: B;

      constructor({ b }: Dependencies) {
        this.b = b;
      }

      someFunction() {
        this.b.someFunctionDefinedInClassB();
      }
    }

  When adding a new feature to the application, please create a new injection file and create it similar to how the other existing features are used in the code in this file.

  This DI setup is environment-aware, so you can instantiate different implementations of an abstract class/provide different values (see here for what dependecy inversion principle is): https://dzone.com/articles/solid-principles-dependency-inversion-principle) depending on the environment. For example, perhaps you have a fake database for test environments and a real one for development and production environments.
*/

type MyCradle = PatientRegistrations &
  PatientRegistrations &
  SDCFormRegistrations &
  GeneralRegistrations &
  FormFillerRegistrations &
  SDCFormResponseRegistrations;

export type EnvironmentTypes = 'production' | 'development' | 'test';

function configureInjection(environment: EnvironmentTypes) {
  const container = createContainer<MyCradle>({
    injectionMode: InjectionMode.PROXY,
  });

  function registerEnvironmentSpecificDependencies() {
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
      patientInjection().registerTestDependencies(container);
      formFillerInjection().registerTestDependencies(container);
    }

    function registerProdAndDevCommonDependencies() {
      // register any dependencies that are shared between production and development environments here
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
    generalInjection().registerEnvironmentIndependentDependencies(container);
    patientInjection().registerEnvironmentIndependentDependencies(container);
    SDCFormInjection().registerEnvironmentIndependentDependencies(container);
    formFillerInjection().registerEnvironmentIndependentDependencies(container);
    SDCFormResponseInjection().registerEnvironmentIndependentDependencies(
      container
    );
  }

  // configure any environment independent dependencies here

  registerEnvironmentIndependentDependencies();
  registerEnvironmentSpecificDependencies();

  return container;
}

export class DiContainer {
  private static instance: AwilixContainer<MyCradle>;

  private static isDisposed = false;

  public static setupInjection(
    environment: EnvironmentTypes = process.env.NODE_ENV as EnvironmentTypes
  ): AwilixContainer<MyCradle> {
    if (!DiContainer.instance || this.isDisposed) {
      DiContainer.instance = configureInjection(
        environment || process.env.NODE_ENV
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

export const diContainer: () => AwilixContainer<MyCradle> = () =>
  DiContainer.setupInjection();
