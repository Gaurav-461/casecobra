"use server";

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getPaymentStatus({ orderId }: { orderId: string }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user.id || !user.email) {
    throw new Error("You need to be logged in to view this thank you page.");
  }

  const order = await db.order.findFirst({
    where: {
      id: orderId,
      userId: user.id,
    },
    include: {
      billingAddress: true,
      shippingAddress: true,
      configuration: true,
      User: true,
    },
  });

  if (!order) {
    throw new Error("This order does not exist.");
  }

  if (!order.isPaid) {
    return false
  }

  return order;
}
