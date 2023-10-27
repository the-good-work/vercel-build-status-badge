"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export const revalidate = 0;

export default function Page({ params }: { params: { id: string } }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setTime(() => new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const id = params.id;

  return (
    <div>
      <img
        src={`/badge/${id}?t=${time.getTime()}`}
        alt="status badge"
        style={{
          width: "100px",
          height: "25px",
        }}
      />
    </div>
  );
}
