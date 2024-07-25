import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVerification extends Document {
  phoneNumber: string;
  formattedPhoneNumber: string;
  verificationCode: number;
  timestamp: number;
  isConfirmed: boolean;
}

const verificationSchema: Schema<IVerification> = new Schema(
  {
    phoneNumber: { type: String, required: true },
    formattedPhoneNumber: { type: String, required: true },
    verificationCode: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    isConfirmed: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    collection: 'verifications',  // Explicitly set the collection name
  }
);

const Verification: Model<IVerification> = mongoose.models.Verification || mongoose.model<IVerification>('Verification', verificationSchema);

export default Verification;
