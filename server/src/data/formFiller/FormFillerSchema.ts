import { Schema, Document } from 'mongoose';

export interface FormFillerDocument extends Document {
  formFillerId: string;
  firstName: string;
  lastName: string;
}

export const FormFillerSchema = new Schema({
  formFillerId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});
