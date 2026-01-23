import React from "react";

const Schedule = () => {
  return (
    <div className="w-full h-[100dvh] overflow-hidden">
      <div className="relative w-full h-full">
        <iframe
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRPrHrPPDu07P_b9h13qQXAOu0Wc4TY1FUrkph4SY2ctTqRRlfOGhY-IsUF_s6S2TosKF8nhEcj26TF/pubhtml?gid=0&single=true"
          className="absolute inset-0 w-full h-full border-0"
          title="Schedule"
        />
      </div>
    </div>
  );
};

export default Schedule;
