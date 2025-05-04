import type { Route } from "./+types/queue";

import { QueuePage } from "@/pages/QueuePage";
import RootWithBack from "@/layouts/RootWithBack";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { RadioHeartService } from "@/services/RadioHeartService";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Recently Played | Hot Shop Radio" },
    {
      name: "description",
      content: "Recently played tracks on Hot Shop Radio",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  try {
    // Create a new instance of RadioHeartService
    const service = new RadioHeartService();

    // Fetch 20 recently played tracks
    const recentTracks = await service.getRecentTracks(20);

    return {
      recentTracks,
      message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
    };
  } catch (error) {
    console.error("Error fetching recent tracks:", error);
    return {
      recentTracks: [],
      message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
      error: error instanceof Error ? error.message : "Failed to load tracks",
    };
  }
}

export async function clientLoader({
  request,
  serverLoader,
  params,
}: Route.ClientLoaderArgs) {
  try {
    const serverParams = await serverLoader();
    const launchParams = retrieveLaunchParams();

    return { ...launchParams, ...serverParams };
  } catch (error) {
    console.error("queue", error);
    return { recentTracks: [] };
  }
}

export default function Queue({ loaderData }: Route.ComponentProps) {
  // console.log("queue", loaderData);

  return <QueuePage recentTracks={loaderData.recentTracks} />;
}
