import Image from "next/image";

/** Το επίσημο σήμα του σχολείου, με διατήρηση των αναλογιών του PNG. */
export default function Logo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <Image
      src="/logomousiko.png"
      alt=""
      width={64}
      height={64}
      aria-hidden="true"
      className={className + " object-contain"}
    />
  );
}
