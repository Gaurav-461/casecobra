"use server";

import { db } from "@/db";
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModel,
} from "@prisma/client";

export type SaveConfigArgs = {
  color: CaseColor;
  finish: CaseFinish;
  material: CaseMaterial;
  model: PhoneModel;
  configId: string | undefined;
};

//* this RPC (Remote Procedure Call) function which means that this function is only accessible to the server and not to the client
export async function saveConfig({
  color,
  finish,
  material,
  model,
  configId,
}: SaveConfigArgs) {
  await db.configuration.update({
    where: { id: configId },
    data: {
      color,
      finish,
      material,
      model,
    },
  });
}
