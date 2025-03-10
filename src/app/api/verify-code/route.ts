import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongoose.mjs";
import Verification from "@/lib/models/Verification";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export async function POST(req: NextRequest) {
	try {
		const { code, phoneNumber } = await req.json();

		if (!code || !phoneNumber) {
			console.error(
				"Verification code and phone number are required"
			);
			return NextResponse.json(
				{
					message:
						"Verification code and phone number are required",
				},
				{ status: 400 }
			);
		}

		const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
		console.log(
			"Formatted phone number for verification:",
			formattedPhoneNumber
		);

		await connectToDatabase();

		const record = await Verification.findOne({
			$or: [
				{ phoneNumber: phoneNumber },
				{ formattedPhoneNumber: formattedPhoneNumber },
			],
		});

		if (!record) {
			console.warn("Verification code not found");
			return NextResponse.json(
				{ message: "Verification code not found" },
				{ status: 400 }
			);
		}

		const currentTime = new Date().getTime();

		if (currentTime - record.timestamp > 3 * 60 * 1000) {
			console.warn("인증번호가 만료되었습니다.");
			return NextResponse.json(
				{ message: "인증번호가 만료되었습니다." },
				{ status: 400 }
			);
		}

		if (parseInt(code) !== record.verificationCode) {
			console.warn("인증 코드가 일치하지 않습니다.");
			return NextResponse.json(
				{ message: "인증 코드가 일치하지 않습니다." },
				{ status: 400 }
			);
		}

		// Update the record to set isConfirmed to true
		record.isConfirmed = true;
		record.phoneNumber = record.phoneNumber || phoneNumber; // Ensure phoneNumber is set
		await record.save();

		console.log("인증이 확인되었습니다.");
		return NextResponse.json({
			message: "인증이 확인되었습니다.",
		});
	} catch (error: any) {
		console.error("Error in /api/verify-code:", error);
		return NextResponse.json(
			{ message: "인증 실패 했습니다.", error: error.message },
			{ status: 500 }
		);
	}
}
