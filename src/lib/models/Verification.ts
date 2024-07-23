import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVerification extends Document {
  phoneNumber: string;
  verificationCode: number;
  timestamp: number;
  isConfirmed: boolean; // Add this line to the interface
}

const verificationSchema: Schema<IVerification> = new Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    verificationCode: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    isConfirmed: { type: Boolean, default: false }, // Add this line to the schema
  },
  {
    versionKey: false,
    collection: 'verifications', // Explicitly set the collection name
  }
);

const Verification: Model<IVerification> = mongoose.models.Verification || mongoose.model<IVerification>('Verification', verificationSchema);

export default Verification;
