import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("layouts/RootNoBack.tsx", [index("routes/index.tsx")]),

  layout("layouts/RootWithBack.tsx", [
    route("home", "routes/home.tsx"),
    route("radio", "routes/radio.tsx"),
    route("about", "routes/about.tsx"),
    route("queue", "routes/queue.tsx"),
    route("track/:trackArtist/:trackTitle", "routes/track.tsx"),
    // Catch-all route for 404
    route("*", "routes/notfound.tsx"),
  ]),
] satisfies RouteConfig;
