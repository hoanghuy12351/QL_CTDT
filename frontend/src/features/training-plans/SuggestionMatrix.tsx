import type { SuggestionMatrix as SuggestionMatrixType } from "./trainingPlan.types";

type SuggestionMatrixProps = {
  matrix: SuggestionMatrixType;
  selectedKeys: string[];
  onToggle: (key: string) => void;
};

export default function SuggestionMatrix({
  matrix,
  onToggle,
  selectedKeys,
}: SuggestionMatrixProps) {
  const cellMap = new Map(matrix.cells.map((cell) => [`${cell.classId}-${cell.courseId}`, cell]));
  const selectedSet = new Set(selectedKeys);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-auto">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              <th className="sticky left-0 z-10 w-56 border-b border-slate-200 bg-slate-50 px-3 py-3 font-semibold">
                Lớp
              </th>
              {matrix.courses.map((course) => (
                <th key={course.id} className="min-w-44 border-b border-slate-200 px-3 py-3 font-semibold">
                  <span className="block truncate">{course.name}</span>
                  <span className="mt-1 block text-xs font-medium normal-case text-slate-500">
                    {course.code || "-"} · {course.credits} TC
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matrix.classes.map((classItem) => (
              <tr key={classItem.id} className="bg-white hover:bg-slate-50">
                <td className="sticky left-0 bg-inherit px-3 py-3">
                  <span className="block truncate font-semibold text-slate-950">{classItem.name}</span>
                  <span className="mt-1 block truncate text-xs text-slate-500">{classItem.code || "-"}</span>
                </td>
                {matrix.courses.map((course) => {
                  const key = `${classItem.id}-${course.id}`;
                  const cell = cellMap.get(key);

                  return (
                    <td key={key} className="px-3 py-3">
                      {cell ? (
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50">
                          <input
                            type="checkbox"
                            className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200"
                            checked={selectedSet.has(key)}
                            onChange={() => onToggle(key)}
                          />
                          <span>Chọn</span>
                        </label>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {matrix.classes.length === 0 || matrix.courses.length === 0 ? (
              <tr>
                <td className="px-3 py-8 text-center text-sm text-slate-500" colSpan={Math.max(matrix.courses.length + 1, 2)}>
                  Chưa có học phần gợi ý cho các lớp đã chọn.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
