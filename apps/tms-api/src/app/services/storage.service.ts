import { v4 as uuid } from "uuid";
import Response from "@libs/response";
import type { IStorage, IStorageCreate, IStorageUpdate } from "@models/storage.schema";

const store: IStorage[] = [];

export default class StorageService {
  async count(): Promise<Response<number>> {
    try {
      const count = store.filter((r) => r.deletedAt == null).length;
      return new Response(true, 200, "Count operation successful", count);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<number>;
    }
  }

  async list(): Promise<Response<IStorage[]>> {
    try {
      const list = store.filter((r) => r.deletedAt == null);
      return new Response(true, 200, "Read operation successful", list);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IStorage[]>;
    }
  }

  async retrieve(id: string): Promise<Response<IStorage | undefined>> {
    try {
      const record = store.find((r) => r.id === id && r.deletedAt == null);
      if (!record) return new Response(true, 200, "Record not available", undefined);
      return new Response(true, 200, "Read operation successful", record);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IStorage | undefined>;
    }
  }

  async create(data: IStorageCreate): Promise<Response<IStorage>> {
    try {
      const now = new Date();
      const record: IStorage = {
        id: uuid(),
        name: data.name,
        path: data.path,
        createdAt: now,
        updatedAt: now,
      };
      store.push(record);
      return new Response(true, 201, "Insert operation successful", record);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IStorage>;
    }
  }

  async update(id: string, data: IStorageUpdate): Promise<Response<IStorage>> {
    try {
      const idx = store.findIndex((r) => r.id === id);
      if (idx === -1) return new Response(true, 200, "Record not available", undefined as unknown as IStorage);
      const existing = store[idx];
      const updated: IStorage = {
        ...existing,
        ...(data.name != null && { name: data.name }),
        ...(data.path != null && { path: data.path }),
        updatedAt: new Date(),
      };
      store[idx] = updated;
      return new Response(true, 200, "Update operation successful", updated);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IStorage>;
    }
  }

  async delete(id: string): Promise<Response<IStorage | undefined>> {
    try {
      const idx = store.findIndex((r) => r.id === id);
      if (idx === -1) return new Response(true, 200, "Record not available", undefined);
      const now = new Date();
      store[idx] = { ...store[idx], deletedAt: now, updatedAt: now };
      return new Response(true, 200, "Delete operation successful", store[idx]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IStorage | undefined>;
    }
  }

  async datatable(data: { page?: number; limit?: number }): Promise<Response<{
    records: IStorage[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    filterCount: number;
  }>> {
    try {
      const filtered = store.filter((r) => r.deletedAt == null);
      const page = Math.max(1, Number(data.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(data.limit) || 10));
      const totalCount = filtered.length;
      const totalPages = Math.ceil(totalCount / limit) || 1;
      const skip = (page - 1) * limit;
      const records = filtered.slice(skip, skip + limit);
      const output = { records, totalCount, totalPages, currentPage: page, filterCount: records.length };
      return new Response(true, 200, "Read operation successful", output);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<{
        records: IStorage[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
        filterCount: number;
      }>;
    }
  }
}
