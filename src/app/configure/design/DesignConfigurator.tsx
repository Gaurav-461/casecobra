"use client";

// bg-blue-950 border-blue-950
// bg-zinc-900 border-zinc-900
// bg-rose-900 border-rose-900
// bg-green-900 border-green-900
// bg-yellow-900 border-yellow-900

import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPrice } from "@/lib/utils";
import { default as NextImage } from "next/image";
import { Rnd } from "react-rnd";
import {
  Description,
  Radio,
  RadioGroup,
  Label as RadioLabel,
} from "@headlessui/react";
import { useRef, useState } from "react";

import HandleComponent from "@/components/HandleComponent";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validator/option-validator";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { BASE_PRICE } from "@/config/products";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useMutation } from "@tanstack/react-query";
import { SaveConfigArgs, saveConfig as _saveConfig } from "./action";
import { useRouter } from "next/navigation";
import { toast as sonnerToast } from "sonner";

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: saveConfig } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: SaveConfigArgs) => {
      await Promise.all([saveConfiguration(), _saveConfig(args)]);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an error on our end. Please try again later.",
      });
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`);
      sonnerToast.success("Your configuration has been saved", {
        position: "top-center",
        richColors: true,
        duration: 5000,
        style: {
          fontSize: "1em",
        },
      });
    },
  });

  // state to store options
  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  const [renderedDimension, setRenderedDimension] = useState({
    width: imageDimensions.width,
    height: imageDimensions.height,
  });

  const [renderedPosition, setRenderedPosition] = useState({
    x: 135,
    y: 205,
  });

  const phoneCaseRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { startUpload, isUploading } = useUploadThing("imageUploader");

  async function saveConfiguration() {
    try {
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();

      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height,
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "filename.png", { type: "image/png" });

      await startUpload([file], { configId });
    } catch (error) {
      toast({
        title: "Please try again later",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  }

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  return (
    <section className="relative mb-20 mt-20 grid grid-cols-1 pb-20 lg:grid-cols-3">
      {/* Left side where user can customize case like resize, crop */}
      <div
        ref={containerRef}
        className="relative col-span-2 flex h-[37.5rem] w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg border-2 border-dashed focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {/* Phone template */}
        <div className="pointer-events-none relative aspect-[896/1831] w-60 bg-opacity-50">
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              fill
              alt="phone image"
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          <div className="absolute inset-0 bottom-px right-[3px] top-px z-40 rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={cn(
              "absolute inset-0 bottom-px left-[3px] right-[3px] top-px rounded-[32px]",
              `bg-${options.color.tw}`,
            )}
          />
        </div>

        {/* user uploaded image */}
        <Rnd
          default={{
            x: 150,
            y: 205,
            width: imageDimensions.width / 4,
            height: imageDimensions.height / 4,
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimension({
              width: parseInt(ref.style.width.slice(0, -2)), // using slice(0, -2) removes the px from the end of the string
              height: parseInt(ref.style.height.slice(0, -2)),
            });
            setRenderedPosition({ x, y });
          }}
          onDragStop={(_, data) =>
            setRenderedPosition({ x: data.x, y: data.y })
          }
          className="absolute z-30 border-[3px] border-primary"
          lockAspectRatio
          resizeHandleComponent={{
            bottomLeft: <HandleComponent />,
            topLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            bottomRight: <HandleComponent />,
          }}
        >
          <div className="relative h-full w-full">
            <NextImage
              alt="your image"
              src={imageUrl}
              fill
              className="pointer-events-none"
            />
            {/* <img src={imageUrl} alt="" className="pointer-events-none" /> */}
          </div>
        </Rnd>
      </div>

      {/* Right side where user can select custom options */}
      <div className="col-span-full flex h-[37.5rem] w-full flex-col bg-white lg:col-span-1">
        {/* scrollable area */}
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-white"
          />

          <div className="px-8 pb-12 pt-8">
            {/* header */}
            <h2 className="text-3xl font-bold tracking-tight">
              Customize your case
            </h2>

            {/* separator */}
            <div className="my-6 h-px w-full bg-zinc-200" />

            {/* options */}
            <div className="relative mt-4 flex h-full flex-col justify-between">
              <div className="flex flex-col gap-6">
                {/* colors */}
                <RadioGroup
                  value={options.color}
                  onChange={(value) => {
                    setOptions((prev) => ({
                      ...prev,
                      color: value,
                    }));
                  }}
                >
                  <Label>Color: {options.color.label}</Label>

                  {/* color options */}
                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map((color) => (
                      <Radio
                        key={color.label}
                        value={color} // { label: "...", value: "...": tw: "..."}
                        className={({ checked, focus }) =>
                          cn(
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full border-2 border-transparent p-0.5 focus:ring-0 active:outline-none active:ring-0",
                            {
                              [`border-${color.tw}`]: checked || focus,
                            },
                          )
                        }
                      >
                        <span
                          className={cn(
                            `bg-${color.tw}`,
                            "size-8 rounded-full border border-black border-opacity-10",
                          )}
                        />
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>

                {/* model */}
                <div className="relative flex w-full flex-col gap-3">
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            `flex cursor-default items-center gap-1 p-1.5 text-sm hover:bg-zinc-100`,
                            {
                              "bg-zinc-200":
                                model.label === options.model.label,
                            },
                          )}
                          onClick={() =>
                            setOptions((prev) => ({ ...prev, model: model }))
                          }
                        >
                          {model.label === options.model.label && (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* material and finish options */}
                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectableOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(value) =>
                        setOptions((prev) => ({ ...prev, [name]: value }))
                      }
                    >
                      <Label>
                        {name.slice(0, 1).toUpperCase() + name.slice(1)}
                      </Label>

                      <div className="mt-3 space-y-4">
                        {selectableOptions.map((option) => (
                          <Radio
                            key={option.value}
                            value={option}
                            className={({ checked, focus }) =>
                              cn(
                                "relative block cursor-pointer rounded-lg border-2 border-zinc-200 bg-white px-6 py-4 shadow-sm outline-none ring-0 focus:outline-none focus:ring-0 sm:flex sm:justify-between",
                                {
                                  "border-primary": checked || focus,
                                },
                              )
                            }
                          >
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm">
                                <RadioLabel
                                  as="span"
                                  className="font-medium text-gray-900"
                                >
                                  {option.label}
                                </RadioLabel>

                                {option.description && (
                                  <Description
                                    as="span"
                                    className="text-gray-500"
                                  >
                                    <span className="block sm:inline">
                                      {option.description}
                                    </span>
                                  </Description>
                                )}
                              </span>
                            </span>

                            <Description
                              as="span"
                              className="mt2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                            >
                              <span className="font-medium text-gray-900">
                                {formatPrice(option.price)}
                              </span>
                            </Description>
                          </Radio>
                        ))}
                      </div>
                    </RadioGroup>
                  ),
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Button */}
        <div className="h-16 w-full bg-white px-8">
          <div className="h-px w-full bg-zinc-200" />
          <div className="flex h-full w-full items-center justify-end">
            <div className="flex w-full items-center gap-6">
              <p className="whitespace-nowrap font-medium">
                {formatPrice(
                  BASE_PRICE +
                    (options.material.price || 0) +
                    (options.finish.price || 0),
                )}
              </p>
              <Button
                onClick={() =>
                  saveConfig({
                    configId,
                    color: options.color.value,
                    finish: options.finish.value,
                    material: options.material.value,
                    model: options.model.value,
                  })
                }
                size="sm"
                className="w-full"
              >
                {isUploading ? "Creating case..." : "Continue"}
                {isUploading ? (
                  <Loader2 className="ml-1.5 inline size-4 animate-spin" />
                ) : (
                  <ArrowRight className="ml-1.5 inline size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignConfigurator;
