import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("layouts/RootNoBack.tsx", [index("routes/radio.tsx")]),

  layout("layouts/RootWithBack.tsx", [
    route("home", "routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("queue", "routes/queue.tsx"),
    route("track/:trackArtist/:trackTitle", "routes/track.tsx"),
  ]),
] satisfies RouteConfig;
