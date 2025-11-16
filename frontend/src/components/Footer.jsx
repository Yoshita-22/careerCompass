import React from "react";

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-blue-100 bg-white py-4 text-center text-gray-500 text-sm fixed bottom-0 left-64 right-0">
      © {new Date().getFullYear()} CareerCompass. All rights reserved.
    </footer>
  );
}
