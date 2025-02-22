import { NextResponse } from "next/server";
import connectToDatabase from "@/app/_middleware/mongodb";
import PackageModel from "@/app/_models/packagelisting";

/**
 * @desc Handle POST request - Save new package data
 * @route POST /api/package
 */
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: "Request body is missing" }, { status: 400 });
    }

    console.log("Received data:", body);
    const packageData = new PackageModel(body);
    await packageData.save();

    return NextResponse.json({ message: "Package data saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error saving package data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * @desc Handle GET request - Retrieve package data by packageId
 * @route GET /api/package?packageId={packageId}
 */
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const packageId = url.searchParams.get("packageId");
    if (!packageId) {
      return NextResponse.json({ message: "Package ID is required" }, { status: 400 });
    }

    const packageData = await PackageModel.findOne({ packageId }).exec();
    if (!packageData) {
      return NextResponse.json({ message: "No package data found" }, { status: 404 });
    }

    return NextResponse.json(packageData, { status: 200 });
  } catch (error) {
    console.error("Error retrieving package data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * @desc Handle PATCH request - Update package data by packageId
 * @route PATCH /api/package?packageId={packageId}
 */
export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const packageId = url.searchParams.get("packageId");
    if (!packageId) {
      return NextResponse.json({ message: "Package ID is required" }, { status: 400 });
    }

    const updates = await req.json();
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: "No data provided for update" }, { status: 400 });
    }

    const packageData = await PackageModel.findOneAndUpdate({ packageId }, updates, { new: true }).exec();
    if (!packageData) {
      return NextResponse.json({ message: "No package data found for this package ID" }, { status: 404 });
    }

    return NextResponse.json({ message: "Package data updated successfully", packageData }, { status: 200 });
  } catch (error) {
    console.error("Error updating package data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * @desc Handle DELETE request - Delete package data by packageId
 * @route DELETE /api/package?packageId={packageId}
 */
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const packageId = url.searchParams.get("packageId");

    if (!packageId) {
      return NextResponse.json({ message: "Package ID is required" }, { status: 400 });
    }

    const packageData = await PackageModel.findOneAndDelete({ packageId }).exec();
    if (!packageData) {
      return NextResponse.json({ message: "No package data found for this package ID" }, { status: 404 });
    }

    return NextResponse.json({ message: "Package data deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting package data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
