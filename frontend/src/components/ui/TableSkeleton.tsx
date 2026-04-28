type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export default function TableSkeleton({
  columns = 5,
  rows = 5,
}: TableSkeletonProps) {
  return (
    <div
      className="space-y-3 p-4"
      aria-label="Đang tải dữ liệu"
      role="status"
    >
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="h-4 animate-pulse rounded bg-slate-200" />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 rounded-md border border-slate-100 bg-white p-3"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <div
              key={columnIndex}
              className="h-5 animate-pulse rounded bg-slate-100"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
