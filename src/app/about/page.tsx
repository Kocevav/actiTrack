"use client";

import React, { useState } from "react";
import { FloatingNavBar } from "../../components/home/navbar";

const AboutPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [whichForm, setWhichForm] = useState(false);

  const changeShowFormState = () => setShowForm(!showForm);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-4">
      {/* Floating Nav Bar */}
      <FloatingNavBar setShowForm={changeShowFormState} whichForm={whichForm} />

      {/* Content Box */}
      <div
        className="
          relative z-10 w-full max-w-3xl mt-20 px-4 py-10 
          bg-neutral-900/80 rounded-2xl shadow-2xl border border-orange-400/10 
          transition-shadow duration-300
          hover:shadow-orange-500/50 hover:scale-[1.02] hover:bg-neutral-900/90
          cursor-pointer
        "
      >
        <h1 className="text-4xl font-bold text-white mb-6 text-center drop-shadow-md">
          About the Application
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          Our platform is created for sports enthusiasts who want to track, share, and analyze their activities. You can create your own events, join activities from other users, and leave ratings and comments.
          <br /><br />
          With integration of the Strava API, a modern UI, and activity statistics, this application helps you stay motivated and connected with the community.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
