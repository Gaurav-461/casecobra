"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";

import { BASE_PRICE, PRODUCTS_PRICES } from "@/config/products";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";

export const createCheckOutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("No such configuration found");
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("You need be logged in");
  }

  const { finish, material } = configuration;

  let price = BASE_PRICE * 86 / 100;
  if (finish === "textured") {
    price += (PRODUCTS_PRICES.finish.textured * 86 / 100);
  }
  if (material === "polycarbonate") {
    price += (PRODUCTS_PRICES.material.polycarbonate * 86 / 100);
  }

  let order: Order | undefined = undefined;

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  })


  console.log('user ID:', user.id)
  console.log('configuration ID:', configuration.id)

  if(existingOrder){
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        amount: price,
        userId: user.id,
        configurationId: configuration.id,
      },
    })
  }

  const product = await stripe.products.create({
    name: 'Custom iPhone Case',
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "usd",
      unit_amount: price,
    },
  })

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderid=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ["card"],
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['IN', 'US', 'CA'],
    },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [{
      price: product.default_price as string,
      quantity: 1
    }],
  })

  return { url: stripeSession.url}
};