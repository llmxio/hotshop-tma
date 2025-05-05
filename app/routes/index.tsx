import { Index } from "@/pages/Index";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import RootNoBack from "@/layouts/RootNoBack";
import { radioHeartService } from "@/services/RadioHeartService";
import type { Track } from "@/services/RadioHeartService";

interface LoaderData {
  message?: string;
  recentTracks: Track[];
}

interface ClientLoaderData extends LoaderData {
  // Add any additional client-side data properties here
}

export function meta() {
  return [
    { title: "Hot Shop Radio" },
    { name: "description", content: "Welcome to Hot Shop Radio!" },
  ];
}

export async function loader({
  context,
}: {
  context: any;
}): Promise<LoaderData> {
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
  params,
}: {
  request: Request;
  serverLoader: () => Promise<LoaderData>;
  params: any;
}): Promise<ClientLoaderData> {
  try {
    const serverParams = await serverLoader();
    const launchParams = retrieveLaunchParams();

    return { ...launchParams, ...serverParams };
  } catch (error) {
    console.error("index", error);
    return { recentTracks: [] };
  }
}

// Define the component and assign it to a variable before exporting
export default function IndexRoute({
  loaderData,
}: {
  loaderData: ClientLoaderData;
}) {
  return <Index recentTracks={loaderData?.recentTracks} />;
}
