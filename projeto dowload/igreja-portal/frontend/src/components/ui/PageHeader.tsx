interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-line bg-white">
      <div className="container-page py-12 sm:py-16">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-medium leading-tight max-w-2xl">{title}</h1>
        {description && <p className="mt-4 text-muted max-w-prose">{description}</p>}
      </div>
    </div>
  );
}
