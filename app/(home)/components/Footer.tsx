import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>
        All rights serve{" "}
        {/* <a
          href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        > */}
        <a href="/components/JAZcode" className={`font-bold hover:underline`}>
          J.A.Z Code
        </a>
      </p>
    </footer>
  );
}
