import Image from "next/image";

// components
import { Button } from "@workspace/ui/components/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";

// icons
import { ArrowRight, ShoppingBag } from "lucide-react";

//landing image
import Landing from "@/public/landing.jpg";
import Delivery from "@/public/delivery.jpg";
import holiday_pic from "@/public/holiday.png";

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

      <div className="container mx-auto pb-8 mb-8">
        <header className="py-2 mb-4 md:px-0 px-2">
          <h1 className="text-4xl tracking-wider mb-2 font-poppins">
            Shop by Category
          </h1>
          <p className="text-base dark:text-neutral-400 text-gray-400">
            Find exactly what you need, faster.
          </p>
        </header>

        {/* categories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:px-0 px-2">
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
        {/* categories */}
      </div>

      {/* promotions */}
      <div className="mt-4 container mx-auto pb-8 px-2">
        <div className="grid grid-col-1 md:grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            {/* promotion one */}
            <div className="min-h-44 h-full w-full bg-indigo-600 rounded-sm p-4">
              <div className="flex h-full items-center justify-between gap-2">
                <div className="max-w-xl space-y-4 ">
                  <h1 className="text-xl font-medium mb-2">
                    Mega Holiday Sale – Up to 50% OFF!
                  </h1>
                  <p className="text-sm font-poppins">
                    Shop exclusive deals from your favorite vendors this season.
                    Limited time only!
                  </p>

                  <button className="flex items-center gap-2 rounded-full border border-white px-6 py-1.5 text-sm transition-all hover:cursor-pointer hover:bg-white duration-75 hover:text-gray-600">
                    Shop now
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
            {/* promotion one */}

            {/* promotion two */}
            <div className="min-h-44 h-full w-full bg-fuchsia-600 rounded-sm p-4">
              <div className="flex items-center justify-between h-full gap-2">
                <div className="max-w-xl space-y-4">
                  <h1 className="text-xl font-medium mb-2">
                    Flash Deals Starting at $1
                  </h1>
                  <p className="text-sm font-poppins">
                    Every hour, new discounts go live. Don’t miss out!
                  </p>

                  <button className="flex items-center gap-2 rounded-full border border-white px-6 py-1.5 text-sm transition-all hover:cursor-pointer hover:bg-white duration-75 hover:text-gray-600">
                    Grab the Deal
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* promotion two */}
          </div>
          {/* promotion three */}
          <div className="h-full w-full rounded-sm bg-[#FFECCC] p-4">
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className="h-full w-full mb-2">
                <Image
                  src={Delivery}
                  alt="delivery image"
                  className="h-full w-full  object-cover"
                />
              </div>

              <div className="space-y-4 pb-2">
                <h1 className="text-xl font-medium mb-2 text-black">
                  Free Delivery on Orders Above $50
                </h1>
                <p className="text-sm font-poppins text-black">
                  Shop more, save more. Thousands of vendors, one free shipping
                  offer
                </p>

                <button className="flex items-center gap-2 rounded-full border border-neutral-700 text-neutral-800 px-6 py-1.5 text-sm transition-all hover:cursor-pointer hover:bg-neutral-800 duration-75 hover:text-gray-200">
                  Start Shopping
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
          {/* promotion three */}
        </div>
      </div>
      {/* promotions */}

      {/* how it works */}
      <div className="pb-8 mt-4 px-2">
        <div className="container mx-auto">
          <header className="py-2 mb-6 md:px-0 px-2 text-center">
            <h1 className="text-4xl tracking-wider mb-2 font-poppins">
              How it works
            </h1>
            <p className="text-base dark:text-neutral-400 text-gray-400">
              Shop from trusted vendors in just three simple steps.
            </p>
          </header>

          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Product Information</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Our flagship product combines cutting-edge technology with
                  sleek design. Built with premium materials, it offers
                  unparalleled performance and reliability.
                </p>
                <p>
                  Key features include advanced processing capabilities, and an
                  intuitive user interface designed for both beginners and
                  experts.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Shipping Details</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  We offer worldwide shipping through trusted courier partners.
                  Standard delivery takes 3-5 business days, while express
                  shipping ensures delivery within 1-2 business days.
                </p>
                <p>
                  All orders are carefully packaged and fully insured. Track
                  your shipment in real-time through our dedicated tracking
                  portal.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Return Policy</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  We stand behind our products with a comprehensive 30-day
                  return policy. If you&apos;re not completely satisfied, simply
                  return the item in its original condition.
                </p>
                <p>
                  Our hassle-free return process includes free return shipping
                  and full refunds processed within 48 hours of receiving the
                  returned item.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* footer */}

      <div className="py-10 container mx-auto border-t dark:border-neutral-700">
        <footer className="">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Image src="/logo.svg" alt="Brand Logo" width={24} height={24} />
              <p className="text-sm mt-2">
                Your trusted marketplace for buying or selling across Kenya.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-white mb-2">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Press & Media</li>
                  <li>Testimonials</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Explore</h3>
                <ul className="space-y-2 text-sm">
                  <li>Browse products</li>
                  <li>Sell Your products</li>
                  <li>Financing Options</li>
                  <li>Blog</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-white mb-2">
                Contact & Socials
              </h3>
              <p className="text-sm">support@yourbrand.ke</p>
              <p className="text-sm">+254 700 123 456</p>
              <p className="text-sm">Westlands, Nairobi</p>
              <div className="flex space-x-3 mt-3">
                {/* add social icons here */}
              </div>
            </div>
          </div>

          <div className="border-t dark:border-t-neutral-700 mt-8 pt-6 text-center text-sm">
            <p>© 2025 Your Brand. All rights reserved.</p>
            <p>Registered in Kenya • Terms & Privacy apply.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
