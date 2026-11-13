import { Errors, ServiceSchema } from "moleculer";

export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

interface TodosThis {
  todos: Todo[];
  nextId: number;
}

const TodosService: ServiceSchema = {
  name: "todos",

  created() {
    const state: TodosThis = { todos: [], nextId: 1 };
    Object.assign(this, state);
  },

  actions: {
    list(this: TodosThis): Todo[] {
      return this.todos;
    },

    create(this: TodosThis, ctx: { params: { title?: unknown } }): Todo {
      const { title } = ctx.params;
      if (typeof title !== "string" || title.trim() === "") {
        throw new Errors.ValidationError("title must be a non-empty string", "VALIDATION_ERROR", [
          { field: "title", message: "must be a non-empty string" },
        ]);
      }
      const todo: Todo = { id: this.nextId++, title: title.trim(), done: false };
      this.todos.push(todo);
      return todo;
    },

    complete(this: TodosThis, ctx: { params: { id?: unknown } }): Todo {
      const id = Number(ctx.params.id);
      const todo = this.todos.find((t) => t.id === id);
      if (!todo) {
        throw new Errors.MoleculerClientError("todo not found", 404, "NOT_FOUND", { id: ctx.params.id });
      }
      todo.done = true;
      return todo;
    },
  },
};

export default TodosService;
