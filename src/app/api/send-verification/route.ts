import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import twilio from "twilio";
import { connectToDatabase } from "@/lib/mongoose.mjs";
import Verification from "@/lib/models/Verification";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const COOLDOWN_PERIOD_MS = 60000; // 1 minute cooldown

export async function POST(req: NextRequest) {
	try {
		const { phoneNumber, resend } = await req.json();

		if (!phoneNumber) {
			return NextResponse.json(
				{ message: "Phone number is required" },
				{ status: 400 }
			);
		}

		const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
		console.log("Formatted phone number:", formattedPhoneNumber);

		await connectToDatabase();

		const currentTime = new Date().getTime();
		const existingRecord = await Verification.findOne({
			phoneNumber: formattedPhoneNumber,
		});

		if (existingRecord) {
			if (
				!resend &&
				currentTime - existingRecord.timestamp <
					COOLDOWN_PERIOD_MS
			) {
				return NextResponse.json(
					{
						message: "Please wait before requesting a new code",
					},
					{ status: 429 }
				);
			}
		}

		const verificationCode = Math.floor(
			100000 + Math.random() * 900000
		); // Generate 6-digit code
		await Verification.findOneAndUpdate(
			{ phoneNumber: formattedPhoneNumber },
			{ verificationCode, timestamp: currentTime },
			{ upsert: true, new: true }
		);

		const message = await client.messages.create({
			body: `Your verification code is ${verificationCode}`,
			from: process.env.TWILIO_PHONE_NUMBER,
			to: formattedPhoneNumber,
		});

		console.log(
			"Verification code sent successfully:",
			message.sid
		);

		return NextResponse.json({
			message: "Verification code sent",
		});
	} catch (error: any) {
		console.error("Error in /api/send-verification:", error);
		return NextResponse.json(
			{
				message: "Failed to send verification code",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}
