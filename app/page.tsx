import { User } from "@/actions/userActions";
import HomeMain from "@/components/HomeMain";
import { ModeToggle } from "@/components/ThemeSwitcher";
import { UserButton, currentUser } from "@clerk/nextjs";
import OrderHistory from "@/components/OrderHistory";
import Test from "@/components/Test";

export default async function Home() {
  const user = await User();

  console.log(user.user?.firstName, user.user?.lastName);

  return (
    <>
      <div className="flex flex-col items-center mt-6 min-h-screen">
      <div className="w-full mt-6">
          <HomeMain />
        </div>
      </div>
    </>
  );
}
