import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date:Date | null, formatStr:string = "dd/MM/yyyy"):string =>{
  if(!date) return "";
  return format(date,formatStr);
}
