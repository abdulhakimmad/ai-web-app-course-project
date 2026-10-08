type FeatureCardProps = {
  title: string;
  description: string;
};

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="ux-card">
      <h3>{title}</h3>
      <p className="ux-muted">{description}</p>
    </div>
  );
}
