import { v4 as uuid } from "uuid";
import Response from "@libs/response";
import type { IRole, IRoleCreate, IRoleUpdate } from "@models/role.schema";
import { RoleStatus } from "@models/role.schema";

const store: IRole[] = [];

export default class RoleService {
  async count(): Promise<Response<number>> {
    try {
      return new Response(true, 200, "Count operation successful", store.length);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<number>;
    }
  }

  async list(): Promise<Response<IRole[]>> {
    try {
      const list = store.filter((r) => r.deletedAt == null);
      return new Response(true, 200, "Read operation successful", list);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IRole[]>;
    }
  }

  async retrieve(id: string): Promise<Response<IRole | undefined>> {
    try {
      const record = store.find((r) => r.id === id && r.deletedAt == null);
      if (!record) return new Response(true, 200, "Record not available", undefined);
      return new Response(true, 200, "Read operation successful", record);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IRole | undefined>;
    }
  }

  async retrieveByRole(name: string): Promise<IRole | undefined> {
    return store.find((r) => r.name === name && r.deletedAt == null);
  }

  async create(data: IRoleCreate): Promise<Response<IRole>> {
    try {
      const now = new Date();
      const record: IRole = {
        id: uuid(),
        name: data.name,
        description: data.description,
        status: data.status ?? RoleStatus.Active,
        createdAt: now,
        updatedAt: now,
      };
      store.push(record);
      return new Response(true, 201, "Insert operation successful", record);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IRole>;
    }
  }

  async update(id: string, data: IRoleUpdate): Promise<Response<IRole>> {
    try {
      const idx = store.findIndex((r) => r.id === id);
      if (idx === -1) return new Response(true, 200, "Record not available", undefined as unknown as IRole);
      const existing = store[idx];
      const updated: IRole = {
        ...existing,
        ...(data.name != null && { name: data.name }),
        ...(data.description != null && { description: data.description }),
        ...(data.status != null && { status: data.status }),
        updatedAt: new Date(),
      };
      store[idx] = updated;
      return new Response(true, 200, "Update operation successful", updated);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IRole>;
    }
  }

  async delete(id: string): Promise<Response<IRole | undefined>> {
    try {
      const idx = store.findIndex((r) => r.id === id);
      if (idx === -1) return new Response(true, 200, "Record not available", undefined);
      const now = new Date();
      store[idx] = { ...store[idx], deletedAt: now, updatedAt: now };
      return new Response(true, 200, "Delete operation successful", store[idx]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IRole | undefined>;
    }
  }

  async datatable(data: { page?: number; limit?: number; search?: string; sort?: string }): Promise<Response<{
    records: IRole[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    filterCount: number;
  }>> {
    try {
      let filtered = store.filter((r) => r.deletedAt == null);
      if (data.search) {
        const s = String(data.search).toLowerCase();
        filtered = filtered.filter(
          (r) => r.name.toLowerCase().includes(s) || r.description.toLowerCase().includes(s)
        );
      }
      const [sortBy, order] = (data.sort ?? "createdAt:desc").split(":");
      filtered.sort((a, b) => {
        const aVal = (a as unknown as Record<string, unknown>)[sortBy];
        const bVal = (b as unknown as Record<string, unknown>)[sortBy];
        if (aVal instanceof Date && bVal instanceof Date)
          return order === "desc" ? bVal.getTime() - aVal.getTime() : aVal.getTime() - bVal.getTime();
        return String(aVal).localeCompare(String(bVal), undefined, { numeric: true }) * (order === "desc" ? -1 : 1);
      });
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
        records: IRole[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
        filterCount: number;
      }>;
    }
  }

  async searchRoles(query: string): Promise<Response<IRole[]>> {
    try {
      const q = String(query).toLowerCase();
      const list = store.filter(
        (r) => r.deletedAt == null && (r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
      );
      return new Response(true, 200, "Search operation successful", list);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      return new Response(false, 500, "Internal Server Error", undefined, undefined, message) as unknown as Response<IRole[]>;
    }
  }
}
