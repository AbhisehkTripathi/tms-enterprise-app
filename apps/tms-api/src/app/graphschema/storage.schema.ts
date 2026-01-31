import { Field, ObjectType, InputType } from "type-graphql";

@ObjectType()
export class Storage {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  path!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class StorageInput {
  @Field()
  name!: string;

  @Field()
  path!: string;
}
