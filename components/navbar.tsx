"use client";
import React, { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Menu, Search } from "lucide-react";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";

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
    <div>
      <nav className="bg-white w-full border-b md:border-0">
        <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <Link href="/">
              <h1 className="text-3xl font-bold text-purple-600">Logo</h1>
            </Link>
            <div className="md:hidden">
              <button
                className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
                onClick={() => setState(!state)}
              >
                <Menu />
              </button>
            </div>
          </div>

          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
              state ? "block" : "hidden"
            }`}
          >
            <ul className="items-center justify-end space-y-8 md:flex md:space-x-6 md:space-y-0">
              <li className="text-gray-600 hover:text-indigo-600">
                <Link href="/new-lost">Add Lost</Link>
              </li>
              <li className="text-gray-600 hover:text-indigo-600">
                <Link href="/new-found">Add Found</Link>
              </li>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={userimg} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-2 w-40">
                  <DropdownMenuItem>My Account</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem className={userlogin ? "hidden" : "block"}>
                    <Link href="/api/auth/signin">Login</Link>
                  </DropdownMenuItem>

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
