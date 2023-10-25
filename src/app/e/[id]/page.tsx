export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  return (
    <div>
      <img src={`/badge/${id}`} alt="status badge" />
    </div>
  );
}
