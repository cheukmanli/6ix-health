import { diContainer, DiContainer } from 'config/injection';

export async function main(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    // Do NOT touch this line as it is used for production
    DiContainer.setupInjection('production');
  } else {
    /*
      You may change this to one of ['production', 'development', 'test'] to run the app in different environments. For example, you may want to run the app in a 'development' environment to be able to work with local instances of MongoDB databases rather than production configured databases.
    */
    DiContainer.setupInjection('production');
  }

  const { expressApp } = diContainer().cradle;
  expressApp.boot();
}
