/**
 * v0 by Vercel.
 * @see https://v0.dev/t/pzyDqYRxj82
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import { Phone } from "lucide-react";

export default function Component() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table className="text-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Total Weight</TableHead>
            <TableHead>Pickup Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Bob Johnson</TableCell>
            <TableCell>20 lbs</TableCell>
            <TableCell>June 25, 2023</TableCell>
            <TableCell>
              <Badge variant="outline">Delivered</Badge>
            </TableCell>
            <TableCell>$120.00</TableCell>
            <TableCell>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="px-4 sm:px-8 mx-4 md:mx-8 text-lg min-h-[90vh] md:min-h-[80vh]">
                  <DrawerHeader className="flex justify-between items-center px-0 mb-4">
                    <div>
                      <DrawerTitle className="my-2 text-left">
                        Order Details
                      </DrawerTitle>
                      <DrawerDescription className="text-left">
                        Bob Johnson <span></span>
                        {/* in the above span add the time, when order is plcaed */}
                      </DrawerDescription>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant={"ghost"}
                        className="items-center justify-center gap-1 py-4"
                      >
                        <div className="font-medium text-sm">Status:</div>
                        <Badge
                          variant={"outline"}
                          className="text-green-500 text-base"
                        >
                          Delivered
                        </Badge>
                      </Button>
                      <Button variant={"outline"} size={"icon"}>
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </DrawerHeader>
                  <div className="gap-8 w-full md:flex">
                    <div className="grid sm:grid-cols-2 gap-4 md:w-1/2 mb-4 md:mb-0">
                      <div className="border dark:border-green-200 bg-green-900/40 p-4 text-black dark:text-white rounded-md">
                        <div className="font-medium dark:text-green-200 border-b-2 border-black dark:border-green-200 mb-4 pb-1 flex items-center justify-between">
                          <span>Regular</span>{" "}
                          <span className="dark:text-white font-semibold">
                            5400 ₹
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>250</span>
                          <span>20</span>
                          <span>5 kg</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>500</span>
                          <span>10</span>
                          <span>5 kg</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>1 kg</span>
                          <span>5</span>
                          <span>5 kg</span>
                        </div>
                      </div>
                      <div className="border dark:border-yellow-200 bg-yellow-800/40 text-black dark:text-white p-4 rounded-md">
                        <div className="font-medium dark:text-yellow-200 border-b-2 border-black dark:border-yellow-200 mb-4 pb-1 flex items-center justify-between">
                          <span>Super</span>{" "}
                          <span className="dark:text-white font-semibold">
                            6000 ₹
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>250</span>
                          <span>20</span>
                          <span>5 kg</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>500</span>
                          <span>10</span>
                          <span>5 kg</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>1 kg</span>
                          <span>5</span>
                          <span>5 kg</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-1/2 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <div>
                        <div className="font-medium">Pickup Date</div>
                        <div>June 25, 2023</div>
                      </div>
                      <div className="py-2 border rounded-md flex flex-col items-center justify-center gap-1">
                        <div className="font-medium pb-1">Total Amount</div>
                        <Separator />
                        <div className="text-xl font-bold">11400 ₹</div>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 grid-flow-row-dense">
                      <div>
                        <div className=" text-gray-600 text-sm">Name</div>
                        <div>Bob Johnson</div>
                      </div>
                      <div>
                        <div className=" text-gray-600 text-sm">
                          Phone Number
                        </div>
                        <div>+919252993555</div>
                      </div>

                      <div className="col-span-2 my-2">
                        <div className=" text-gray-600 text-sm">Address</div>
                        <div>Neminath Colony Sapunda Road Kekri</div>
                      </div>
                    </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bob Johnson</TableCell>
            <TableCell>20 lbs</TableCell>
            <TableCell>June 25, 2023</TableCell>
            <TableCell>
              <Badge variant="outline">Delivered</Badge>
            </TableCell>
            <TableCell>$120.00</TableCell>
            <TableCell>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="px-4 sm:px-8 mx-4 md:mx-8 text-lg min-h-[90vh] md:min-h-[80vh]">
                  <DrawerHeader className="flex justify-between items-center px-0 mb-4">
                    <div>
                      <DrawerTitle className="my-2 text-left">
                        Order Details
                      </DrawerTitle>
                      <DrawerDescription className="text-left">
                        Bob Johnson <span></span>
                        {/* in the above span add the time, when order is plcaed */}
                      </DrawerDescription>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant={"ghost"}
                        className="items-center justify-center gap-1 py-4"
                      >
                        <div className="font-medium text-sm">Status:</div>
                        <Badge
                          variant={"outline"}
                          className="text-green-500 text-base"
                        >
                          Delivered
                        </Badge>
                      </Button>
                      <Button variant={"outline"} size={"icon"}>
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </DrawerHeader>
                  <div className="gap-8 w-full md:flex">
                    <div className="grid sm:grid-cols-2 gap-4 md:w-1/2 mb-4 md:mb-0">
                      <div className="border dark:border-green-200 bg-green-900/40 p-4 text-black dark:text-white rounded-md">
                        <div className="font-medium dark:text-green-200 border-b-2 border-black dark:border-green-200 mb-4 pb-1 flex items-center justify-between">
                          <span>Regular</span>{" "}
                          <span className="dark:text-white font-semibold">
                            5400 ₹
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>250</span>
                          <span>20</span>
                          <span>5 kg</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>500</span>
                          <span>10</span>
                          <span>5 kg</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>1 kg</span>
                          <span>5</span>
                          <span>5 kg</span>
                        </div>
                      </div>
                      <div className="border dark:border-yellow-200 bg-yellow-800/40 text-black dark:text-white p-4 rounded-md">
                        <div className="font-medium dark:text-yellow-200 border-b-2 border-black dark:border-yellow-200 mb-4 pb-1 flex items-center justify-between">
                          <span>Super</span>{" "}
                          <span className="dark:text-white font-semibold">
                            6000 ₹
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>250</span>
                          <span>20</span>
                          <span>5 kg</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>500</span>
                          <span>10</span>
                          <span>5 kg</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>1 kg</span>
                          <span>5</span>
                          <span>5 kg</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-1/2 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <div>
                        <div className="font-medium">Pickup Date</div>
                        <div>June 25, 2023</div>
                      </div>
                      <div className="py-2 border rounded-md flex flex-col items-center justify-center gap-1">
                        <div className="font-medium pb-1">Total Amount</div>
                        <Separator />
                        <div className="text-xl font-bold">11400 ₹</div>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 grid-flow-row-dense">
                      <div>
                        <div className=" text-gray-600 text-sm">Name</div>
                        <div>Bob Johnson</div>
                      </div>
                      <div>
                        <div className=" text-gray-600 text-sm">
                          Phone Number
                        </div>
                        <div>+919252993555</div>
                      </div>

                      <div className="col-span-2 my-2">
                        <div className=" text-gray-600 text-sm">Address</div>
                        <div>Neminath Colony Sapunda Road Kekri</div>
                      </div>
                    </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bob Johnson</TableCell>
            <TableCell>20 lbs</TableCell>
            <TableCell>June 25, 2023</TableCell>
            <TableCell>
              <Badge variant="outline">Delivered</Badge>
            </TableCell>
            <TableCell>$120.00</TableCell>
            <TableCell>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="px-4 sm:px-8 mx-4 md:mx-8 text-lg min-h-[90vh] md:min-h-[80vh]">
                  <DrawerHeader className="flex justify-between items-center px-0 mb-4">
                    <div>
                      <DrawerTitle className="my-2 text-left">
                        Order Details
                      </DrawerTitle>
                      <DrawerDescription className="text-left">
                        Bob Johnson <span></span>
                        {/* in the above span add the time, when order is plcaed */}
                      </DrawerDescription>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant={"ghost"}
                        className="items-center justify-center gap-1 py-4"
                      >
                        <div className="font-medium text-sm">Status:</div>
                        <Badge
                          variant={"outline"}
                          className="text-green-500 text-base"
                        >
                          Delivered
                        </Badge>
                      </Button>
                      <Button variant={"outline"} size={"icon"}>
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </DrawerHeader>
                  <div className="gap-8 w-full md:flex">
                    <div className="grid sm:grid-cols-2 gap-4 md:w-1/2 mb-4 md:mb-0">
                      <div className="border dark:border-green-200 bg-green-900/40 p-4 text-black dark:text-white rounded-md">
                        <div className="font-medium dark:text-green-200 border-b-2 border-black dark:border-green-200 mb-4 pb-1 flex items-center justify-between">
                          <span>Regular</span>{" "}
                          <span className="dark:text-white font-semibold">
                            5400 ₹
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>250</span>
                          <span>20</span>
                          <span>5 kg</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>500</span>
                          <span>10</span>
                          <span>5 kg</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>1 kg</span>
                          <span>5</span>
                          <span>5 kg</span>
                        </div>
                      </div>
                      <div className="border dark:border-yellow-200 bg-yellow-800/40 text-black dark:text-white p-4 rounded-md">
                        <div className="font-medium dark:text-yellow-200 border-b-2 border-black dark:border-yellow-200 mb-4 pb-1 flex items-center justify-between">
                          <span>Super</span>{" "}
                          <span className="dark:text-white font-semibold">
                            6000 ₹
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>250</span>
                          <span>20</span>
                          <span>5 kg</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>500</span>
                          <span>10</span>
                          <span>5 kg</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span>1 kg</span>
                          <span>5</span>
                          <span>5 kg</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-1/2 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <div>
                        <div className="font-medium">Pickup Date</div>
                        <div>June 25, 2023</div>
                      </div>
                      <div className="py-2 border rounded-md flex flex-col items-center justify-center gap-1">
                        <div className="font-medium pb-1">Total Amount</div>
                        <Separator />
                        <div className="text-xl font-bold">11400 ₹</div>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 grid-flow-row-dense">
                      <div>
                        <div className=" text-gray-600 text-sm">Name</div>
                        <div>Bob Johnson</div>
                      </div>
                      <div>
                        <div className=" text-gray-600 text-sm">
                          Phone Number
                        </div>
                        <div>+919252993555</div>
                      </div>

                      <div className="col-span-2 my-2">
                        <div className=" text-gray-600 text-sm">Address</div>
                        <div>Neminath Colony Sapunda Road Kekri</div>
                      </div>
                    </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
