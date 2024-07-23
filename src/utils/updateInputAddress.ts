import { connectToDatabase } from '../lib/mongoose.mjs';
import InputAddress, { IInputAddress } from '../lib/models/InputAddress';

export async function updateInputAddressById(id: string, data: Partial<IInputAddress>) {
  await connectToDatabase();

  const updatedAddress = await InputAddress.findByIdAndUpdate(id, data, { new: true });

  if (!updatedAddress) {
    throw new Error('Address not found');
  }

  return updatedAddress;
}
