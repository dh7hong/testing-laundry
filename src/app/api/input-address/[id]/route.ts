import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose.mjs";
import InputAddress from "@/lib/models/InputAddress";
import { updateAddressById } from "@/lib/mongoose.mjs";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	await connectToDatabase();
	const { id } = params;

	try {
		const inputAddress = await InputAddress.findById(id);
		if (!inputAddress) {
			return NextResponse.json(
				{ message: "InputAddress not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(inputAddress, { status: 200 });
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message },
			{ status: 500 }
		);
	}
}

import { updateInputAddressById } from '@/utils/updateInputAddress';

export async function PUT(req: { json: () => any; }, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

  try {
    const updatedAddress = await updateInputAddressById(id, body);
    return new Response(JSON.stringify(updatedAddress), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in PUT /api/input-address/[id]:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	await connectToDatabase();
	const { id } = params;

	try {
		const inputAddress = await InputAddress.findByIdAndDelete(
			id
		);
		if (!inputAddress) {
			return NextResponse.json(
				{ message: "InputAddress not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ message: "InputAddress deleted successfully" },
			{ status: 200 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message },
			{ status: 500 }
		);
	}
}
