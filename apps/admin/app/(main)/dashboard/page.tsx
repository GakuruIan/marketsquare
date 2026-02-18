import React from "react";

import Wrapper from "@/components/Wrapper";
import { MonthlyAnalytics } from "@workspace/ui/components/chart/MonthlyAnalytics";

const Page = () => {
  return (
    <div>
      <main className=" flex flex-col gap-4">
        <MonthlyAnalytics />

        <Wrapper>
          <div className="w-96 h-96"></div>
        </Wrapper>
      </main>
    </div>
  );
};

export default Page;
