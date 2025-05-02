import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/radio.tsx"),
  route("home", "routes/home.tsx"),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
