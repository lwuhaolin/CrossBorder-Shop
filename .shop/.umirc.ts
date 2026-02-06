import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/dashboard",
      component: "dashboard",
    },
    {
      path: "/order",
      component: "order",
    },
    {
      path: "/entity",
      routes: [
        {
          path: "supplier",
          component: "entity/supplier",
        },
        {
          path: "staff",
          component: "entity/staff",
        },
        {
          path: "customer",
          component: "entity/customer",
        },
        {
          path: "flower",
          routes: [
            {
              path: "",
              component: "entity/flower",
            },
            {
              path: ":identifier/detail",
              component: "entity/flower/detail",
            },
            {
              path: "loss",
              component: "entity/flower/loss",
            },
          ],
        },
        {
          path: "package",
          component: "entity/package",
        },
      ],
    },
  ],
  npmClient: "pnpm",
  favicons: ["/favicon.png"],
});
