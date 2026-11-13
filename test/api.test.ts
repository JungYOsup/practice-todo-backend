import { afterEach, beforeEach, expect, it } from "vitest";
import { ServiceBroker } from "moleculer";
import type { AddressInfo } from "node:net";
import ApiService from "../services/api.service";
import TodosService from "../services/todos.service";

let broker: ServiceBroker;
let base: string;

beforeEach(async () => {
  process.env.PORT = "0";
  broker = new ServiceBroker({ logger: false });
  const api = broker.createService(ApiService);
  broker.createService(TodosService);
  await broker.start();
  const { port } = (api.server as import("node:http").Server).address() as AddressInfo;
  base = `http://127.0.0.1:${port}`;
});

afterEach(async () => {
  await broker.stop();
  delete process.env.PORT;
});

it("POST /api/todos then GET /api/todos", async () => {
  const res = await fetch(`${base}/api/todos`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: " write tests " }),
  });
  expect(res.ok).toBe(true);
  expect(await res.json()).toEqual({ id: 1, title: "write tests", done: false });

  const list = await fetch(`${base}/api/todos`);
  expect(list.status).toBe(200);
  expect(await list.json()).toEqual([{ id: 1, title: "write tests", done: false }]);
});
