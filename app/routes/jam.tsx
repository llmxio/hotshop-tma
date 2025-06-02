import type { Route } from "./+types/jam";
import { Jam } from "@/pages/Jam";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Jam - Hot Shop Radio" },
    {
      name: "description",
      content: "Jamulus - Real-time music collaboration - Hot Shop Radio",
    },
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

export default function JamRoute({ loaderData }: Route.ComponentProps) {
  return <Jam />;
}
