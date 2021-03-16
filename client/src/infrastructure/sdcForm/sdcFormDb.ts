import PouchDB from 'pouchdb';
import { SDCFormDTO } from './SDCFormDto';

export const sdcFormDbCreator = (runPouchDbAsStandaloneServer: boolean) => {
  return new PouchDB<SDCFormDTO>(
    runPouchDbAsStandaloneServer ? 'http://localhost:5984/SDCForms' : 'SDCForms'
  );
};
