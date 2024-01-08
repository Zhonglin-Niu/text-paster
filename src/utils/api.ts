import axios, { AxiosRequestConfig } from "axios";
import { IRecordGet, IRecordPost, ITagGet, ITagPost } from "./interfaces";

// const baseURL = localStorage.getItem("API_BASE_URL")! || "http://localhost:8000";
const baseURL = localStorage.getItem("API_BASE_URL") || "http://example.com";

export const serviceAxios = axios.create({
  baseURL,
  timeout: 2000,
  withCredentials: false,
});

// request interceptor
serviceAxios.interceptors.request.use();

// response interceptor
serviceAxios.interceptors.response.use(
  response => {
    response.data = response.data.data;
    return response;
  },
  error => {
    console.error("err: " + error.response?.data?.msg); // for debug
    return Promise.reject(error);
  }
);

const getXXX = async <T>(
  path: string,
  params: {
    [key: string]: string | number | null | undefined;
  }
): Promise<T[]> => {
  const config: AxiosRequestConfig = {
    params,
  };

  const rsp = await serviceAxios.get(path, config);
  return rsp.data;
};

export const getTags = async ({ offset = 0, limit = 100 } = {}) =>
  getXXX<ITagGet>("/tags/", { offset, limit });

export const postTag = async (tag: ITagPost): Promise<ITagGet> => {
  const rsp = await serviceAxios.post("/tags/", tag);
  return rsp.data;
};

export const updateTag = async (id: number, tag: ITagPost): Promise<ITagGet> => {
  const rsp = await serviceAxios.put(`/tags/${id}`, tag);
  return rsp.data;
};

export const deleteTag = async (id: number): Promise<void> => {
  await serviceAxios.delete(`/tags/${id}/`);
};

export const getRecords = async ({
  offset = 0,
  limit = 100,
  tag_id = null,
}: { offset?: number; limit?: number; tag_id?: number | null } = {}) =>
  getXXX<IRecordGet>("/records/", { offset, limit, tag_id });

export const postRecord = async (record: IRecordPost): Promise<IRecordGet> => {
  const rsp = await serviceAxios.post("/records/", record);
  return rsp.data;
};

export const updateRecord = async (id: number, record: IRecordPost): Promise<IRecordGet> => {
  const rsp = await serviceAxios.put(`/records/${id}`, record);
  return rsp.data;
};

export const deleteRecord = async (id: number): Promise<void> => {
  await serviceAxios.delete(`/records/${id}`);
};
