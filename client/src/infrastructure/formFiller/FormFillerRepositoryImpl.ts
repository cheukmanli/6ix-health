import axios from 'axios';
import FormFiller from '../../domain/formFiller/FormFiller';
import { IFormFillerRepository } from '../../domain/formFiller/FormFillerRepository';
import { FormFillerDTO } from './FormFillerDto';
import FormFillerMapper from './FormFillerMapper';

const formFillerApiURL = '/api/v1/form-filler';
export default class FormFillerRepositoryImpl implements IFormFillerRepository {
  async addFormFiller(formFiller: FormFiller): Promise<FormFiller> {
    const formFillerToBeCreateDto = FormFillerMapper.toDTO(formFiller);

    const res = await axios.post<FormFillerDTO>(
      formFillerApiURL,
      formFillerToBeCreateDto
    );

    return FormFillerMapper.toDomain(res.data);
  }

  async getFormFillers(): Promise<FormFiller[]> {
    const res = await axios.get<FormFillerDTO[]>(formFillerApiURL);
    return res.data.map(FormFillerMapper.toDomain);
  }

  async updateFormFiller(formFiller: FormFiller): Promise<FormFiller> {
    const formFillerToBeUpdatedDto = FormFillerMapper.toDTO(formFiller);

    const res = await axios.put<FormFillerDTO>(
      formFillerApiURL,
      formFillerToBeUpdatedDto
    );

    return FormFillerMapper.toDomain(res.data);
  }

  async deleteFormFiller(formFiller: FormFiller): Promise<void> {
    await axios(formFillerApiURL, {
      method: 'delete',
      data: FormFillerMapper.toDTO(formFiller),
    });
  }
}
