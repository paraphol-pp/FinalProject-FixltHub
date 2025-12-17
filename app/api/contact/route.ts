// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { firstName, lastName, message } = body;

//     if (!firstName || !lastName || !message) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const contact = await prisma.contact.create({
//       data: {
//         firstName,
//         lastName,
//         message,
//       },
//     });

//     return NextResponse.json(contact, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to create contact message" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     const contacts = await prisma.contact.findMany({
//       orderBy: { createdAt: "desc" },
//     });
//     return NextResponse.json(contacts);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch contact messages" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import { Contact } from "@/models/Contact";

export async function POST(req: Request) {
  try {
    await connectMongo();

    const body = await req.json();
    const { firstName, lastName, message } = body;

    if (!firstName || !lastName || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const created = await Contact.create({ firstName, lastName, message });

    const obj = created.toObject();
    return NextResponse.json(
      { ...obj, id: String(obj._id) }, // เผื่อ frontend อยากใช้ id เหมือนเดิม
      { status: 201 }
    );
  } catch (error) {
    console.error("[api/contact][POST] error:", error);
    return NextResponse.json(
      { error: "Failed to create contact message" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectMongo();

    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

    const normalized = contacts.map((it: any) => ({
      ...it,
      id: String(it._id),
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("[api/contact][GET] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact messages" },
      { status: 500 }
    );
  }
}
