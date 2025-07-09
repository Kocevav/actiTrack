"use client";

import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    setTimeout(() => {
      setStatus("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 800); // simulate delay
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-6">
      <div
        className="
          relative z-10 w-full max-w-3xl px-6 py-10 
          bg-neutral-900/80 rounded-2xl shadow-2xl border border-orange-400/10 
          transition-shadow duration-300
          hover:shadow-orange-500/50 hover:scale-[1.02] hover:bg-neutral-900/90
          cursor-default
          flex flex-col gap-8
        "
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-md">
            Contact Us
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Have questions or want to get in touch? We'd love to hear from you!
            Please send us a message or use the contact details below.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-gray-300">
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-neutral-800 border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-neutral-800 border border-gray-600 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 font-semibold">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 rounded-md bg-neutral-800 border border-gray-600 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {status && <p className="mt-4 text-center text-green-400">{status}</p>}
        </form>

        {/* Contact Info & Socials */}
        <div className="mt-6 flex justify-center space-x-12 text-gray-300 text-lg">
          <a
            href=""
            className="flex flex-col items-center hover:text-orange-500 transition-colors"
          >
            <FaEnvelope size={28} />
            <span className="mt-1">Gmail</span>
          </a>

          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:text-orange-500 transition-colors"
          >
            <FaFacebookF size={28} />
            <span className="mt-1">Facebook</span>
          </a>

          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:text-orange-500 transition-colors"
          >
            <FaInstagram size={28} />
            <span className="mt-1">Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
