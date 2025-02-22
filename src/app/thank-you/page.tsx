import { Suspense } from "react";
import ThankYou from "./ThankYou";

const ThankYouPage = () => {
  return (
    <Suspense>
      <title>Thank You</title>
      <ThankYou />
    </Suspense>
  );
}

export default ThankYouPage;