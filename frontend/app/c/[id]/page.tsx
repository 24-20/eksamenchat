

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const { id } = params;

  return (
    <>
      <h1 className=" w-fit bg-red-200">Captured ID: {id}</h1>
    </>
  );
}
