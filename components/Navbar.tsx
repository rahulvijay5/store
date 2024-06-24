import { ModeToggle } from "@/components/ThemeSwitcher";
import { UserButton, currentUser, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { allowedMails } from "@/lib/constants";

export default async function Navbar() {
  const user = await currentUser();
  const cmail = user?.emailAddresses[0].emailAddress;

  return (
    <>
      <div className="flex flex-col items-center border shadow shadow-gray-500 dark:shadow-white/50 shado">
        <div className="gap-2 text-xl flex pt-6 items-center p-2 rounded-lg justify-between w-full px-6 text-wrap mx-6 sm:px-20  mb-2">
          <p className="truncate">
            <Link href="/" className="max-w-2/3 flex gap-1 items-center">
              <div className="h-4 w-4 bg-emerald-400 rounded-full animate-pulse flex items-center justify-center">
                <div className="bg-white h-1 w-1 rounded-full animate-pulse"></div>
              </div>
              {user?.firstName}
              <span>{user?.lastName}</span>
            </Link>
          </p>
          <div className="flex items-center gap-3">
            {cmail && allowedMails.includes(cmail) ? (
              <Link
                href="/admin"
                className="flex gap-2 hover:bg-gray-600 hover:text-white p-3 rounded-md"
              >
                <span className="hidden sm:block text-base">Dashboard</span>
                <ShoppingBag />
              </Link>
            ) : (
              ""
            )}
            <UserButton afterSignOutUrl="/" />
            <ModeToggle />
          </div>
        </div>
        {/* <Test/> */}
      </div>
    </>
  );
}
