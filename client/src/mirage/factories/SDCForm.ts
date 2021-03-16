import { random as fakerRandom } from 'faker';
import { SDCFormDTO } from '../../infrastructure/sdcForm/SDCFormDto';
import forStudentsForm from '../fixtures/sdcForm/forStudents.json';
import strokeForm from '../fixtures/sdcForm/PKG_ACR_CT_STROKE.json';
import thyroidForm from '../fixtures/sdcForm/PKG_THYROID_US.json';
import adrenalForm from '../fixtures/sdcForm/Adrenal.Bx.Res.129_3.003.001.REL_sdcFDF.json';
import appendixForm from '../fixtures/sdcForm/Appendix.Res.135_3.002.001.REL_sdcFDF.json';

interface Fields {
  version?: string;
  title?: string;
}

export class SDCFormFactory {
  static createFake({ version, title }: Fields = {}): SDCFormDTO {
    const randomFormChosenForCreation = fakerRandom.arrayElement([
      forStudentsForm,
      strokeForm,
      thyroidForm,
      adrenalForm,
      appendixForm,
    ]);
    let formDto: SDCFormDTO = JSON.parse(
      JSON.stringify(randomFormChosenForCreation)
    );
    formDto = {
      ...formDto,
      SDCFormId: formDto.SDCFormId,
      title: title || formDto.title,
      version: version || formDto.version,
    };
    return formDto;
  }
}
