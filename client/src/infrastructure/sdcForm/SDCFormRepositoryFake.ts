/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import range from 'lodash/range';
import { random as fakerRandom } from 'faker';
import { SDCForm } from '../../domain/sdcForm/SDCForm';
import { ISDCFormRepository } from '../../domain/sdcForm/SDCFormRepository';
import { SDCFormFactory } from '../../mirage/factories/SDCForm';
import { SDCFormDTO } from './SDCFormDto';
import SDCFormMapper from './SDCFormMapper';

interface Dependencies {
  sdcFormDb: PouchDB.Database<SDCFormDTO>;
}

export class SDCFormRepositoryFake implements ISDCFormRepository {
  private db: PouchDB.Database<SDCFormDTO>;

  constructor({ sdcFormDb }: Dependencies) {
    this.db = sdcFormDb;
  }

  async addSDCForm(sdcFormXML: File): Promise<SDCForm> {
    await new Promise((res) => setTimeout(res, 1000));

    const sdcFormDto = SDCFormFactory.createFake();

    await this.db.put({ ...sdcFormDto, _id: sdcFormDto.SDCFormId });
    return SDCFormMapper.toDomain(sdcFormDto);
  }

  async getAllSDCForms(): Promise<SDCForm[]> {
    await new Promise((res) => setTimeout(res, 1000));
    const allDocsResponse = await this.db.allDocs({ include_docs: true });
    return allDocsResponse.rows.map((document) =>
      SDCFormMapper.toDomain(document.doc as SDCFormDTO)
    );
  }

  getSDCFormsByIds(...ids: string[]): Promise<SDCForm[]> {
    throw new Error('Method not implemented.');
  }

  async querySDCForms(
    SDCFormIds: string[],
    diagnosticProcedureIds: string[],
    queryText: string
  ): Promise<SDCForm[]> {
    await new Promise((res) => setTimeout(res, 1000));
    const sdcFormDTOs = range(1).map(() =>
      SDCFormFactory.createFake({ version: '0' })
    );
    return sdcFormDTOs.map(SDCFormMapper.toDomain);
  }

  async updateSDCForm(sdcForm: SDCForm, sdcFormXML: File): Promise<SDCForm> {
    const sdcFormDto = SDCFormMapper.toDTO(sdcForm);
    const { _id, _rev } = await this.db.get(sdcFormDto.SDCFormId);

    const updatedSdcFormDto = {
      ...sdcFormDto,
      version: `${parseInt(sdcFormDto.version, 10) + 1}`,
    };

    await this.db.put({
      ...updatedSdcFormDto,
      _id,
      _rev,
    });

    return SDCFormMapper.toDomain(updatedSdcFormDto);
  }

  async deleteSDCForm(...ids: string[]): Promise<void> {
    await new Promise((res) => setTimeout(res, 1000));
    const allDocsResponse = await this.db.allDocs({ include_docs: true });
    const toDeleteForms = allDocsResponse.rows.map((document) => {
      return { ...(document.doc as SDCFormDTO), _deleted: true };
    });
    await this.db.bulkDocs(toDeleteForms);
  }
}
