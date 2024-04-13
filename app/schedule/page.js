import React from "react";

const Schedule = () => {
  const weekdayOutgoing = [
    440, 455, 470, 485, 500, 515, 530, 545, 580, 605, 645, 840, 885, 960, 990,
    1020, 1035, 1050, 1065, 1080, 1095, 1110, 1140, 1170, 1195, 1215, 1245,
    1275, 1290, 1320,
  ];
  const weekdayIncoming = [
    435, 450, 465, 480, 495, 510, 525, 540, 575, 600, 630, 705, 855, 900, 975,
    1015, 1025, 1050, 1065, 1080, 1095, 1115, 1145, 1175, 1200, 1225, 1260,
    1285, 1305,
  ];
  const weekendOutgoing = [
    455, 485, 515, 545, 795, 885, 960, 990, 1020, 1050, 1080, 1140, 1200, 1260,
    1320,
  ];
  const weekendIncoming = [
    450, 480, 510, 540, 600, 855, 900, 975, 1005, 1035, 1065, 1095, 1155, 1230,
    1290,
  ];

  const formatTime = (timeInMinutes) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };

  return (
    <div class=" w-full h-screen">
      <iframe
        src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRPrHrPPDu07P_b9h13qQXAOu0Wc4TY1FUrkph4SY2ctTqRRlfOGhY-IsUF_s6S2TosKF8nhEcj26TF/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false"
        class="aspect-w-16 aspect-h-9 w-full h-full"
      ></iframe>
    </div>
  );
};

export default Schedule;
