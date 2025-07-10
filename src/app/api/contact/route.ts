import { createContact } from "@/lib/notion/contacts";
import { response } from "@/lib/utils";
import { type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return response(false, 400, "Missing data");
    }

    await createContact({ name, email, message });

    return response(true, 200, "Message submitted successfully");
  } catch (error) {
    console.error("Contact POST error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
