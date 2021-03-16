import { UseCaseError } from 'domain/definition/UseCaseError';

export class GetDefaultSDCFormResponseInvalidRequest extends UseCaseError {
  constructor() {
    super(`Invalid SDCFormId, please try again`);
  }
}
