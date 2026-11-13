import { ServiceSchema } from "moleculer";
import ApiGateway from "moleculer-web";

const ApiService: ServiceSchema = {
  name: "api",
  mixins: [ApiGateway],

  settings: {
    port: process.env.PORT ?? 3000,
    routes: [
      {
        path: "/api",
        bodyParsers: { json: true },
        aliases: {
          "GET /todos": "todos.list",
          "POST /todos": "todos.create",
          "PATCH /todos/:id/complete": "todos.complete",
        },
      },
    ],
  },
};

export default ApiService;
