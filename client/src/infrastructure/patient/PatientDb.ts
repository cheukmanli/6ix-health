import PouchDB from 'pouchdb';
import { PatientDTO } from './PatientDto';

export const patientDbCreator = (runPouchDbAsStandaloneServer: boolean) => {
  return new PouchDB<PatientDTO>(
    runPouchDbAsStandaloneServer ? 'http://localhost:5984/patients' : 'patients'
  );
};
