import { Field, ObjectType, InputType, Float, Int } from "type-graphql";
import { Length, IsOptional, IsNumber, Min } from "class-validator";

@ObjectType()
export class Shipment {
  @Field()
  id!: string;

  @Field()
  shipperName!: string;

  @Field()
  carrierName!: string;

  @Field()
  pickupLocation!: string;

  @Field()
  deliveryLocation!: string;

  @Field({ nullable: true })
  trackingNumber!: string | null;

  @Field()
  status!: string;

  @Field()
  rate!: string;

  @Field(() => String, { nullable: true })
  trackingData!: Record<string, unknown> | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class ShipmentInput {
  @Field()
  @Length(1, 255)
  shipperName!: string;

  @Field()
  @Length(1, 255)
  carrierName!: string;

  @Field()
  @Length(1, 500)
  pickupLocation!: string;

  @Field()
  @Length(1, 500)
  deliveryLocation!: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(0, 100)
  trackingNumber!: string | null;

  @Field({ nullable: true })
  @IsOptional()
  status!: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rate!: number | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  trackingData!: Record<string, unknown> | null;
}

@ObjectType()
export class ShipmentPage {
  @Field(() => [Shipment])
  items!: Shipment[];

  @Field(() => Int)
  totalCount!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  pageSize!: number;

  @Field(() => Int)
  totalPages!: number;
}
