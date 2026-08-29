"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  isTaskStatus,
  validateTaskTitle,
  type Task,
  type TaskStatus,
} from "@/lib/tasks/task-utils";

export interface TaskMutationInput {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status?: TaskStatus;
  reminderAt?: string | null;
}

export type TaskActionResult =
  | { success: true; task?: Task }
  | { success: false; error: string };

async function getAuthenticatedContext() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string") {
    return {
      success: false,
      error: "Your session has expired. Please sign in again.",
    } as const;
  }

  return { success: true, supabase, userId } as const;
}

function refreshTaskViews() {
  revalidatePath("/protected");
  revalidatePath("/protected/tasks");
  revalidatePath("/protected/reminders");
}

export async function createTaskAction(
  input: TaskMutationInput,
): Promise<TaskActionResult> {
  const titleResult = validateTaskTitle(input.title);
  if (!titleResult.success) return titleResult;

  const status = input.status || "todo";
  if (!isTaskStatus(status)) {
    return { success: false, error: "Choose a valid task status." };
  }

  const context = await getAuthenticatedContext();
  if (!context.success) return { success: false, error: context.error };

  const { supabase, userId } = context;
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title: titleResult.title,
      description: input.description?.trim() || null,
      due_date: input.dueDate || null,
      status,
    })
    .select("id,user_id,title,description,due_date,status,created_at,updated_at")
    .single();

  if (taskError || !task) {
    return {
      success: false,
      error: taskError?.message || "The task could not be created.",
    };
  }

  if (input.reminderAt) {
    const { error: reminderError } = await supabase.from("reminders").insert({
      user_id: userId,
      task_id: task.id,
      remind_at: input.reminderAt,
    });

    if (reminderError) {
      await supabase.from("tasks").delete().eq("id", task.id).eq("user_id", userId);
      return {
        success: false,
        error: `The reminder could not be created: ${reminderError.message}`,
      };
    }
  }

  refreshTaskViews();
  return { success: true, task: task as Task };
}

export async function updateTaskAction(
  taskId: string,
  input: TaskMutationInput,
): Promise<TaskActionResult> {
  const titleResult = validateTaskTitle(input.title);
  if (!titleResult.success) return titleResult;

  const status = input.status || "todo";
  if (!isTaskStatus(status)) {
    return { success: false, error: "Choose a valid task status." };
  }

  const context = await getAuthenticatedContext();
  if (!context.success) return { success: false, error: context.error };

  const { supabase, userId } = context;
  const { data: task, error } = await supabase
    .from("tasks")
    .update({
      title: titleResult.title,
      description: input.description?.trim() || null,
      due_date: input.dueDate || null,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .eq("user_id", userId)
    .select("id,user_id,title,description,due_date,status,created_at,updated_at")
    .single();

  if (error || !task) {
    return {
      success: false,
      error: error?.message || "The task could not be updated.",
    };
  }

  refreshTaskViews();
  return { success: true, task: task as Task };
}

export async function updateTaskStatusAction(
  taskId: string,
  status: TaskStatus,
): Promise<TaskActionResult> {
  if (!isTaskStatus(status)) {
    return { success: false, error: "Choose a valid task status." };
  }

  const context = await getAuthenticatedContext();
  if (!context.success) return { success: false, error: context.error };

  const { supabase, userId } = context;
  const { data: task, error } = await supabase
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", taskId)
    .eq("user_id", userId)
    .select("id,user_id,title,description,due_date,status,created_at,updated_at")
    .single();

  if (error || !task) {
    return {
      success: false,
      error: error?.message || "The task status could not be updated.",
    };
  }

  refreshTaskViews();
  return { success: true, task: task as Task };
}

export async function deleteTaskAction(taskId: string): Promise<TaskActionResult> {
  const context = await getAuthenticatedContext();
  if (!context.success) return { success: false, error: context.error };

  const { supabase, userId } = context;
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  refreshTaskViews();
  return { success: true };
}
