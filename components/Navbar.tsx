import { User } from "@/actions/userActions";
import HomeMain from "@/components/HomeMain";
import { ModeToggle } from "@/components/ThemeSwitcher";
import { UserButton, currentUser } from "@clerk/nextjs";
import OrderHistory from "@/components/OrderHistory";

export default async function Navbar() {
//   const user = await User();
    const user = {
        user:{
            "firstName":"Ayush",
            "lastName":"Mittal",
        }
    }
  console.log(user.user?.firstName, user.user?.lastName);


  return (
    <>
      <div className="flex flex-col items-center mt-6 mx-4 sm:mx-8">
        <div className="gap-2 text-xl flex border items-center p-2 rounded-lg justify-between w-full px-6 mx-2">
          <p>{user.user?.firstName} <span>{user.user?.lastName}</span></p>
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/" />
            <ModeToggle />
          </div>
        </div>
        {/* <Test/> */}
      </div>
    </>
  );
}
