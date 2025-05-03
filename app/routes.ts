import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Radio page as index route (no back button)
  layout("layouts/RootNoBack.tsx", [index("routes/radio.tsx")]),

  // Home page with back button
  layout("layouts/RootWithBack.tsx", [
    route("home", "routes/home.tsx"),
    route("about", "routes/about.tsx"),
  ]),
] satisfies RouteConfig;
