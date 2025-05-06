import type { Route } from "./+types/playlist";
import { Playlist } from "@/pages/Playlist";
import {
  retrieveLaunchParams,
  useLaunchParams,
} from "@telegram-apps/sdk-react";
import { radioHeartService } from "@/services/RadioHeartService";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Playlist - Hot Shop Radio" },
    { name: "description", content: "Track playlist for Hot Shop Radio" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  try {
    // Fetch recent tracks on the server side
    const recentTracks = await radioHeartService.getRecentTracks(20);

    return {
      message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
      recentTracks,
    };
  } catch (error) {
    console.error("Server-side error fetching tracks:", error);
    return {
      message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
      recentTracks: [],
    };
  }
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
    return {
      recentTracks: [],
    };
  }
}

export default function PlaylistRoute({ loaderData }: Route.ComponentProps) {
  console.log("PlaylistRoute", loaderData);

  return <Playlist recentTracks={loaderData?.recentTracks} />;
}
