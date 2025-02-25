"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { updateOrderStatus } from "./action";
import { useRouter } from "next/navigation";

interface StatusDropdownProps {
  id: string;
  orderStatus: OrderStatus;
}

const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
  awaiting_shipment: "Awaiting Shipment",
  shipped: "Shipped",
  fulfilled: "Fulfilled",
};

const StatusDropdown = ({ id, orderStatus }: StatusDropdownProps) => {
  const router = useRouter();

  const { mutate } = useMutation({
    mutationKey: ["update-order-status"],
    mutationFn: updateOrderStatus,
    onSuccess: () => router.refresh(),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex w-52 items-center justify-center"
        >
          {LABEL_MAP[orderStatus]}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 " />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.keys(OrderStatus).map((status) => (
          <DropdownMenuItem
            key={status}
            className={cn(
              "flex cursor-default items-center gap-1 text-sm hover:bg-zinc-100",
              {
                "bg-zinc-200": status === orderStatus,
              },
            )}
            onClick={() => mutate({ id, newStatus: status as OrderStatus })}
          >
            <Check
              className={cn(
                "mr-2 size-4 text-primary",
                status === orderStatus ? "opacity-100" : "opacity-0",
              )}
            />
            {LABEL_MAP[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
