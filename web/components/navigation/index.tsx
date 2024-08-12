import { currentUser } from "@/lib/api";
import { redirect } from "next/navigation";

export default async function SideNavigation() {
  return <div className="w-[75px] fixed inset-y-0 left-0 py-3 bg-background"></div>;
}
