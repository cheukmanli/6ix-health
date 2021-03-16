import { UseCaseError } from 'domain/definition/UseCaseError';

export class CreateSDCFormInvalidXMLStringRequest extends UseCaseError {
  constructor() {
    super(`Invalid XML string, please try again`);
  }
}
