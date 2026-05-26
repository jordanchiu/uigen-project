import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function makeInvocation(
  toolName: string,
  args: Record<string, unknown>,
  state: "call" | "result" = "result"
): ToolInvocation {
  return state === "result"
    ? { toolCallId: "1", toolName, args, state, result: "ok" }
    : { toolCallId: "1", toolName, args, state };
}

test("str_replace_editor create shows 'Creating <filename>'", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/components/Button.tsx" })}
    />
  );
  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("str_replace_editor str_replace shows 'Editing <filename>'", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "/App.jsx" })}
    />
  );
  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("str_replace_editor insert shows 'Editing <filename>'", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={makeInvocation("str_replace_editor", { command: "insert", path: "/App.jsx" })}
    />
  );
  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("str_replace_editor view shows 'Reading <filename>'", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={makeInvocation("str_replace_editor", { command: "view", path: "/utils/helpers.ts" })}
    />
  );
  expect(screen.getByText("Reading helpers.ts")).toBeDefined();
});

test("file_manager rename shows 'Renaming <file> → <newfile>'", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={makeInvocation("file_manager", { command: "rename", path: "/OldName.tsx", new_path: "/NewName.tsx" })}
    />
  );
  expect(screen.getByText("Renaming OldName.tsx → NewName.tsx")).toBeDefined();
});

test("file_manager delete shows 'Deleting <filename>'", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={makeInvocation("file_manager", { command: "delete", path: "/components/Old.tsx" })}
    />
  );
  expect(screen.getByText("Deleting Old.tsx")).toBeDefined();
});

test("in-progress invocation renders without crashing", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/Foo.tsx" }, "call")}
    />
  );
  expect(screen.getByText("Creating Foo.tsx")).toBeDefined();
});

test("unknown tool falls back to tool name", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={makeInvocation("some_unknown_tool", {})}
    />
  );
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});
