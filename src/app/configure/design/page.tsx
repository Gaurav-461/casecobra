import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./DesignConfigurator";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };

  // or

  // searchParams: {
  //   id: string | string[] | undefined;
  // };
}

const Page = async ({ searchParams }: PageProps) => {
  // make db call
  const { id } = await searchParams;

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
      <title>Configuration | Design</title>
      <DesignConfigurator
        configId={configId}
        imageUrl={imageUrl}
        imageDimensions={{ width, height }}
      />
    </>
  );
};

export default Page;
