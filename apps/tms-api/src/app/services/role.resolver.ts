import { Query, Resolver, Mutation, Arg } from "type-graphql";
import { Role, RoleInput } from "@graphschema/role.schema";
import RoleService from "./role.service";
import type { IRole } from "@models/role.schema";

const service = new RoleService();

function toRole(r: IRole): Role {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

@Resolver(() => Role)
export class RoleResolver {
  @Query(() => [Role])
  async roles(): Promise<Role[]> {
    const result = await service.list();
    if (!result.success || !result.data) return [];
    return result.data.map(toRole);
  }

  @Query(() => Role, { nullable: true })
  async role(@Arg("id") id: string): Promise<Role | null> {
    const result = await service.retrieve(id);
    if (!result.success || !result.data) return null;
    return toRole(result.data);
  }

  @Mutation(() => Role)
  async createRole(@Arg("input") input: RoleInput): Promise<Role> {
    const result = await service.create({
      name: input.name,
      description: input.description,
      status: input.status ?? 1,
    });
    if (!result.success || !result.data) throw new Error(result.message ?? "Create failed");
    return toRole(result.data);
  }

  @Mutation(() => Role)
  async updateRole(@Arg("id") id: string, @Arg("input") input: RoleInput): Promise<Role> {
    const result = await service.update(id, {
      name: input.name,
      description: input.description,
      status: input.status ?? undefined,
    });
    if (!result.success || !result.data) throw new Error(result.message ?? "Update failed");
    return toRole(result.data);
  }

  @Mutation(() => Boolean)
  async deleteRole(@Arg("id") id: string): Promise<boolean> {
    const result = await service.delete(id);
    return result.success;
  }
}
