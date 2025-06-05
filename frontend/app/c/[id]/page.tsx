

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const { id } = params;

  return (
    <div>
      <h1>Captured ID: {id}</h1>
    </div>
  );
}
