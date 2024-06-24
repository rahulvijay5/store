import { GetInsights } from "@/actions/GetInsights";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const insights = await GetInsights();
    return NextResponse.json({ message:insights, status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: "Error Fetching Sales Insight.",
      status: 200,
    });
  }
}