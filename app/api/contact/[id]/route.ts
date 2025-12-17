// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function DELETE(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id: idString } = await params;
//     const id = parseInt(idString);

//     if (isNaN(id)) {
//       return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
//     }

//     await prisma.contact.delete({
//       where: { id },
//     });

//     return NextResponse.json({ message: "Contact deleted successfully" });
//   } catch (error) {
//     console.error("Delete error:", error);
//     return NextResponse.json(
//       { error: "Failed to delete contact" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "@/lib/mongoose";
import { Contact } from "@/models/Contact";

type ParamsPromise = Promise<{ id: string }>;

export async function DELETE(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    await connectMongo();

    const { id } = await params;

    // MongoDB id ต้องเป็น ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await Contact.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/contact/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
