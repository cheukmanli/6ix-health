import { UseCaseError } from 'domain/definition/UseCaseError';

export class UpdateSDCFormResponseInvalidRequest extends UseCaseError {
  constructor() {
    super(`Invalid request, please try again`);
  }
}
