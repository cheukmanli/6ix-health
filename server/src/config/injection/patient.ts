import { asClass, AwilixContainer } from 'awilix';
import { CreatePatientUseCase } from 'domain/usecases/patient/createPatient/CreatePatientUseCase';
import { IPatientEntityGateway } from 'domain/usecases/patient/IPatientEntityGateway';
import { PatientMockEntityGateway } from 'data/patient/PatientMockEntityGateway';
import { PatientMongoEntityGateway } from 'data/patient/PatientMongoEntityGateway';
import { CreatePatientController } from 'entrypoint/web/controllers/patient/CreatePatientController';
import { PatientRouter } from 'entrypoint/web/routers/PatientRouter';
import { GetPatientsController } from 'entrypoint/web/controllers/patient/GetPatientsController';
import { GetPatientsUseCase } from 'domain/usecases/patient/getPatients/GetPatientsUseCase';
import { DeletePatientController } from 'entrypoint/web/controllers/patient/DeletePatientController';
import { DeletePatientUseCase } from 'domain/usecases/patient/deletePatient/DeletePatientUseCase';
import { UpdatePatientUseCase } from 'domain/usecases/patient/updatePatient/UpdatePatientUseCase';
import { UpdatePatientController } from 'entrypoint/web/controllers/patient/UpdatePatientController';

export type PatientRegistrations = {
  patientEntityGateway: IPatientEntityGateway;
  createPatientUseCase: CreatePatientUseCase;
  getPatientsUseCase: GetPatientsUseCase;
  updatePatientUseCase: UpdatePatientUseCase;
  deletePatientUseCase: DeletePatientUseCase;
  createPatientController: CreatePatientController;
  updatePatientController: UpdatePatientController;
  deletePatientController: DeletePatientController;
  getPatientsController: GetPatientsController;
  patientRouter: PatientRouter;
};

export const patientInjection = () => ({
  registerEnvironmentIndependentDependencies: (container: AwilixContainer) => {
    container.register({
      patientEntityGateway: asClass(PatientMongoEntityGateway).singleton(),
      createPatientUseCase: asClass(CreatePatientUseCase).singleton(),
      getPatientsUseCase: asClass(GetPatientsUseCase).singleton(),
      updatePatientUseCase: asClass(UpdatePatientUseCase).singleton(),
      deletePatientUseCase: asClass(DeletePatientUseCase).singleton(),
      createPatientController: asClass(CreatePatientController).singleton(),
      deletePatientController: asClass(DeletePatientController).singleton(),
      updatePatientController: asClass(UpdatePatientController).singleton(),
      getPatientsController: asClass(GetPatientsController).singleton(),
      patientRouter: asClass(PatientRouter).singleton(),
    });
  },
  registerTestDependencies: (container: AwilixContainer) => {
    container.register({
      patientEntityGateway: asClass(PatientMockEntityGateway).singleton(),
    });
  },
});
