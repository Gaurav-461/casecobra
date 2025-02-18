import { MaxWidthWrapper, Steps } from "@/components";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <MaxWidthWrapper className="flex flex-1 flex-col">
      <Steps />
      {children}
      <Toaster />
    </MaxWidthWrapper>
  );
};

export default Layout;
