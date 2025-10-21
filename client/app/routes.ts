import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // Auth routes
  route("login", "./pages/auth/login.tsx"),
  route("register", "./pages/auth/register.tsx"),

  // App routes
  layout("./layout/index.tsx", [
    index("./pages/home.tsx"),
  ]),
] satisfies RouteConfig;
