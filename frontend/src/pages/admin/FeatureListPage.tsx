import AdminFeatureStatusBadge from "../../components/admin/feature-name/AdminFeatureStatusBadge";
import { formatDate } from "../../lib/format";
import type { AdminFeature } from "../../features/admin/feature-name/adminFeature.types";

const sampleFeatures: AdminFeature[] = [
  {
    id: "feature-1",
    name: "Feature name",
    description: "Admin feature module",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function FeatureListPage() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Features</h2>
        <p className="mt-1 text-sm text-slate-600">Manage admin features.</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {sampleFeatures.map((feature) => (
              <tr key={feature.id} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium">{feature.name}</td>
                <td className="px-4 py-3">
                  <AdminFeatureStatusBadge status={feature.status} />
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {formatDate(feature.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

