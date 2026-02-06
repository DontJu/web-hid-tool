interface DontCardProps {
  title: string;
  children: React.ReactNode;
}

export default function DontCard({ title, children }: DontCardProps) {
  return (
    <div className="flex flex-col rounded border-border border bg-card shadow-sm">
      <div className="flex pb-3 font-medium text-foreground border-border border-b px-3 py-2">
        <span>{title}</span>
      </div>
      <div className="bg-stone-50">
        <div className=" px-3 py-2">{children}</div>
      </div>
    </div>
  );
}
