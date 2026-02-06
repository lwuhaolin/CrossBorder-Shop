import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    {
      path: "/",
      component: "@/layouts/index",
      routes: [
        {
          path: "/",
          component: "index",
        },
        {
          path: "/products",
          routes: [
            {
              path: "",
              component: "products/index",
            },
            {
              path: ":id",
              component: "products/[id]",
            },
          ],
        },
        {
          path: "/cart",
          component: "cart/index",
        },
        {
          path: "/checkout",
          component: "checkout/index",
        },
        {
          path: "/user",
          routes: [
            {
              path: "login",
              component: "user/login",
            },
            {
              path: "register",
              component: "user/register",
            },
            {
              path: "profile",
              component: "user/profile",
            },
            {
              path: "orders",
              routes: [
                {
                  path: "",
                  component: "user/orders/index",
                },
                {
                  path: ":id",
                  component: "user/orders/[id]",
                },
              ],
            },
            {
              path: "addresses",
              component: "user/addresses/index",
            },
            {
              path: "favorites",
              component: "user/favorites/index",
            },
            {
              path: "settings",
              component: "user/settings/index",
            },
          ],
        },
      ],
    },
  ],
  npmClient: "pnpm",
  favicons: ["/favicon.png"],
  title: "CrossBorder Shop",
});
