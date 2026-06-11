import { apiClient} from "./client";
import axios from "axios";
import { BlogList, BlogListParams, BlogCreateListParams, ApiResponse } from "@/types";


export async function getAllBlogs(
  // id: string,
  params: BlogListParams = {}
): Promise<BlogList[]> {
  const { data } = await apiClient.get(
    `/blog`,
    {    
    params: params,    
    },
  );
  return data.data
}

export async function getBlogById(
  id: string,
): Promise<BlogList> {
  const { data } = await apiClient.get<ApiResponse<BlogList>>(
    `/blog/${id}`,
    {
    }
  );
  return data.data;
}


export async function createBlog(
  payload: BlogCreateListParams,
): Promise<BlogCreateListParams> {
  const { data } = await apiClient.post<ApiResponse<BlogList>>(
    "/blog",
    payload
  );
  return data.data;
}


export async function updateBlog(
  id: string,
  payload: BlogCreateListParams
): Promise<BlogCreateListParams> {
  const { data } = await apiClient.put<ApiResponse<BlogList>>(
    `/blog/${id}`,
    payload
  );
  return data.data;
}


export async function deleteProduct(
  id: string,
): Promise<void> {
  await apiClient.delete(`/blog/${id}`, {
  });
}
