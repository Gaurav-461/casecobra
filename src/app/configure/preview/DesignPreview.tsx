"use client";

import Confetti from "react-dom-confetti";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Configuration } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { Button } from "@/components/ui/button";
import { BASE_PRICE, PRODUCTS_PRICES } from "@/config/products";
import { formatPrice } from "@/lib/utils";
import { COLORS, MODELS } from "@/validator/option-validator";
import Phone from "@/components/Phone";
import { createCheckOutSession } from "./action";
import { useToast } from "@/hooks/use-toast";
import LoginModal from "@/components/LoginModal";

const DesignPreview = ({ configuration }: { configuration: Configuration }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useKindeBrowserClient();

  useEffect(() => setShowConfetti(true));

  const { id, color, model, finish, material } = configuration;

  const tw = COLORS.find(
    (supportedColor) => supportedColor.value === color,
  )?.tw;

  const { label: modelName } = MODELS.options.find(
    ({ value }) => value === model,
  )!;

  let totalPrice = BASE_PRICE;
  if (material === "polycarbonate") {
    totalPrice += PRODUCTS_PRICES.material.polycarbonate;
  }

  if (finish === "textured") {
    totalPrice += PRODUCTS_PRICES.finish.textured;
  }

  const { mutate: createPaymentSession, isPending } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckOutSession,
    onSuccess: ({ url }) => {
      if (url) {
        router.push(url);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Unable to retrieve payment URL.",
        });
        throw new Error("Unable to retrieve payment URL.");
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an error on our end. Please try again later.",
      });
      console.error("Error :: ", error);
    },
  });

  const handleCheckout = () => {
    if (user) {
      // create payment session
      createPaymentSession({ configId: id });
    } else {
      localStorage.setItem("configurationId", id);
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none justify-center overflow-hidden"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 200, spread: 90, angle: 90, duration: 5000 }}
        />
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen}/>

      <section className="mt-20 flex flex-col items-center text-sm sm:grid sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
          <Phone
            className={`bg-${tw}`}
            imgSrc={configuration.croppedImageUrl!}
          />
        </div>

        <div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {modelName} Case
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="size-4 text-green-600" />
            In stock ready to ship
          </div>
        </div>

        <div className="text-base sm:col-span-12 md:col-span-9">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div className="border-r">
              <p className="font-medium text-zinc-950">Highlights</p>
              <ol className="mt-3 list-inside list-disc text-zinc-700">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>

            <div>
              <p className="font-medium text-zinc-950">Materials</p>
              <ol className="mt-3 list-inside list-disc text-zinc-700">
                <li>High-quality, durable material</li>
                <li>Scratch- and fingerprint resistant coating</li>
              </ol>
            </div>
          </div>

          <div className="mt-2">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="mt-2 flex items-center justify-between py-1">
                  <p className="text-gray-600">Base Price</p>
                  <p className="font-medium text-gray-900">
                    {formatPrice(BASE_PRICE)}
                  </p>
                </div>
                {finish === "textured" && (
                  <div className="mt-2 flex items-center justify-between py-1">
                    <p className="text-gray-600">Textured finish</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCTS_PRICES.finish.textured)}
                    </p>
                  </div>
                )}
                {material === "polycarbonate" && (
                  <div className="mt-2 flex items-center justify-between py-1">
                    <p className="text-gray-600">Soft Polycarbonate material</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCTS_PRICES.material.polycarbonate)}
                    </p>
                  </div>
                )}

                <div className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900">Order Total</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(totalPrice)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              <Button
                onClick={() => handleCheckout()}
                loadingText="loading"
                className="px-4 sm:px-6 md:px-8"
              >
                Check out {isPending ? <Loader2  className="ml-1.5 inline size-4 animate-spin"/> : <ArrowRight className="ml-1.5 inline size-4" />}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DesignPreview;
