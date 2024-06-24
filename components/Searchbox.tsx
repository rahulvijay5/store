"use client"

import React, { useEffect, useState } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { User } from "@/lib/types"
import { useRouter } from "next/navigation"

export function Searchbox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [searchResults, setSearchResults] = useState([])

  const fetchResults = async (query:string) => {
    if (!query) return
    const res = await fetch(`/api/search?query=${query}`);
    console.log("res:  ",res)
    if (!res.ok) {
        throw new Error('Failed to fetch');
    }
    const data = await res.json();
    console.log("data:  ",data)
    setSearchResults(data.message);
    console.log("SearchResults: ",searchResults)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchResults(value)
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [value])

  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-sm justify-between"
        >
          {value || "Search user..."}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-sm p-1">
        <Command>
          <CommandInput
            placeholder="Search user..."
            value={value}
            onValueChange={setValue}
          />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {searchResults.map((user:User) => (
                <CommandItem
                  key={user.id}
                  value={user.username}
                  onSelect={() => {
                    setValue(user.username)
                    setOpen(false)
                    router.push(`/admin/user-details/${user.id}`)
                  }}
                  className="cursor-pointer"
                >
                  {user.username ? user.username:user.businessName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
