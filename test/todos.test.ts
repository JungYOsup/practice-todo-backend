import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ServiceBroker } from "moleculer";
import TodosService from "../services/todos.service";

describe("todos service", () => {
  let broker: ServiceBroker;

  beforeEach(async () => {
    broker = new ServiceBroker({ logger: false });
    broker.createService(TodosService);
    await broker.start();
  });

  afterEach(async () => {
    await broker.stop();
  });

  it("list is empty at start", async () => {
    expect(await broker.call("todos.list")).toEqual([]);
  });

  it("create returns the todo and list contains it", async () => {
    const todo = await broker.call("todos.create", { title: "buy milk" });
    expect(todo).toEqual({ id: 1, title: "buy milk", done: false });
    expect(await broker.call("todos.list")).toEqual([todo]);
  });

  it("create trims the title", async () => {
    const todo = await broker.call<{ title: string }, { title: string }>("todos.create", { title: "  hi  " });
    expect(todo.title).toBe("hi");
  });

  it.each([[{ title: "" }], [{ title: "   " }], [{}]])("create rejects invalid params %j with 422", async (params) => {
    await expect(broker.call("todos.create", params)).rejects.toMatchObject({ code: 422 });
  });

  it("complete sets done and list reflects it", async () => {
    await broker.call("todos.create", { title: "a" });
    const done = await broker.call("todos.complete", { id: "1" });
    expect(done).toEqual({ id: 1, title: "a", done: true });
    expect(await broker.call("todos.list")).toEqual([{ id: 1, title: "a", done: true }]);
  });

  it("complete with unknown id rejects with 404", async () => {
    await expect(broker.call("todos.complete", { id: "99" })).rejects.toMatchObject({
      code: 404,
      type: "NOT_FOUND",
    });
  });
});
