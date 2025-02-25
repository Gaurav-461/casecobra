"use server";

import { db } from "@/db";
import { OrderStatus } from "@prisma/client";

export async function updateOrderStatus({
  id,
  newStatus,
}: {
  id: string;
  newStatus: OrderStatus;
}) {
  await db.order.update({
    where: { id },
    data: { status: newStatus },
  });
}
