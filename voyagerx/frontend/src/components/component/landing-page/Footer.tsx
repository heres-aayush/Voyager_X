import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-white border-opacity-20 bg-zinc-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Copyright Section */}
        <div className="mb-4 md:mb-0">
          <p className="text-white">&copy; 2025 Voyager<span className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-transparent bg-clip-text">X</span>. {' '} All rights reserved.</p>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          {[Twitter, Facebook, Instagram, Linkedin].map((Icon, index) => (
            <a key={index} href="#" className="transition duration-300 hover:scale-110">
              <Icon className="w-6 h-6 text-white transition-colors duration-300 hover:text-rose-500" />
            </a>
          ))}
        </div>

        {/* Terms & Privacy Links */}
        <div className="mt-4 md:mt-0 text-gray-300">
          <a href="#" className="hover:underline">
            Terms of Use
          </a>
          <span className="mx-2">|</span>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}