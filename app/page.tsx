
import ProductCard from "@/components/ProductCard";
import { fetchAllProducts } from "../app/actions/index";


  export default async function Home() {
 
  
    const getAllProducts = await fetchAllProducts();
  
    return (
      <div>
        <h1>Shopping Cart</h1>
        <div className="min-h-[80vh] grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-6xl mx-auto p-2">
          {getAllProducts && getAllProducts.data && getAllProducts.data.length > 0
            ? getAllProducts.data.map((productItem: any) => (
                // eslint-disable-next-line react/jsx-key
                <ProductCard item={productItem} />
              ))
            : null}
        </div>
      </div>
    );
  }
