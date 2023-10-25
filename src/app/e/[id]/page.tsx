export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  return (
    <div>
      <img
        src={`/badge/${id}`}
        alt="status badge"
        style={{
          width: "100px",
          height: "25px",
        }}
      />
    </div>
  );
}
