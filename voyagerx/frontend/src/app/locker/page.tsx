"use client";

import { useState } from "react";
import Locker from "@/components/component/Locker";
import Navbar from "@/components/component/Navbar";

export default function LockerPage() {
  const [videoError, setVideoError] = useState(false);

  return <div className="div"><Locker /><Navbar/></div>;
}
