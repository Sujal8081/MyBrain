import type { Metadata } from "next";
import { Storefront } from "@/components/store/storefront";

export const metadata: Metadata = {
  title: "Serein — Objects for the considered home",
  description: "A curated collection of furniture, lighting, and objects made for thoughtful homes.",
};

export default function Home() {
  return <Storefront />;
}
