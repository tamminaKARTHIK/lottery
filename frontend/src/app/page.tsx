"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative overflow-hidden">
      <div className="flex flex-col gap-8 items-center justify-center text-center">
        <p className="text-lg font-primary text-[#e5ffad]">Earn crazy 🚀</p>
        <h1 className="text-6xl md:text-7xl font-title tracking-tight font-semibold">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#d8ff4b] from-[20%] to-[#a6b62b]">
            Try Your Luck, Win Big <br />
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#d8ff4b] from-[20%] to-[#a6b62b]">
            with Move Lottery!
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-xl font-primary text-neutral-300">
          Join the decentralized lottery revolution, powered by Aptos
          blockchain. Buy tickets, compete for exciting prizes, and experience
          the thrill of transparent, fair, and secure draws. Get started today,
          and you could be our next big winner!
        </p>
        <Link
          href={`/play-lottery`}
          className="w-fit mt-5 px-7 py-2 text-lg text-neutral-800 font-primary font-medium bg-[#e5ffad]/90 hover:bg-[#e5ffad] rounded-3xl"
          
        >
          Start playing
        </Link>
      </div>
    </main>
  );
}
