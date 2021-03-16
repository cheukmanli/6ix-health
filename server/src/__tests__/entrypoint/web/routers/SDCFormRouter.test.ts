import request from 'supertest';

import { Application } from 'express';
import { DiContainer, diContainer } from 'config/injection';
import { Right } from 'purify-ts/Either';

let app: Application;

describe('SDCForm Routes', () => {
  beforeAll(() => {
    DiContainer.setupInjection();
    const { expressApp } = diContainer().cradle;
    app = expressApp.boot();
  });

  afterAll(() => {
    DiContainer.dispose();
  });

  it('should return the expected response for Create SDCForm', async () => {
    const fakeSDCForm = {
      SDCFormId: 'mockSDCFormId',
      version: '0',
      diagnosticProcedureId: 'mockDiagnosticProcedureId',
      title: 'mockTitle',
      metadata: {},
      body: {
        minRepetitions: 1,
        maxRepetitions: 1,
      },
      footer: {},
    };

    const { createSDCFormUseCase } = diContainer().cradle;

    const createSDCFormMock = jest
      .spyOn(createSDCFormUseCase, 'execute')
      .mockResolvedValue(Right(fakeSDCForm));

    const res = await request(app).post('/api/v1/SDCForm').send({
      XMLString: 'mockString',
    });

    expect.assertions(2);

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(fakeSDCForm);

    createSDCFormMock.mockRestore();
  });
});
