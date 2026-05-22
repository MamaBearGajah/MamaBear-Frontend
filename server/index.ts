import axios from "axios";

const baseUrl = 'https://api.escuelajs.co/api/v1'

export async function getProductSlug(slug:string){
    if(!slug){
        return null;
    }
    try{
        const fetchedProduct = await axios.get(`${baseUrl}/products/slug/${slug}`)
        return fetchedProduct.data;
    }catch (error)
    {
        console.error("Error Fetching Product Slug",error);
    }
}

export async function getProductId(id:number){
    if(isNaN(id)){
        return null
    }
    try{
        const fetchedProduct = await axios.get(`${baseUrl}/products/${id}`)
        return fetchedProduct.data;
    }catch(error){
        console.error("Error Fetching Product Id", error)
    }

    
}