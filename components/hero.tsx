// File path: components/hero.tsx
"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type ChildrenProps = {
  children: ReactNode;
};

type HighlightProps = {
  children: ReactNode;
  className?: string;
};

// Dummy implementations for demonstration.
// Replace these with your actual components if available.
const HeroHighlight = ({ children }: ChildrenProps) => <div>{children}</div>;
const Highlight = ({ children, className }: HighlightProps) => (
  <span className={className}>{children}</span>
);

export default function Hero() {
  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white to-gray-100 pt-20">
      {/* Dotted background (like in onboarding) */}
      <div className="absolute inset-0 z-0 bg-dots" />

      {/* Main Text Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-lg mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black"
          >
            Stunite
          </motion.h1>
          <HeroHighlight>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [20, -5, 0] }}
              transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
              className="whitespace-nowrap text-xl sm:text-2xl px-4 font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto mt-8"
            >
              <Highlight className="relative inline-block overflow-hidden text-black dark:text-white">
                <motion.span
                  initial={{ x: "-50%" }}
                  animate={{ x: "150%" }}
                  transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                  className="absolute top-0 left-0 w-1/2 h-full bg-yellow-300 opacity-30"
                />
                <span style={{ fontSize: "125%" }} className="relative z-10">
                  Find a friend, connect and blend!
                </span>
              </Highlight>
            </motion.h1>
          </HeroHighlight>
          {/* Fun styled text */}
          <div className="mt-6 p-4 bg-gradient-to-r from-pink-100 to-yellow-100 rounded-lg shadow-lg">
            <p className="text-base sm:text-lg text-gray-700 font-mono">
              Ready to meet new friends? Just answer a few fun questions, scroll through
              profiles like you're on Instagram or TikTok, and start connecting with people
              who vibe with you.
              <br />
              <br />
              It's that easy to find friends and chat directly! Let the good times roll
              with endless fun and new connections. Your next bestie is just a swipe away!
            </p>
          </div>
          {/* People Images with Blur-In Animation */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {/* Virtual Chatting Image */}
            <motion.img
              src="https://images.unsplash.com/photo-1593642532973-d31b6557fa68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80"
              alt="Person chatting virtually on phone"
              className="w-15 h-15 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover"
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            {/* Group Conversation Image */}
            <motion.img
              src="https://thumbs.dreamstime.com/b/group-four-people-two-men-women-sitting-circle-talking-to-each-other-all-smiling-seem-be-having-friendly-336330282.jpg"
              alt="Group of people talking"
              className="w-15 h-15 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover"
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            {/* Laughing Image */}
            <motion.img
              src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80"
              alt="Person laughing with friends"
              className="w-15 h-15 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover"
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          {/* Call-to-Action Button */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-800 hover:bg-gray-900 rounded-full text-white font-semibold transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Dotted background style */}
      <style jsx>{`
        .bg-dots {
          background-image: radial-gradient(currentColor 1px, transparent 1px);
          background-size: 15px 15px;
          opacity: 0.1;
        }
      `}</style>
    </div>
  );
}