import { Field, ObjectType, InputType, Int } from "type-graphql";

@ObjectType()
export class Category {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => Int)
  status!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class CategoryInput {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => Int, { nullable: true })
  status!: number | null;
}
