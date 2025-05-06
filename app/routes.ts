import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("layouts/RootNoBack.tsx", [
    index("routes/radio.tsx"),
    route("profile", "routes/profile.tsx"),
    route("history", "routes/history.tsx"),
    route("track/:trackArtist/:trackTitle", "routes/track.tsx"),
    // Catch-all route for 404
    route("*", "routes/notfound.tsx"),
  ]),

  // layout("layouts/RootWithBack.tsx", [
  //   route("profile", "routes/profile.tsx"),
  //   route("history", "routes/history.tsx"),
  //   route("track/:trackArtist/:trackTitle", "routes/track.tsx"),
  //   // Catch-all route for 404
  //   route("*", "routes/notfound.tsx"),
  // ]),
] satisfies RouteConfig;
