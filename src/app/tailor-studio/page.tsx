import DashboardLayout from "@/components/DashboardLayout";
import { tailorSuggestions } from "@/lib/data";

export default function TailorStudioPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="display-title text-4xl font-bold text-navy">Tailor Studio</h1>
          <p className="mt-2 text-sm text-gray-500">
            Review narrative changes, sharpen relevance, and keep every suggestion grounded.
          </p>
        </div>

        <div className="grid gap-5">
          {tailorSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="card">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                <div className="lg:w-1/4">
                  <p className="text-sm font-semibold text-brand">{suggestion.title}</p>
                  <p className="mt-2 text-sm leading-7 text-gray-500">{suggestion.reason}</p>
                </div>
                <div className="grid flex-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-surface p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                      Original
                    </p>
                    <p className="mt-3 text-sm leading-7 text-gray-500">
                      {suggestion.original}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-brand/10 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-brand">
                      Refined
                    </p>
                    <p className="mt-3 text-sm leading-7 text-navy">
                      {suggestion.revised}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
