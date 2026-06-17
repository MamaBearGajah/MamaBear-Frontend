import { apiClient} from "./client";
import axios from "axios";
import { BlogList, BlogListParams, BlogCreateListParams, BlogUpdateListParams, ApiResponse } from "@/types";


export async function getAllBlogs(
  // id: string,
  params: BlogListParams = {}
): Promise<BlogList[]> {
  const { data } = await apiClient.get(
    `/blog/admin/all`,
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
  payload: BlogUpdateListParams
): Promise<BlogUpdateListParams> {
  const { data } = await apiClient.patch<ApiResponse<BlogList>>(
    `/blog/${id}`,
    payload
  );
  return data.data;
}


export async function deleteBlog(
  id: string,
): Promise<void> {
  await apiClient.delete(`/blog/${id}`, {
  });
}
