"use client";

import { Loader2, FilePlus, FilePen, FileSearch, FolderPen, Trash2 } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import type { ToolInvocation } from "ai";

function getLabel(toolInvocation: ToolInvocation): string {
  const args = toolInvocation.args as Record<string, unknown>;
  const path = typeof args.path === "string" ? args.path : null;
  const newPath = typeof args.new_path === "string" ? args.new_path : null;
  const fileName = path ? path.split("/").pop() : null;

  if (toolInvocation.toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return `Creating ${fileName ?? path ?? "file"}`;
      case "str_replace":
      case "insert":
        return `Editing ${fileName ?? path ?? "file"}`;
      case "view":
        return `Reading ${fileName ?? path ?? "file"}`;
      default:
        return `Editing ${fileName ?? path ?? "file"}`;
    }
  }

  if (toolInvocation.toolName === "file_manager") {
    switch (args.command) {
      case "rename":
        return `Renaming ${fileName ?? path ?? "file"}${newPath ? ` → ${newPath.split("/").pop()}` : ""}`;
      case "delete":
        return `Deleting ${fileName ?? path ?? "file"}`;
    }
  }

  return toolInvocation.toolName;
}

function getIcon(toolInvocation: ToolInvocation, done: boolean) {
  const args = toolInvocation.args as Record<string, unknown>;
  const cls = "w-3.5 h-3.5";

  if (!done) return <Loader2 className={`${cls} animate-spin text-blue-500`} />;

  if (toolInvocation.toolName === "str_replace_editor") {
    switch (args.command) {
      case "create": return <FilePlus className={`${cls} text-emerald-500`} />;
      case "view":   return <FileSearch className={`${cls} text-neutral-400`} />;
      default:       return <FilePen className={`${cls} text-blue-500`} />;
    }
  }

  if (toolInvocation.toolName === "file_manager") {
    switch (args.command) {
      case "rename": return <FolderPen className={`${cls} text-amber-500`} />;
      case "delete": return <Trash2 className={`${cls} text-red-400`} />;
    }
  }

  return <CheckCircle2 className={`${cls} text-emerald-500`} />;
}

interface ToolInvocationDisplayProps {
  toolInvocation: ToolInvocation;
}

export function ToolInvocationDisplay({ toolInvocation }: ToolInvocationDisplayProps) {
  const done = toolInvocation.state === "result" && toolInvocation.result != null;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {getIcon(toolInvocation, done)}
      <span className="text-neutral-600">{getLabel(toolInvocation)}</span>
    </div>
  );
}
