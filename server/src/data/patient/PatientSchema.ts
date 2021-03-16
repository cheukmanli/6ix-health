import { Schema, Document } from 'mongoose';

export interface PatientDocument extends Document {
  OHIPNumber: string;
  firstName: string;
  lastName: string;
}

export const PatientSchema = new Schema({
  OHIPNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});
