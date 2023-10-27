"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export const revalidate = 0;

export default function Page({ params }: { params: { id: string } }) {
  const r = useRouter();

  useEffect(() => {
    const id = window.setInterval(() => {
      r.refresh();
    }, 2000);
    return () => window.clearInterval(id);
  }, [r]);
  const id = params.id;

  return (
    <div>
      <img
        src={`/badge/${id}`}
        alt="status badge"
        style={{
          width: "100px",
          height: "25px",
        }}
      />
    </div>
  );
}
