import "@telegram-apps/telegram-ui/dist/styles.css";
// import { TonConnectUIProvider } from "@tonconnect/ui-react";
// import { tonConnectOptions } from "./utils/ton-connect";

import {
  isMiniAppDark,
  retrieveLaunchParams,
  useSignal,
} from "@telegram-apps/sdk-react";

import { AppRoot } from "@telegram-apps/telegram-ui";

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { main } from "./main";
import { mockEnv } from "./mock";
import { RadioPlayerProvider } from "./components/Radio/RadioPlayerContext";
import { RadioGlobalFooter } from "./components/Radio/RadioGlobalFooter";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// export const loader = async ({
//   request,
//   params,
//   context,
// }: Route.LoaderArgs) => {
//   console.log("root.loader()");

//   return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
// };

export async function clientLoader({
  request,
  serverLoader,
  params,
}: Route.ClientLoaderArgs) {
  try {
    await mockEnv();

    const launchParams = retrieveLaunchParams();
    const { tgWebAppPlatform: platform } = launchParams;

    const debug =
      (launchParams.tgWebAppStartParam || "").includes("platformer_debug") ||
      import.meta.env.DEV;

    const opts = {
      debug,
      eruda: debug && ["ios", "android"].includes(platform),
      mockForMacOS: import.meta.env.TELEGRAM_PLATFORM === "macOS",
    };

    await main(opts);
    return { lp: launchParams };
  } catch (error) {
    console.error("root", error);
  }
  return { lp: {} };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const isDark = useSignal(isMiniAppDark);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <RadioPlayerProvider>
          <AppRoot appearance={isDark ? "dark" : "light"} platform="base">
            {children}
            <RadioGlobalFooter />
          </AppRoot>
        </RadioPlayerProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
