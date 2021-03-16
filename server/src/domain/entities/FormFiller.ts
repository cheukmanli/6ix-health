import { User } from 'domain/entities/core/User';

export interface FormFiller extends User {
  formFillerId: string;
}
