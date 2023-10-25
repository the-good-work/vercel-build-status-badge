"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const r = useRouter();
  return (
    <div>
      <div className="flex items-center">
        Copy this:
        <img
          src="/deploy.png"
          alt="deploy id"
          className="w-[700px] h-[40px] block"
        />
      </div>
      <hr className="my-4" />
      <div className="flex gap-2 items-center">
        Paste here:
        <input
          type="text"
          name="deployId"
          id="deployId"
          placeholder="paste deploy ID"
        />
        <button
          onClick={() => {
            const id = document.getElementById("deployId");
            if (id !== null) {
              r.push(`/e/${(id as HTMLInputElement).value}`);
            }
          }}
        >
          Go
        </button>
      </div>
    </div>
  );
}
