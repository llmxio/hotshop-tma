import type { Route } from "./+types/history"; // Assuming types will be moved or this is a conventional path
import { History } from "@/pages/History";
import {
  retrieveLaunchParams,
  useLaunchParams,
} from "@telegram-apps/sdk-react";
import { radioHeartService } from "@/services/RadioHeartService";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "History - Hot Shop Radio" },
    { name: "description", content: "Track history for Hot Shop Radio" },
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

export async function clientLoader({
  request,
  serverLoader,
}: Route.ClientLoaderArgs) {
  try {
    // Get data from the server loader which now includes recentTracks
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

export default function HistoryRoute({ loaderData }: Route.ComponentProps) {
  return <History recentTracks={loaderData?.recentTracks} />;
}
