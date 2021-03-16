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

  it('should behave as expected when creating a patient successfully', async () => {
    const fakePatient = {
      OHIPNumber: '12345678',
      firstName: 'Bob',
      lastName: 'Smith',
    };

    const { createPatientUseCase } = diContainer().cradle;

    const createPatientMock = jest
      .spyOn(createPatientUseCase, 'execute')
      .mockResolvedValue(Right(fakePatient));

    const res = await request(app).post('/api/v1/patient').send(fakePatient);

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(fakePatient);

    createPatientMock.mockRestore();
  });

  it('should behave as expected when getting patients successfully', async () => {
    const fakePatients = [
      {
        OHIPNumber: '12345678',
        firstName: 'Bob',
        lastName: 'Smith',
      },
      {
        OHIPNumber: '12345678',
        firstName: 'Bob',
        lastName: 'Smith',
      },
    ];

    const { getPatientsUseCase } = diContainer().cradle;

    const getPatientsMock = jest
      .spyOn(getPatientsUseCase, 'execute')
      .mockResolvedValue(Right(fakePatients));

    const res = await request(app).get('/api/v1/patient').send();

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(fakePatients);
    getPatientsMock.mockRestore();
  });

  it('should behave as expected when updating a patient successfully', async () => {
    const fakePatient = {
      OHIPNumber: '12345678',
      firstName: 'Bob',
      lastName: 'Smith',
    };

    const { updatePatientUseCase } = diContainer().cradle;

    const updatePatientMock = jest
      .spyOn(updatePatientUseCase, 'execute')
      .mockResolvedValue(Right(fakePatient));

    const res = await request(app).put('/api/v1/patient').send(fakePatient);

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(fakePatient);

    updatePatientMock.mockRestore();
  });

  it('should behave as expected when deleting a patient successfully', async () => {
    const { deletePatientUseCase } = diContainer().cradle;

    const deletePatientMock = jest
      .spyOn(deletePatientUseCase, 'execute')
      .mockResolvedValue(Nothing);

    const res = await request(app).delete('/api/v1/patient').send();

    expect(res.status).toEqual(200);

    deletePatientMock.mockRestore();
  });
});
