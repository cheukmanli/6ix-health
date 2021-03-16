import request from 'supertest';

import { Application } from 'express';
import { DiContainer, diContainer } from 'config/injection';
import { Right } from 'purify-ts/Either';
import { Nothing } from 'purify-ts/Maybe';

let app: Application;

describe('Tests for SDCForm Routes', () => {
  beforeAll(() => {
    DiContainer.setupInjection();
    const { expressApp } = diContainer().cradle;
    app = expressApp.boot();
  });

  afterAll(() => {
    DiContainer.dispose();
  });

  it('should behave as expected when creating a form filler successfully', async () => {
    const fakeFormFiller = {
      formFillerId: '12345678',
      firstName: 'Bob',
      lastName: 'Smith',
    };

    const { createFormFillerUseCase } = diContainer().cradle;

    const createFormFillerMock = jest
      .spyOn(createFormFillerUseCase, 'execute')
      .mockResolvedValue(Right(fakeFormFiller));

    const res = await request(app)
      .post('/api/v1/form-filler')
      .send(fakeFormFiller);

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(fakeFormFiller);

    createFormFillerMock.mockRestore();
  });

  it('should behave as expected when getting form fillers successfully', async () => {
    const fakeFormFillers = [
      {
        formFillerId: '12345678',
        firstName: 'Bob',
        lastName: 'Smith',
      },
      {
        formFillerId: '12345678',
        firstName: 'Bob',
        lastName: 'Smith',
      },
    ];

    const { getFormFillersUseCase } = diContainer().cradle;

    const getFormFillersMock = jest
      .spyOn(getFormFillersUseCase, 'execute')
      .mockResolvedValue(Right(fakeFormFillers));

    const res = await request(app).get('/api/v1/form-filler').send();

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(fakeFormFillers);
    getFormFillersMock.mockRestore();
  });

  it('should behave as expected when updating a form filler successfully', async () => {
    const fakeFormFiller = {
      formFillerId: '12345678',
      firstName: 'Bob',
      lastName: 'Smith',
    };

    const { updateFormFillerUseCase } = diContainer().cradle;

    const updateFormFillerMock = jest
      .spyOn(updateFormFillerUseCase, 'execute')
      .mockResolvedValue(Right(fakeFormFiller));

    const res = await request(app)
      .put('/api/v1/form-filler')
      .send(fakeFormFiller);

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(fakeFormFiller);

    updateFormFillerMock.mockRestore();
  });

  it('should behave as expected when deleting a form filler successfully', async () => {
    const { deleteFormFillerUseCase } = diContainer().cradle;

    const deleteFormFillerMock = jest
      .spyOn(deleteFormFillerUseCase, 'execute')
      .mockResolvedValue(Nothing);

    const res = await request(app).delete('/api/v1/form-filler').send();

    expect(res.status).toEqual(200);

    deleteFormFillerMock.mockRestore();
  });
});
