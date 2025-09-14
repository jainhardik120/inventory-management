"use client";

import { api } from "@/server/react";

export default function Home() {
  const response = api.helloWorld.useQuery("world");
  return (
    <div>
      {response.isLoading && "Loading..."}
      {response.error && `Error : ${response.error}`}
      {response.data !== undefined && response.data}
    </div>
  );
}
