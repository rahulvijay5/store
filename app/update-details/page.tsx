"use client";

import { useState } from "react";
// import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Toast } from "@/components/ui/toast";
import { toast, useToast } from "@/components/ui/use-toast";

export default function UpdateDetails() {
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

  // const handleVideoFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = e.target.files?.[0];
  //   if(selectedFile instanceof File) setVideo(selectedFile);
  // }

  // const handleThumbnailFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedImage = e.target.files?.[0];
  //   if(selectedImage instanceof File) setThumbnail(selectedImage);
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // if(!video) return;
    // if(!thumbnail) return;
    // setUploading("Getting signed URL...");

    try {
      // get signed url from server

      // const response = await fetch("/api/s3Url", { method: "GET" });
      // const { video_id, videoUrl, thumbnail_id, thumbnailUrl } = await response.json();
      // console.log('Signed URL:', url);
      // setUploading("Uploading Video...");
      // post video directly to the signedUrl using PUT request
      // await fetch("http://localhost:3000/api/add-user-details", {
      //   method: "POST",
      //   body: JSON.stringify({}),
      //   headers: {
      //     "Content-Type": "application/json"
      //   }
      // });
      // setVideoUrl(videoUrl.split('?')[0]);
      // setUploading("Uploading Thumbnail...");
      // post thumbnail directly to the signedUrl using PUT request
      // await fetch(thumbnailUrl, {
      //   method: "PUT",
      //   body: thumbnail,
      //   headers: {
      //     "Content-Type": "multipart/form-data"
      //   }
      // });
      // setThumbnailUrl(thumbnailUrl.split('?')[0]);
      // setUploading("Saving info to db...");
      // post request to my server to save some additional data into db
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
          description: "Create your first order on homepage!",
        })
      } else if (result.message == "User already exists!") {
        toast({
          title: "User already registered!",
          description: "Continue Making Order on the homepage!",
        })
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      router.push("/")
    }
  };

  return (
    <main className="min-w-screen ">
      <div className="w-full max-w-5xl text-left my-4 container">
        {/* {uploading && <Badge className='mb-4 p-1'><Loader2 className="mr-2 h-4 w-4 animate-spin" />{uploading}</Badge>}

      {videoUrl && (
        <div>
          <video className='max-h-screen md:rounded-2xl' controls autoPlay>
            <source src={videoUrl} type="video/mp4"/>
          </video>
          <p className='my-4 text-center text-sm'>Video uploaded successfully</p>
        </div>
      )} */}

        {/* <Input name='video' onChange={handleVideoFileChange} type="file" accept="video/*" required /> */}
        {/* <Input name='thumbnail' onChange={handleThumbnailFileChange} type="file" accept="image/*" required /> */}
        {/* <Textarea name='description' onChange={(e:any) => setDescription(e.target.value)} value={description} placeholder='Description (optional)' /> */}

        <form className="space-y-2 text-center" onSubmit={handleSubmit}>
          <Label htmlFor="businessName">Business Name:</Label>
          <Input
            name="businessName"
            onChange={(e: any) => setBusinessName(e.target.value)}
            type="text"
            value={businessName}
            placeholder="General Kirana Store"
            required
          />
          <Label htmlFor="address">Address:</Label>
          <Input
            name="address"
            onChange={(e: any) => setAddress(e.target.value)}
            type="text"
            value={address}
            placeholder="Address"
            required
          />
          <Label htmlFor="phone">Phone Number:</Label>
          <Input
            name="phone"
            onChange={(e: any) => setPhone(e.target.value)}
            type="text"
            value={phone}
            placeholder="Phone"
            required
          />
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
