import { Query, Resolver, Mutation, Arg } from "type-graphql";
import { Storage, StorageInput } from "@graphschema/storage.schema";
import StorageService from "./storage.service";
import type { IStorage } from "@models/storage.schema";

const service = new StorageService();

function toStorage(s: IStorage): Storage {
  return {
    id: s.id,
    name: s.name,
    path: s.path,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

@Resolver(() => Storage)
export class StorageResolver {
  @Query(() => [Storage])
  async storages(): Promise<Storage[]> {
    const result = await service.list();
    if (!result.success || !result.data) return [];
    return result.data.map(toStorage);
  }

  @Query(() => Storage, { nullable: true })
  async storage(@Arg("id") id: string): Promise<Storage | null> {
    const result = await service.retrieve(id);
    if (!result.success || !result.data) return null;
    return toStorage(result.data);
  }

  @Mutation(() => Storage)
  async createStorage(@Arg("input") input: StorageInput): Promise<Storage> {
    const result = await service.create({ name: input.name, path: input.path });
    if (!result.success || !result.data) throw new Error(result.message ?? "Create failed");
    return toStorage(result.data);
  }

  @Mutation(() => Storage)
  async updateStorage(@Arg("id") id: string, @Arg("input") input: StorageInput): Promise<Storage> {
    const result = await service.update(id, { name: input.name, path: input.path });
    if (!result.success || !result.data) throw new Error(result.message ?? "Update failed");
    return toStorage(result.data);
  }

  @Mutation(() => Boolean)
  async deleteStorage(@Arg("id") id: string): Promise<boolean> {
    const result = await service.delete(id);
    return result.success;
  }
}
