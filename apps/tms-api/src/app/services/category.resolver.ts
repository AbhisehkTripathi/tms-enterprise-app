import { Query, Resolver, Mutation, Arg } from "type-graphql";
import { Category, CategoryInput } from "@graphschema/category.schema";
import CategoryService from "./category.service";
import type { ICategory } from "@models/category.schema";

const service = new CategoryService();

function toCategory(c: ICategory): Category {
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    status: c.status,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    const result = await service.list();
    if (!result.success || !result.data) return [];
    return result.data.map(toCategory);
  }

  @Query(() => Category, { nullable: true })
  async category(@Arg("id") id: string): Promise<Category | null> {
    const result = await service.retrieve(id);
    if (!result.success || !result.data) return null;
    return toCategory(result.data);
  }

  @Mutation(() => Category)
  async createCategory(@Arg("input") input: CategoryInput): Promise<Category> {
    const result = await service.create({
      name: input.name,
      description: input.description,
      status: input.status ?? 1,
    });
    if (!result.success || !result.data) throw new Error(result.message ?? "Create failed");
    return toCategory(result.data);
  }

  @Mutation(() => Category)
  async updateCategory(@Arg("id") id: string, @Arg("input") input: CategoryInput): Promise<Category> {
    const result = await service.update(id, {
      name: input.name,
      description: input.description,
      status: input.status ?? undefined,
    });
    if (!result.success || !result.data) throw new Error(result.message ?? "Update failed");
    return toCategory(result.data);
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg("id") id: string): Promise<boolean> {
    const result = await service.delete(id);
    return result.success;
  }
}
