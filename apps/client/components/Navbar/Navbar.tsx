import React from "react";
import Image from "next/image";

// logo
import logo from "@/public/logo.svg";

// icons
import { Bell, ShoppingBag, Heart, Search } from "lucide-react";

const Navbar = () => {
  return (
    <div className="sticky dark:bg-neutral-900 top-0 z-40 border-b dark:border-neutral-500/40">
      <div className="flex  h-16 shrink-0 px-2 md:px-0 items-center mx-auto max-w-5xl  justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="logo" className="size-6" />
          <p className="text-sm font-montserrat">MarketSquare</p>
        </div>

        <div className="flex items-center gap-6">
          <button className="hover:cursor-pointer">
            <Search size={18} />
          </button>
          <button className="hover:cursor-pointer">
            <Bell size={18} />
          </button>
          <button className="hover:cursor-pointer">
            <Heart size={18} />
          </button>
          <button className="hover:cursor-pointer">
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
