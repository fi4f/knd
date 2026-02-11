import RecentRooms from "~/components/recent-rooms";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "knd" },
    { name: "description", content: "Welcome to knd!" },
  ];
}

export default function Home() {
  return <RecentRooms />;
}
