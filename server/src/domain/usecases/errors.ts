import { UseCaseError } from '../../domain/definition/UseCaseError';

export class AlreadyExistsRequestError extends UseCaseError {
  constructor() {
    super('');
  }
}

export class NotFoundRequestError extends UseCaseError {
  constructor() {
    super('');
  }
}

export class ServerRequestError extends UseCaseError {
  constructor() {
    super('');
  }
}

export class UnknownRequestError extends UseCaseError {
  constructor() {
    super('');
  }
}
