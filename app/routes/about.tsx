import type { Route } from "./+types/about";
import { AboutPage } from "~/pages/AboutPage";

export async function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to ABOUT Router!" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

export default function About({ loaderData }: Route.ComponentProps) {
  return <AboutPage />;
}
