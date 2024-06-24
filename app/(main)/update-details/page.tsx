"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { OrderDbStyle } from "@/lib/types";

export default function UpdateDetails({params}:{params:{userId:number}}) {
  const userId = params.userId;

  const [businessName, setBusinessName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const email = user?.emailAddresses[0].emailAddress;
  const nameOfUser = user?.fullName;
  const clerkId = user?.id;
  console.log(user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/add-user-details", {
        method: "POST",
        body: JSON.stringify({
          businessName,
          address,
          phone,
          email,
          nameOfUser,
          clerkId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.status == 200) {
        toast({
          title: "User registered!",
          description: "You can create your first order now!🚀",
          variant:"success"
        });
      } else if (result.message == "User already exists!") {
        toast({
          title: "User already registered!",
          description: "Continue Making Order on the homepage!",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      router.push("/");
    }
  };

  return (
    <main className="min-w-screen max-w-screen-md">
      <div className="w-full max-w-5xl text-left my-4 container min-h-screen">
        <h1 className="my-2 mt-6 text-xl font-semibold">Add Details:</h1>
        <p className="text-gray-600 mb-4">
          Add a few details so that, it would be easy for us to contact you!
        </p>
        <form className="space-y-2 text-left grid gap-2" onSubmit={handleSubmit}>
          <div className="">
            <Label htmlFor="businessName">Business Name:</Label>
            <Input
              name="businessName"
              onChange={(e: any) => setBusinessName(e.target.value)}
              type="text"
              value={businessName}
              placeholder="General Kirana Store"
              required
            />
          </div>
          <div className="">
            <Label htmlFor="phone">Phone Number:</Label>
            <Input
              name="phone"
              onChange={(e: any) => setPhone(e.target.value)}
              type="text"
              value={phone}
              placeholder="Phone"
              required
            />
          </div>
          <div className="">
            <Label htmlFor="address">City/Village:</Label>
            <Input
              name="address"
              onChange={(e: any) => setAddress(e.target.value)}
              type="text"
              value={address}
              placeholder="Address"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Adding Details</span>
              </>
            ) : (
              "Add Details"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
