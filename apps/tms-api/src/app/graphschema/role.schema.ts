import { Field, ObjectType, InputType, Int } from "type-graphql";

@ObjectType()
export class Role {
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
export class RoleInput {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => Int, { nullable: true })
  status!: number | null;
}
