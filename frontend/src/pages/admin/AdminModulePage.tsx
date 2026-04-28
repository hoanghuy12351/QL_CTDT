import AdminDataTable from "../../components/admin/AdminDataTable";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TableSkeleton from "../../components/ui/TableSkeleton";

type ModuleAction = {
  label: string;
  helper: string;
};

type ModulePageProps = {
  title: string;
  description: string;
  primaryAction: string;
  actions: ModuleAction[];
};

const sampleRows = [
  {
    id: "row-1",
    name: "Dữ liệu mẫu cho màn hình quản lý",
    owner: "Giáo vụ khoa",
    status: "draft" as const,
    updatedAt: "Chưa kết nối API",
  },
];

export default function AdminModulePage({
  actions,
  description,
  primaryAction,
  title,
}: ModulePageProps) {
  return (
    <section>
      <PageHeader
        title={title}
        description={description}
        action={<Button>{primaryAction}</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {actions.map((action) => (
          <Card key={action.label} className="p-5">
            <h2 className="font-semibold text-slate-950">{action.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {action.helper}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Danh sách</h2>
            <p className="mt-1 text-sm text-slate-500">
              Khung bảng đã sẵn sàng để gắn React Query và API thật.
            </p>
          </div>
          <Button variant="secondary">Lọc dữ liệu</Button>
        </div>
        <AdminDataTable rows={sampleRows} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-semibold text-slate-950">Skeleton loading</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Khi kết nối API, dùng skeleton để tránh màn hình trắng và giảm layout shift.
          </p>
          <div className="mt-4 rounded-lg border border-slate-100">
            <TableSkeleton rows={3} />
          </div>
        </Card>
        <EmptyState
          icon="DS"
          title="Chưa có dữ liệu"
          description="Trạng thái rỗng được thiết kế sẵn để hiển thị khi module chưa có bản ghi hoặc khi bộ lọc không có kết quả."
          actionLabel="Thêm mới"
          onAction={() => undefined}
        />
      </div>
    </section>
  );
}
