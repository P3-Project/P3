import { useTables } from "@/features/tables/useTables";

export default function App(){
  const { data: tables, isLoading, error} = useTables();

  // Three states every data page needs: loading, error, data
  if(isLoading) return <p>Indlæser borde...</p>
  if(error) return <p>Fejl: {error.message}</p>

  return (
    <main style={{padding: 24}}>
      <h1>Bordoversigt</h1>
      {/*Simple grid: one box per table*/}
      <div className="" style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, 120px)", gap: 12}}>
        {tables?.map((table) => (
          <div key={table.tableNumber} style={{border: "1px solid #ccc", borderRadius: 8, padding: 12, textAlign: "center"}}> {/* table_number is unique, so it's a good key*/}
            <strong>Bord {table.tableNumber}</strong>
            <p>{table.seats} pladser</p>
          </div>
        ))}
      </div>
    </main>
  );
}