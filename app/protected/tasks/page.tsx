import { Suspense } from "react";

import { TaskManager } from "@/components/tasks/task-manager";
import { createClient } from "@/lib/supabase/server";
import { sortTasks, type Task } from "@/lib/tasks/task-utils";

async function TasksContent() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (typeof userId !== "string") {
    return <TaskManager initialTasks={[]} initialError="Your session has expired." />;
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("id,user_id,title,description,due_date,status,created_at,updated_at")
    .eq("user_id", userId);

  return (
    <TaskManager
      initialTasks={sortTasks((data || []) as Task[])}
      initialError={error ? `Tasks could not be loaded: ${error.message}` : null}
    />
  );
}

function TasksLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-32 rounded bg-[#e4e9e5]" />
      <div className="mt-4 h-10 w-48 rounded bg-[#e4e9e5]" />
      <div className="mt-8 flex gap-2">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-11 w-24 rounded-xl bg-[#e4e9e5]" />
        ))}
      </div>
      <div className="mt-6 h-44 rounded-2xl bg-white" />
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<TasksLoading />}>
      <TasksContent />
    </Suspense>
  );
}
