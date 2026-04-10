"use client";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Compass, Menu } from "lucide-react";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const [state, setState] = useState(false);
  const [userimg, setuserimg] = useState("https://github.com/shadcn.png");
  const [userlogin, setuserlogin] = useState(false);

  useEffect(() => {
    fetch("/api/user")
      .then((response) => response.json())
      .then((data) => {
        const image = data.user.image;
        if (image) {
          setuserlogin(true);
          setuserimg(image);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return (
    <div className="sticky top-0 z-40 border-b border-white/50 bg-white/60 backdrop-blur-lg">
      <nav className="w-full">
        <div className="mx-auto flex max-w-[1200px] items-center px-4 md:px-8">
          <div className="flex items-center justify-between py-3 md:py-4 md:block">
            <Link href="/">
              <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 md:text-3xl">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
                  <Compass className="h-4 w-4" />
                </span>
                FindIt
              </h1>
            </Link>
            <div className="md:hidden">
              <button
                className="rounded-md p-2 text-slate-700 outline-none ring-orange-500 transition hover:bg-orange-100/70 focus:ring"
                onClick={() => setState(!state)}
              >
                <Menu />
              </button>
            </div>
          </div>

          <div className={`flex-1 justify-self-center pb-3 md:mt-0 md:block md:pb-0 ${state ? "mt-6 block" : "hidden"}`}>
            <ul className="items-center justify-end space-y-5 md:flex md:space-x-3 md:space-y-0">
              <li className="rounded-full px-3 py-2 font-medium text-slate-600 transition hover:bg-white hover:text-orange-600">
                <Link href="/lost">Lost</Link>
              </li>
              <li className="rounded-full px-3 py-2 font-medium text-slate-600 transition hover:bg-white hover:text-orange-600">
                <Link href="/found">Found</Link>
              </li>
              <li className="rounded-full bg-orange-500 px-3 py-2 font-medium text-white shadow-sm transition hover:bg-orange-600">
                <Link href="/new-lost">Post Item</Link>
              </li>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="ring-2 ring-white shadow-sm">
                    <AvatarImage src={userimg} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-2 w-44 rounded-xl border-slate-200 bg-white/95">
                  <DropdownMenuItem>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem className={userlogin ? "hidden" : "block"}>
                    <Link href="/api/auth/signin">Login</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className={userlogin ? "block" : "hidden"}>
                    <Link href="/api/auth/signout">Logout</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
