import DashboardLayout from "@/components/DashboardLayout";
import { getAppData } from "@/lib/data";
import { formatRelative } from "@/lib/utils";

export default async function InboxPage() {
  const { inboxThreads } = await getAppData();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="display-title text-4xl font-bold text-navy">Inbox</h1>
          <p className="mt-2 text-sm text-gray-500">
            Replies, interview signals, and feedback requests connected to the active pipeline.
          </p>
        </div>

        {inboxThreads.length === 0 ? (
          <div className="card">
            <p className="text-sm text-gray-500">
              No inbox threads yet. As your pipeline starts moving, this page can later be connected to Gmail for real replies.
            </p>
          </div>
        ) : null}

        <div className="space-y-4">
          {inboxThreads.map((thread) => (
            <div key={thread.id} className="card">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-brand">
                    {thread.company} · {thread.role}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-navy">{thread.subject}</h2>
                  <p className="mt-3 text-sm leading-7 text-gray-500">{thread.preview}</p>
                </div>
                <div className="text-right">
                  <span className="badge badge-blue">{thread.state}</span>
                  <p className="mt-3 text-xs text-gray-400">{formatRelative(thread.received_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