// import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

// export default function AdminDashboard() {
//   return (
//     <div className="border rounded-lg overflow-hidden">

//             <Accordion type="single" collapsible className="w-full">
//               <AccordionItem value="order-1" className="w-full">
//                 <AccordionTrigger className="w-full">
//                   <div className="flex items-center justify-evenly w-full">
//                     <span>Liam Johnson</span>
//                     <span>25 lbs</span>
//                     <span>June 15, 2023</span>
//                     <span className="text-yellow-500">Pending</span>
//                     <span>$150.00</span>
//                   </div>
//                 </AccordionTrigger>
//                 <AccordionContent>
//                   <div className="grid gap-4 w-full">
//                     <div className="grid grid-cols-4 gap-4 w-full">
//                       <div>
//                         <div className="font-medium">Regular</div>
//                         <div>2 x 10 lbs</div>
//                       </div>
//                       <div>
//                         <div className="font-medium">Super</div>
//                         <div>1 x 5 lbs</div>
//                       </div>
//                       <div>
//                         <div className="font-medium">Pickup Date</div>
//                         <div>June 15, 2023</div>
//                       </div>
//                       <div>
//                         <div className="font-medium">Phone</div>
//                         <div>+1 (555) 555-5555</div>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-4 gap-4">
//                       <div>
//                         <div className="font-medium">Status</div>
//                         <div className="text-yellow-500">Pending</div>
//                       </div>
//                       <div>
//                         <div className="font-medium">Total Paid</div>
//                         <div>$150.00</div>
//                       </div>
//                       <div>
//                         <div className="font-medium">Name</div>
//                         <div>Liam Johnson</div>
//                       </div>
//                     </div>
//                   </div>
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>
//   </div>
//   )
// }
