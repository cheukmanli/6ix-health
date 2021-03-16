import mongoose from 'mongoose';
import { Patient } from 'domain/entities/Patient';
import {
  CreatePatientPayload,
  IPatientEntityGateway,
  UpdatePatientPayload,
} from 'domain/usecases/patient/IPatientEntityGateway';
import { PatientDocument, PatientSchema } from './PatientSchema';

interface Dependendencies {
  mongoBaseURL: string;
}
export class PatientMongoEntityGateway implements IPatientEntityGateway {
  private connection: mongoose.Connection;
  private PatientModel: mongoose.Model<PatientDocument, {}>;

  constructor({ mongoBaseURL }: Dependendencies) {
    this.connection = mongoose.createConnection(
      `${mongoBaseURL}/Patient?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    this.PatientModel = this.connection.model<PatientDocument>(
      'PatientModel',
      PatientSchema
    );
  }

  async getPatients(): Promise<Patient[]> {
    try {
      const patientDocuments = await this.PatientModel.find();
      return patientDocuments.map(({ firstName, lastName, OHIPNumber }) => ({
        firstName,
        lastName,
        OHIPNumber,
      }));
    } catch (err) {
      throw Error(
        'Database Error: Connection to database could not be established ' +
          err.message
      );
    }
  }
  async createPatient(payload: CreatePatientPayload): Promise<Patient> {
    try {
      const {
        OHIPNumber,
        firstName,
        lastName,
      } = await this.PatientModel.create(payload);

      return {
        OHIPNumber,
        firstName,
        lastName,
      };
    } catch (err) {
      if (err.code == 11000) {
        throw Error('already exists');
      }
      throw Error(
        'Database Error: Connection to database could not be established create error for ' +
          payload.OHIPNumber +
          err.message
      );
    }
  }

  async updatePatient(payload: UpdatePatientPayload): Promise<Patient> {
    try {
      const patientDocument = await this.PatientModel.findOneAndUpdate(
        { OHIPNumber: payload.OHIPNumber },
        payload,
        {
          new: true,
        }
      );

      if (!patientDocument) {
        throw Error('not found');
      }

      const { OHIPNumber, firstName, lastName } = patientDocument.toObject();

      return { OHIPNumber, firstName, lastName };
    } catch (err) {
      if (err.message === 'not found') {
        throw Error(err);
      }

      throw Error();
    }
  }

  async deletePatient(OHIPNumber: string): Promise<void> {
    let response;
    try {
      response = await this.PatientModel.findOneAndDelete({
        OHIPNumber,
      });
    } catch (err) {
      throw Error(
        'Database Error: Connection to database could not be established delete error for' +
          OHIPNumber +
          err.message
      );
    }

    if (!response) {
      throw Error('not found');
    }
  }
}
