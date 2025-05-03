import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Radio page as index route (no back button)
  layout("layouts/RouteLayoutNoBack.tsx", [index("routes/radio.tsx")]),

  // Home page with back button
  layout("layouts/RouteLayoutWithBack.tsx", [
    route("home", "routes/home.tsx"),
    route("about", "routes/about.tsx"),
  ]),

  // // About page without back button
  // layout("layouts/RouteLayoutNoBack.tsx", [route("about", "routes/about.tsx")]),
] satisfies RouteConfig;
