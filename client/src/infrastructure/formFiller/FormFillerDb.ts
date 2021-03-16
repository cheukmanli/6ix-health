import PouchDB from 'pouchdb';
import { FormFillerDTO } from './FormFillerDto';

export const formFillerDbCreator = (runPouchDbAsStandaloneServer: boolean) => {
  return new PouchDB<FormFillerDTO>(
    runPouchDbAsStandaloneServer
      ? 'http://localhost:5984/formFillers'
      : 'formFillers'
  );
};
