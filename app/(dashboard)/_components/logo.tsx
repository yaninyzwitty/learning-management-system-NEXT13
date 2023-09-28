import Image from "next/image";
import React from "react";

export default function Logo() {
  return <Image height={130} width={130} alt="logo" src="/logo.svg" />;
}
