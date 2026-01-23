"use client";
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Slider from "react-slick";

const ShuttlePage = () => {
  const [outgoingTimings, setOutgoingTimings] = useState([]);
  const [incomingTimings, setIncomingTimings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNote, setShowNote] = useState(true);
useEffect(() => {
  const fetchData = async () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();

    let outgoingSchedule = [];
    let incomingSchedule = [];

    const dayType =
      currentDay === 0 || currentDay === 6 ? "weekend" : "weekday";

    try {
      setLoading(true);
      const scheduleDoc = await getDoc(doc(db, "shuttleTimings", dayType));
      if (scheduleDoc.exists()) {
        outgoingSchedule = scheduleDoc
          .data()
          .outgoing.filter((time) => time > currentTime);
        incomingSchedule = scheduleDoc
          .data()
          .incoming.filter((time) => time > currentTime);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching shuttle timings: ", error);
    } finally {
      setLoading(false);
    }

    outgoingSchedule.sort((a, b) => a - b);
    incomingSchedule.sort((a, b) => a - b);

    setOutgoingTimings(outgoingSchedule);
    setIncomingTimings(incomingSchedule);
  };

  fetchData();

  const interval = setInterval(fetchData, 30000);

  return () => clearInterval(interval);
}, []);

  const formatTime = (timeInMinutes) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };

  const calculateTimeLeft = (timeInMinutes) => {
    const currentTime = new Date();
    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();
    const minutesLeft = timeInMinutes - currentMinutes;
    const hoursLeft = Math.floor(minutesLeft / 60);
    const remainingMinutes = minutesLeft % 60;
    return {
      hours: hoursLeft,
      minutes: remainingMinutes,
    };
  };

  const formatTimings = (timings) =>
    timings.map((time) => {
      const { hours, minutes } = calculateTimeLeft(time);
      return {
        scheduled: `Scheduled time: ${formatTime(time)}`,
        timeLeft: `Time left: ${hours} hours and ${minutes} minutes`,
      };
    });

  const incomingItems = formatTimings(incomingTimings);
  const outgoingItems = formatTimings(outgoingTimings);

  const settings = {
    arrows: false,
    dots: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="container custom mx-auto mt-4 sm:mt-8 px-4 sm:px-0">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">
          APU Shuttle Timings
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-black p-6 rounded-3xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">
              Sarjapura Police Station to Campus
            </h3>
            <div className="carousel-content">
              <Slider {...settings}>
                {loading ? (
                  <div className="carousel-item">
                    <div className="carousel-item-content">
                      <p className="text-gray-300">Loading data...</p>
                    </div>
                  </div>
                ) : incomingItems.length > 0 ? (
                  incomingItems.map((item, index) => (
                    <div key={index} className="carousel-item">
                      <div className="carousel-item-content">
                        <div className="scheduled-time">{item.scheduled}</div>
                        <div className="time-left">{item.timeLeft}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="carousel-item">
                    <div className="carousel-item-content">
                      <p className="text-gray-300">No more shuttles today</p>
                    </div>
                  </div>
                )}
              </Slider>
            </div>
          </div>
          <div className="bg-black p-6 rounded-3xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">
              Campus to Sarjapura Police Station
            </h3>
            <div className="carousel-content">
              <Slider {...settings}>
                {loading ? (
                  <div className="carousel-item">
                    <div className="carousel-item-content">
                      <p className="text-gray-300">Loading data...</p>
                    </div>
                  </div>
                ) : outgoingItems.length > 0 ? (
                  outgoingItems.map((item, index) => (
                    <div key={index} className="carousel-item">
                      <div className="carousel-item-content">
                        <div className="scheduled-time">{item.scheduled}</div>
                        <div className="time-left">{item.timeLeft}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="carousel-item">
                    <div className="carousel-item-content">
                      <p className="text-gray-300">No more shuttles today</p>
                    </div>
                  </div>
                )}
              </Slider>
            </div>
          </div>
        </div>
      </div>
      {showNote && (
        <div className="bg-gray-800 text-gray-100 mt-8 py-4 px-4 sm:px-6 rounded-lg shadow-md">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold">Developed by Jayesh</p>
              <button
                onClick={() => setShowNote(false)}
                className="text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                &#x2715; 
              </button>
            </div>

            <p className="text-sm mt-2">
              You can check out the code at the{" "}
              <a
                href="https://github.com/Jayesh-kahnani/APU-Shuttle"
                className="text-blue-400 hover:underline"
              >
                github repository
              </a>
              . <br />
              <strong>Note</strong>: The timings auto-refresh after every
              minute.
              <br />
              <strong>Also</strong>: Swipe the timings to see the next
              shuttle.
                              <br /> 
                                            <strong>Also</strong>: <a
                href="apu-shuttle.vercel.app/schedule"
                className="text-blue-400 hover:underline"
              >
                View Full Schedule
              </a>


            </p>
            <hr className="my-4 border-gray-600" />
            <p className="text-sm">
              In case of bugs or timing changes, please reach out to me at{" "}
              <a
                href="mailto:jayesh.kahnani23_ug@apu.edu.in"
                className="text-blue-400 hover:underline"
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

export default ShuttlePage;
