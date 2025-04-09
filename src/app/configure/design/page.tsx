import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./DesignConfigurator";

interface PageProps {
  searchParams: {
    [key: string]: Promise<string | string[] | undefined>;
  };

  // or

  // searchParams: {
  //   id: Promise<string | string[] | undefined>;
  // }

  // searchParams: URLSearchParams
}

const Page = async ({ searchParams }: PageProps) => {
  // make db call
  const { id } = await searchParams;
  // console.log("searchParams:-", searchParams);

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }

  const { imageUrl, height, width, id: configId } = configuration;

  return (
    <>
      <DesignConfigurator
        configId={configId}
        imageUrl={imageUrl}
        imageDimensions={{ width, height }}
      />
    </>
  );
};

export default Page;
