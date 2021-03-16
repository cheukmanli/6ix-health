import { DiContainer, diContainer } from '../../config/injection';

describe('DiContainer', () => {
  afterEach(() => DiContainer.dispose());

  it('injects correctly in production mode', async () => {
    DiContainer.setupInjection('production');
    const { environmentMode } = diContainer().cradle;
    expect(environmentMode).toEqual('production');
  });

  it('injects correctly in development mode', async () => {
    DiContainer.setupInjection('development');
    const { environmentMode } = diContainer().cradle;
    expect(environmentMode).toEqual('development');
  });

  it('injects correctly in testing mode', async () => {
    // can alternatively explictly specify 'test' as well
    DiContainer.setupInjection();
    const { environmentMode } = diContainer().cradle;
    expect(environmentMode).toEqual('test');
  });
});
