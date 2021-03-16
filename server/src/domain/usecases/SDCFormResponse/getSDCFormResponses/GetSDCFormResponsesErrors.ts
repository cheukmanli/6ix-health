import { UseCaseError } from 'domain/definition/UseCaseError';

export class GetSDCFormResponsesInvalidRequest extends UseCaseError {
  constructor() {
    super(`Invalid request, please try again`);
  }
}
