import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export const runtime = "nodejs"; // Ensure Node.js runtime

export async function POST(req: Request) {
  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create FormData for Pinata
    const pinataFormData = new FormData();
    pinataFormData.append("file", buffer, file.name);

    // Add metadata
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        timestamp: new Date().toISOString()
      }
    });
    pinataFormData.append('pinataMetadata', metadata);

    // Upload to Pinata
    const pinataRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      pinataFormData,
      {
        headers: {
          ...pinataFormData.getHeaders(),
          
        pinata_api_key:"393bc0b57b725feb07ad",
        pinata_secret_api_key: "8117a3d4cf86646ab6fae252198630c5c5a9676cb5aa318a01e7aad5fcac30e6",

        },
      }
    );

    // Return IPFS Hash
    return NextResponse.json({ 
      cid: pinataRes.data.IpfsHash,
      fileName: file.name
    }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
