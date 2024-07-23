import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose.mjs';
import Verification from '@/lib/models/Verification';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';

export async function POST(req: NextRequest) {
  try {
    const { code, phoneNumber } = await req.json();

    if (!code || !phoneNumber) {
      console.error('Verification code and phone number are required');
      return NextResponse.json({ message: 'Verification code and phone number are required' }, { status: 400 });
    }

    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    console.log('Formatted phone number for verification:', formattedPhoneNumber);

    await connectToDatabase();

    const record = await Verification.findOne({ phoneNumber: formattedPhoneNumber });

    if (!record) {
      console.warn('Verification code not found');
      return NextResponse.json({ message: 'Verification code not found' }, { status: 400 });
    }

    const currentTime = new Date().getTime();

    if (currentTime - record.timestamp > 3 * 60 * 1000) {
      console.warn('Verification code has expired');
      return NextResponse.json({ message: 'Verification code has expired' }, { status: 400 });
    }

    if (parseInt(code) !== record.verificationCode) {
      console.warn('Invalid verification code');
      return NextResponse.json({ message: 'Invalid verification code' }, { status: 400 });
    }

    console.log('Verification code is valid');
    return NextResponse.json({ message: 'Verification code is valid' });
  } catch (error: any) {
    console.error('Error in /api/verify-code:', error);
    return NextResponse.json({ message: 'Failed to verify code', error: error.message }, { status: 500 });
  }
}
