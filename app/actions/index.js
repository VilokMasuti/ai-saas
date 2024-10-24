" use server"
// get products

  export const fetchAllProducts  = async () =>{ 
  try {

      const result =  await fetch ("https://dummyjson.com/products",{
        method:"GET",
        cache:"no-store"
      })
      const data = await result.json();
      return{
        success: true,
        data: data?.products,
      }
    
  } catch (error) {
    return {
      success: false,
      message: "Some error occured! Please try again",
    }
    
  }

 }


 export const fetchProductsDetails  = async (currentProductID) =>{
  try {
    const result = await fetch(
      `https://dummyjson.com/products/${currentProductID}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const data = await result.json();

    return data;
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Some error occured! Please try again",
    };
  }
 } 
