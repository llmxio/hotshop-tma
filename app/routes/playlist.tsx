import type { Route } from "./+types/playlist";
import { Playlist } from "@/pages/Playlist";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Playlist - Hot Shop Radio" },
    { name: "description", content: "Coming soon - Hot Shop Radio" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
  };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  try {
    const serverParams = await serverLoader();
    const launchParams = retrieveLaunchParams();

    return {
      ...launchParams,
      ...serverParams,
    };
  } catch (error) {
    console.error("Client loader error:", error);
    return {};
  }
}

export default function PlaylistRoute({ loaderData }: Route.ComponentProps) {
  return <Playlist />;
}
