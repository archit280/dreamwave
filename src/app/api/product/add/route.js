import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/product/add
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, sku, uom, categoryId, initialStock, warehouseId } = body;

    // Validation
    if (!name || !sku || !uom || !categoryId) {
      return NextResponse.json(
        { error: "name, sku, uom, categoryId are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Create product
    const product = await prisma.product.create({
      data: {
        name,
        sku,
        uom,
        categoryId: Number(categoryId),
      },
    });

    // 2️⃣ Optional initial stock
    if (initialStock && warehouseId) {
      await prisma.stock.upsert({
        where: {
          productId_warehouseId: {
            productId: product.id,
            warehouseId: Number(warehouseId),
          },
        },
        update: {
          quantity: { increment: Number(initialStock) },
        },
        create: {
          productId: product.id,
          warehouseId: Number(warehouseId),
          quantity: Number(initialStock),
        },
      });
    }

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Product Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
