import mongoose from 'mongoose';
import { FormFiller } from 'domain/entities/FormFiller';
import {
  IFormFillerEntityGateway,
  CreateFormFillerPayload,
  UpdateFormFillerPayload,
} from 'domain/usecases/formFiller/IFormFillerEntityGateway';
import { FormFillerDocument, FormFillerSchema } from './FormFillerSchema';

interface Dependendencies {
  mongoBaseURL: string;
}
export class FormFillerMongoEntityGateway implements IFormFillerEntityGateway {
  private connection: mongoose.Connection;

  private FormFillerModel: mongoose.Model<FormFillerDocument, {}>;
  constructor({ mongoBaseURL }: Dependendencies) {
    this.connection = mongoose.createConnection(
      `${mongoBaseURL}/FormFiller?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    this.FormFillerModel = this.connection.model<FormFillerDocument>(
      'FormFillerModel',
      FormFillerSchema
    );
  }

  async getFormFillers(): Promise<FormFiller[]> {
    try {
      const formFillerDocuments = await this.FormFillerModel.find();
      return formFillerDocuments.map(
        ({ firstName, lastName, formFillerId }) => ({
          firstName,
          lastName,
          formFillerId,
        })
      );
    } catch (err) {
      throw Error(
        'Database Error: Connection to database could not be established ' +
          err.message
      );
    }
  }
  async createFormFiller(
    payload: CreateFormFillerPayload
  ): Promise<FormFiller> {
    try {
      const {
        formFillerId,
        firstName,
        lastName,
      } = await this.FormFillerModel.create(payload);
      return {
        formFillerId,
        firstName,
        lastName,
      };
    } catch (err) {
      if (err.code == 11000) {
        throw Error('already exists');
      }
      throw Error(
        'Database Error: Connection to database could not be established create error for ' +
          payload.formFillerId +
          err.message
      );
    }
  }

  async updateFormFiller(
    payload: UpdateFormFillerPayload
  ): Promise<FormFiller> {
    try {
      const formFillerDocument = await this.FormFillerModel.findOneAndUpdate(
        { formFillerId: payload.formFillerId },
        payload,
        {
          new: true,
        }
      );

      if (!formFillerDocument) {
        throw Error('not found');
      }

      const {
        formFillerId,
        firstName,
        lastName,
      } = formFillerDocument.toObject();

      return { formFillerId, firstName, lastName };
    } catch (err) {
      if (err.message === 'not found') {
        throw Error(err);
      }

      throw Error();
    }
  }

  async deleteFormFiller(formFillerId: string): Promise<void> {
    let response;
    try {
      response = await this.FormFillerModel.findOneAndDelete({
        formFillerId,
      });
    } catch (err) {
      throw Error(
        'Database Error: Connection to database could not be established delete error for' +
          formFillerId +
          err.message
      );
    }

    if (!response) {
      throw Error('not found');
    }
  }
}
