/* eslint-disable @typescript-eslint/camelcase */
import FormFiller from '../../domain/formFiller/FormFiller';
import { IFormFillerRepository } from '../../domain/formFiller/FormFillerRepository';
import { FormFillerDTO } from './FormFillerDto';
import FormFillerMapper from './FormFillerMapper';

interface Dependencies {
  formFillerDb: PouchDB.Database<FormFillerDTO>;
}

export class FormFillerRepositoryFake implements IFormFillerRepository {
  private db: PouchDB.Database<FormFillerDTO>;

  constructor({ formFillerDb }: Dependencies) {
    this.db = formFillerDb;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addFormFiller(formFiller: FormFiller): Promise<FormFiller> {
    await new Promise((res) => setTimeout(res, 1000));
    const formFillerDto = FormFillerMapper.toDTO(formFiller);
    await this.db.put({ ...formFillerDto, _id: formFillerDto.formFillerId });
    return FormFillerMapper.toDomain(formFillerDto);
  }

  async getFormFillers(): Promise<FormFiller[]> {
    await new Promise((res) => setTimeout(res, 1000));
    const allDocsResponse = await this.db.allDocs({ include_docs: true });
    return allDocsResponse.rows.map((document) =>
      FormFillerMapper.toDomain(document.doc as FormFillerDTO)
    );
  }

  async updateFormFiller(formFiller: FormFiller): Promise<FormFiller> {
    const formFillerDto = FormFillerMapper.toDTO(formFiller);
    const { _id, _rev } = await this.db.get(formFillerDto.formFillerId);

    await this.db.put({
      ...formFillerDto,
      _id,
      _rev,
    });

    return formFiller;
  }

  async deleteFormFiller(formFiller: FormFiller): Promise<void> {
    await new Promise((res) => setTimeout(res, 1000));
    const formFillerDto = FormFillerMapper.toDTO(formFiller);
    const currentlyStoredFormFiller = await this.db.get(
      formFillerDto.formFillerId
    );
    await this.db.remove(currentlyStoredFormFiller);
  }
}
