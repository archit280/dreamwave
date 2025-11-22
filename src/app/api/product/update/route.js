import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/product/update
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, name, sku, uom, categoryId } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(sku && { sku }),
        ...(uom && { uom }),
        ...(categoryId && { categoryId: Number(categoryId) }),
      },
    });

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Product Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
