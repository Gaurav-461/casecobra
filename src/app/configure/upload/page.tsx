"use client";

import { useState, useTransition } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Image, Loader2, MousePointerSquareDashed } from "lucide-react";
import Dropzone, { FileRejection } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const Page = () => {
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      console.log("Client data:-", data);

      const configId = data.serverData.configId;

      startTransition(() => {
        router.push(`/configure/design?id=${configId}`);
      });
    },
    onUploadProgress(p) {
      setUploadProgress(p);
    },
    onUploadError: (error: Error) => {
      toast({
        title: error.name,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;

    setIsDragOver(false);

    toast({
      title: `${file.file.type} type is not supported`,
      description: "Please choose a PNG, JPG, or JPEG image instead",
      variant: "destructive",
    });
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
    startUpload(acceptedFiles, { configId: undefined });
  };

  const [isPending, startTransition] = useTransition();

  return (
    <>
      <title>Configuration | Upload</title>
      <div
        className={cn(
          "relative my-16 flex h-full w-full flex-1 cursor-pointer flex-col items-center justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl",
          {
            "bg-blue-900/25 ring-blue-900/25": isDragOver,
          },
        )}
      >
        <div className="relative flex w-full flex-1 flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-zinc-700">
          <Dropzone
            onDropRejected={onDropRejected}
            onDropAccepted={onDropAccepted}
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpeg"],
              "image/jpg": [".jpg"],
            }}
            onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                className="flex h-full w-full flex-1 flex-col items-center justify-center"
                {...getRootProps()}
              >
                <input {...getInputProps()} />

                {isDragOver ? (
                  <MousePointerSquareDashed className="mb-2 size-6 text-zinc-500" />
                ) : isUploading || isPending ? (
                  <Loader2 className="mb-2 size-6 animate-spin" />
                ) : (
                  <Image className="mb-2 size-6" />
                )}

                <div className="mb-2 flex flex-col justify-center text-sm text-zinc-700">
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <p>Uploading...</p>
                      <Progress
                        value={uploadProgress}
                        className="mt-2 h-2 w-40 bg-gray-300"
                      />
                    </div>
                  ) : isPending ? (
                    <div className="flex flex-col items-center">
                      <p>Redirecting, please wait...</p>
                    </div>
                  ) : isDragOver ? (
                    <p>
                      <span className="font-semibold">Drop file</span>
                      {"  "}to upload
                    </p>
                  ) : (
                    <p>
                      <span className="font-semibold">Click to upload</span>
                      {"  "}or drag and drop
                    </p>
                  )}
                </div>

                {!isPending && (
                  <p className="to-zinc-500 text-xs">PNG, JPG, JPEG</p>
                )}
              </div>
            )}
          </Dropzone>
        </div>
      </div>
    </>
  );
};

export default Page;
