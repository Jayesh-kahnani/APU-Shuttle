"use client"
import React, { useState, useEffect } from "react";

const ShuttlePage = () => {

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
    450, 480, 510, 540, 600, 855, 900, 975, 1065, 1095, 1125, 1155, 1215, 1170,
    1260, 1350, 1410, 1515, 1575, 1635, 1695, 1755, 1815, 1935, 2010, 2070,
    2130, 2190,
  ];
  const [nextOutgoing, setNextOutgoing] = useState(null);
  const [nextIncoming, setNextIncoming] = useState(null);
  const [timeLeftOutgoing, setTimeLeftOutgoing] = useState({
    hours: 0,
    minutes: 0,
  });
  const [timeLeftIncoming, setTimeLeftIncoming] = useState({
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const fetchData = () => {
      const currentDate = new Date();
      const currentDay = currentDate.getDay();
      const currentTime =
        currentDate.getHours() * 60 + currentDate.getMinutes();

      let outgoingSchedule, incomingSchedule;

      if (currentDay === 0 || currentDay === 6) {
        outgoingSchedule = weekendOutgoing;
        incomingSchedule = weekendIncoming;
      } else {
        outgoingSchedule = weekdayOutgoing;
        incomingSchedule = weekdayIncoming;
      }

      let nextOutgoingTime = null;
      let nextIncomingTime = null;

      outgoingSchedule.forEach((time) => {
        if (time > currentTime && !nextOutgoingTime) {
          nextOutgoingTime = time;
        }
      });

      incomingSchedule.forEach((time) => {
        if (time > currentTime && !nextIncomingTime) {
          nextIncomingTime = time;
        }
      });

      if (nextOutgoingTime) {
        setNextOutgoing(nextOutgoingTime);
        const hoursLeftOutgoing = Math.floor(
          (nextOutgoingTime - currentTime) / 60
        );
        const minutesLeftOutgoing = (nextOutgoingTime - currentTime) % 60;
        setTimeLeftOutgoing({
          hours: hoursLeftOutgoing,
          minutes: minutesLeftOutgoing,
        });
      }

      if (nextIncomingTime) {
        setNextIncoming(nextIncomingTime);
        const hoursLeftIncoming = Math.floor(
          (nextIncomingTime - currentTime) / 60
        );
        const minutesLeftIncoming = (nextIncomingTime - currentTime) % 60;
        setTimeLeftIncoming({
          hours: hoursLeftIncoming,
          minutes: minutesLeftIncoming,
        });
      }
    };

    // Fetch data initially
    fetchData();

    // Refresh data every minute
    const interval = setInterval(fetchData, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);


  return (
    <>
      <div className="container mx-auto mt-8 px-4 sm:px-0">
        <h1 className="text-2xl font-bold mb-4">APU Shuttle Timings</h1>
        <div className="flex flex-col gap-4">
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
              Sarjapura Police Station to Campus
            </h3>
            {nextIncoming ? (
              <div>
                <p>Scheduled arrival time: {formatTime(nextIncoming)}</p>
                <p>
                  Time left: {timeLeftIncoming.hours} hours and{" "}
                  {timeLeftIncoming.minutes} minutes
                </p>
              </div>
            ) : (
              <p>No upcoming incoming shuttle</p>
            )}
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
              Campus to Sarjapura Police Station
            </h3>
            {nextOutgoing ? (
              <div>
                <p>Scheduled departure time: {formatTime(nextOutgoing)}</p>
                <p>
                  Time left: {timeLeftOutgoing.hours} hours and{" "}
                  {timeLeftOutgoing.minutes} minutes
                </p>
              </div>
            ) : (
              <p>No upcoming or outgoing shuttle</p>
            )}
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-600 mt-8 px-4 sm:px-0">
        <p className="font-semibold">Developed by Jayesh</p>
        <p className="mt-2">
          You can check out the code at the{" "}
          <a
            href="https://github.com/Jayesh-kahnani/APU-Shuttle"
            className="text-blue-500 hover:underline"
          >
            github repository
          </a>. <br />
          <strong>Note</strong>: The timings refresh after every minute.
        </p><hr></hr>
      </div>
    </>
  );
};

const formatTime = (timeInMinutes) => {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
};

export default ShuttlePage;
