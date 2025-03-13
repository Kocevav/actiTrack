"use client";
import React from "react";
import { BackgroundBeams } from "../../components/ui/background-beams";
import CardForm from "../../components/ui/card";
import Link from "next/link";

export function EventsPage() {
  return (
    <div className="w-full flex flex-1 min-h-screen bg-neutral-950 relative flex-col items-center justify-center antialiased">
      <BackgroundBeams />
      
        {/* Header with Create Button */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex justify-between items-center px-8 mt-16">
        <h1 className="text-3xl font-bold text-white">Events</h1>
        <Link href="/events/create">
          <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-300 flex items-center">
           
          {/* <button
            className="bg-orange-600 hover:bg-orange-700 transition duration-200 w-full text-white rounded-md h-10 font-medium shadow-md"
            type="submit"
          > */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Event
          </button>
        </Link>
      </div>

        {/* Додај ја секцијата со картите */}
        <div className="mt-8">
          <CardForm />
        </div>
      </div>
  );
}
export default EventsPage;