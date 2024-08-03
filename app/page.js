"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

// outgoing = campus to station
// incoming = station to campus
const ShuttlePage = () => {
    const [showNote, setShowNote] = useState(true);

  const weekdayOutgoing = [
    420, 440, 455, 470, 485, 500, 515, 530, 545, 580, 620, 690, 885, 960, 990,
    1020, 1035, 1050, 1065, 1080, 1095, 1120, 1140, 1170, 1200, 1230, 1260,
    1290, 1320
  ];
  const weekdayIncoming = [
    435, 450, 465, 480, 495, 510, 525, 540, 575, 600, 630, 705, 855, 900, 975,
    995, 1025, 1040, 1055, 1070, 1085, 1115, 1125, 1145, 1185, 1210, 1240, 1275,
    1305, 1330,
  ];
  const weekendOutgoing = [
    440, 465, 500, 530, 550, 825, 885, 960, 990, 1020, 1065, 1125, 1185, 1245,
    1320,
  ];
  const weekendIncoming = [
    450, 480, 510, 540, 600, 855, 900, 975, 1005, 1035, 1095, 1140, 1200, 1260,
    1325,
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

      <div className="container mx-auto mt-6 px-4 sm:px-0">
        <div className="bg-gray-100 py-3 px-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-2">Planning for the Future?</h2>
          <p className="text-sm text-gray-800 ">
            <Link
              href="/schedule"
              className="hover:underline text-blue-500"
            >
              Check Out the Full Shuttle Schedule
            </Link>
          </p>
        </div>
      </div>

      {showNote && (
        <div className="bg-gray-100 mt-8 py-4 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-700 font-semibold">
                Developed by Jayesh
              </p>
              <button
                onClick={() => setShowNote(false)}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                &#x2715; {/* Close icon */}
              </button>
            </div>
            {/* Rest of the note */}
            <p className="text-sm text-gray-700 mt-2">
              You can check out the code at the{" "}
              <a
                href="https://github.com/Jayesh-kahnani/APU-Shuttle"
                className="text-blue-500 hover:underline"
              >
                github repository
              </a>
              . <br />
              <strong>Note</strong>: The timings auto-refresh after every
              minute.
            </p>
            <hr className="my-4 border-gray-300" />
            <p className="text-sm text-gray-700">
              In case of bugs or timing-changes, please reach out to me at{" "}
              <a
                href="mailto:jayesh.kahnani23_ug@apu.edu.in"
                className="text-blue-500 hover:underline"
              >
                jayesh.kahnani23_ug@apu.edu.in
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </>
  );
};

const formatTime = (timeInMinutes) => {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
};

export default ShuttlePage;
