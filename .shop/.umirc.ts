import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/login",
      component: "user/login",
      layout: false,
    },
    {
      path: "/dashboard",
      component: "dashboard",
    },
    {
      path: "/products",
      routes: [
        {
          path: "",
          component: "products",
        },
        {
          path: "create",
          component: "products/create",
        },
        {
          path: ":id",
          component: "products/[id]",
        },
        {
          path: ":id/edit",
          component: "products/[id]/edit",
        },
      ],
    },
    {
      path: "/categories",
      component: "categories",
    },
    {
      path: "/orders",
      routes: [
        {
          path: "",
          component: "order",
        },
        {
          path: ":id",
          component: "order/[id]",
        },
      ],
    },
    {
      path: "/addresses",
      component: "addresses",
    },
    {
      path: "/user",
      routes: [
        {
          path: "profile",
          component: "user/profile",
        },
        {
          path: "password",
          component: "user/password",
        },
      ],
    },
  ],
  npmClient: "pnpm",
  favicons: ["/favicon.png"],
});
