import Image from "next/image";

// components
import { Button } from "@workspace/ui/components/button";

// icons
import { ShoppingBag } from "lucide-react";

//landing image
import Landing from "@/public/landing.jpg";

export default function Page() {
  return (
    <div className="">
      <div className="relative w-full h-96 mb-12">
        {/* Background image */}
        <Image
          src={Landing}
          alt="image"
          className="object-cover h-full w-full"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-20 z-10"></div>

        {/* Text content */}
        <div className="absolute inset-0 z-20 container mx-auto flex flex-col items-center justify-center text-center px-4 gap-y-4">
          <h2 className="text-4xl text-white ">
            Shop. Sell. Thrive. Only on MarketSquare.
          </h2>
          <p className="text-base text-white">
            A seamless marketplace designed to give you the best deals and the
            best selling experience.
          </p>

          <Button size="lg">
            Shop now
            <ShoppingBag size={16} />
          </Button>
        </div>
      </div>

      <div className="container mx-auto pb-8">
        <header className="py-2 mb-4">
          <h1 className="text-4xl tracking-wider mb-2 font-poppins">
            Shop by Category
          </h1>
          <p className="text-base dark:text-neutral-400 text-gray-400">
            Find exactly what you need, faster.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="space-y-2">
            <Image src={Landing} alt="image" className="rounded-md" />
            <p className="text-base tracking-wide">Clothing</p>
          </div>
          <div className="space-y-2">
            <Image src={Landing} alt="image" className="rounded-md" />
            <p className="text-base tracking-wide">Clothing</p>
          </div>
          <div className="space-y-2">
            <Image src={Landing} alt="image" className="rounded-md" />
            <p className="text-base tracking-wide">Clothing</p>
          </div>
          <div className="space-y-2">
            <Image src={Landing} alt="image" className="rounded-md" />
            <p className="text-base tracking-wide">Clothing</p>
          </div>
          <div className="space-y-2">
            <Image src={Landing} alt="image" className="rounded-md" />
            <p className="text-base tracking-wide">Clothing</p>
          </div>
        </div>
      </div>

      <div className="mt-4 py-8 px-2">
        {/* <div className="h-80  w-full bg-linear-to-bl from-[#095351] to-[#11725D]  rounded-md">
          <div className="container mx-auto flex">
            <h4 className="text-4xl">Crazy offers</h4>
          </div>
        </div> */}
      </div>
    </div>
  );
}
