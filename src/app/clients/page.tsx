import { PageHeader } from "@/components/layout/PageHeader";
import { ClientTree } from "@/features/hierarchy/components/ClientTree";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Hierarchy"
        title="Clients & tasks"
        description="Expand a client to load projects and tasks on demand."
      />
      <ClientTree />
    </div>
  );
}
