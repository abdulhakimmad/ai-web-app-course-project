type FeatureCardProps = {
    title: string;
    description: string;
};
export function FeatureCard({
    title,
    description
}: FeatureCardProps) {
    return (
        <section>
            <h2>{title}</h2>
            <p>{description}</p>
        </section>
    );
}