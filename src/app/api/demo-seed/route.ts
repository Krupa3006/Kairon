import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { buildDemoJobSeedsForUser } from "@/lib/demo-jobs";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function POST() {
  const user = await getCurrentUser();
  const supabase = getSupabaseServerClient();

  if (!user || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { count } = await supabase
    .from("job_queue")
    .select("id", { count: "exact", head: true });

  if ((count ?? 0) > 0) {
    return NextResponse.json({ seeded: false, reason: "Jobs already exist" });
  }

  const payload = buildDemoJobSeedsForUser(user.id);

  const { error } = await supabase.from("job_queue").insert(payload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ seeded: true });
}
