import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  // console.log("User info:-", user);
  return (
    <nav className="sticky inset-x-0 top-0 z-[100] w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all duration-300">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="z-40 flex font-semibold">
            case<span className="text-green-600">cobra</span>
          </Link>

          <div className="flex h-full items-center space-x-4">
            {user ? (
              // if user log-in
              <>
                <Link
                  href="/api/auth/logout"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign out
                </Link>

                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Dashboard ✨
                  </Link>
                )}

                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden items-center gap-1 sm:flex",
                  })}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>

                <Image
                  src={user.picture || ""}
                  alt="user image"
                  width={32}
                  height={32}
                  className="rounded-full object-contain"
                />
              </>
            ) : (
              // if user not log-in
              <>
                <Link
                  href="/api/auth/register"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign up
                </Link>

                <Link
                  href="/api/auth/login"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Login
                </Link>

                <div className="h-2/3 w-px hidden sm:block bg-zinc-200" />

                <Link
                  href="/api/auth/login"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden items-center gap-1 sm:flex",
                  })}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
