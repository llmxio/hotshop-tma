import type { Route } from "./+types/radio";
import { Radio } from "@/pages/Radio";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { radioHeartService } from "@/services/RadioHeartService";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hot Shop Radio" },
    { name: "description", content: "Welcome to Hot Shop Radio!" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  try {
    // Fetch recent tracks on the server side
    const recentTracks = await radioHeartService.getRecentTracks(10);

    return {
      message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
      recentTracks: [...recentTracks],
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

export default function RadioRoute({ loaderData }: Route.ComponentProps) {
  console.log("RadioRoute", loaderData);

  return <Radio recentTracks={loaderData?.recentTracks} />;
}
