import { User } from 'domain/entities/core/User';

export interface Patient extends User {
  OHIPNumber: string;
}
