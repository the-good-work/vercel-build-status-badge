"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const r = useRouter();
  return (
    <div>
      <div className="flex gap-2 items-center">
        Check deploy status:{" "}
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
              r.push(`/badge/${(id as HTMLInputElement).value}`);
            }
          }}
        >
          Go
        </button>
      </div>
    </div>
  );
}
