import { GlobalError, SuccessResponse, UnauthorizedError } from "@/lib/helper";
import prismadb from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;

    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userId) {
      return UnauthorizedError({
        message: "You are not authorized to access this resource.",
      });
    }

    const stores = await prismadb.store.findFirst();

    if (!stores) {
      return SuccessResponse({
        store: null,
      });
    }

    return SuccessResponse({
      store: {
        id: stores?.id,
        name: stores?.name,
      },
    });
  } catch (error) {}
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("userId")?.value;

    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userId || user?.role !== "ADMIN") {
      return UnauthorizedError({
        message: "You are not authorized to access this resource.",
      });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return GlobalError({
        message: "Name is required.",
        errorCode: 400,
      });
    }

    const store = await prismadb.store.create({
      data: {
        name,
      },
    });

    return SuccessResponse(store);
  } catch (error: any) {
    return GlobalError(error);
  }
}
