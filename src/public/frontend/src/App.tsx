import { useMenu } from "@/features/menu/useMenu";

export default function App(){
  const { data: dishes, isLoading, error} = useMenu();

  // Three states every data page needs: loading, error, data
  if(isLoading) return <p>Indlæser menu...</p>
  if(error) return <p>Fejl: {error.message}</p>

  return (
    <main style={{padding: 24}}>
      <h1>Menukort</h1>
      <ul>
        {dishes?.map((dish) =>(
          // Key helps React track list items, use the database id
          <li key={dish.id}>
            {dish.name} - {dish.price} kr. - {dish.ingredients}
          </li>
        ))}
      </ul>
    </main>
  );
}