import { SDCForm } from 'domain/entities/SDCForm';
import {
  ISDCFormEntityGateway,
  CreateSDCFormPayload,
} from 'domain/usecases/SDCForm/ISDCFormEntityGateway';
import { parseSDCXML } from 'data/SDCForm/parser/SDCFormXMLParser';

export class SDCFormInMemoryEntityGateway implements ISDCFormEntityGateway {
  #forms: SDCForm[];

  constructor() {
    this.#forms = [];
  }

  async getSDCForm(SDCFormId: string): Promise<SDCForm | undefined> {
    const result = this.#forms.find((f) => f.SDCFormId === SDCFormId);
    return result;
  }

  async updateSDCForm(form: SDCForm): Promise<SDCForm | undefined> {
    const index = this.#forms.findIndex(
      (f: SDCForm) => f.SDCFormId === form.SDCFormId
    );
    this.#forms[index] = form;
    return form;
  }

  async createSDCForm(payload: CreateSDCFormPayload): Promise<SDCForm> {
    // Data conversion and parsing happens here
    const parsedPayload = parseSDCXML(payload.XMLString);

    if (parsedPayload != null) {
      if (this.#forms.find((f) => f.SDCFormId === parsedPayload.SDCFormId)) {
        throw Error('SDCForm ID already exists');
      }

      const newSDCForm: SDCForm = {
        ...parsedPayload,
      };

      this.#forms.push(newSDCForm);

      return newSDCForm;
    } else {
      throw new Error('XMLString not valid');
    }
  }

  async getSDCForms(
    SDCFormIds?: string[] | undefined,
    diagnosticProcedureIds?: string[] | undefined,
    query?: string | undefined
  ): Promise<SDCForm[]> {
    if (SDCFormIds) {
      let SDCForms: SDCForm[] = [];
      for (let i = 0; i < SDCFormIds.length; i++) {
        SDCForms = SDCForms.concat(
          this.#forms.filter((f) => f.SDCFormId == SDCFormIds[i])
        );
      }
      return SDCForms;
    } else if (diagnosticProcedureIds) {
      let SDCForms: SDCForm[] = [];
      for (let i = 0; i < diagnosticProcedureIds.length; i++) {
        SDCForms = SDCForms.concat(
          this.#forms.filter(
            (f) => f.diagnosticProcedureId == diagnosticProcedureIds[i]
          )
        );
      }
      return SDCForms;
    } else if (query) {
      return this.#forms.filter((f) =>
        Object.values(f.metadata).some((p) => {
          if (typeof p == 'string') {
            return p.includes(query);
          } else {
            return false;
          }
        })
      );
    }
    return this.#forms;
  }

  async deleteSDCForms(SDCFormId: string[]): Promise<void> {
    for (let i = 0; i < SDCFormId.length; i++) {
      const sdcform = this.#forms.find((f) => f.SDCFormId === SDCFormId[i]);
      if (sdcform) {
        const index: number = this.#forms.indexOf(sdcform);
        this.#forms.splice(index, 1);
      } else {
        throw Error('SDCForm Not Found');
      }
    }
  }
}
