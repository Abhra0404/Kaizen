interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-dark-primary mb-2">{title}</h1>
      <p className="text-gray-600 dark:text-dark-muted text-lg">{subtitle}</p>
    </div>
  );
}
