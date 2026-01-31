import { Field, ObjectType, InputType, Float, Int } from "type-graphql";
import { Length, IsOptional, IsNumber, Min } from "class-validator";

@ObjectType()
export class Shipment {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  shipperName!: string;

  @Field(() => String)
  carrierName!: string;

  @Field(() => String)
  pickupLocation!: string;

  @Field(() => String)
  deliveryLocation!: string;

  @Field(() => String, { nullable: true })
  trackingNumber!: string | null;

  @Field(() => String)
  status!: string;

  @Field(() => String)
  rate!: string;

  @Field(() => String, { nullable: true })
  trackingData!: Record<string, unknown> | null;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@InputType()
export class ShipmentInput {
  @Field(() => String)
  @Length(1, 255)
  shipperName!: string;

  @Field(() => String)
  @Length(1, 255)
  carrierName!: string;

  @Field(() => String)
  @Length(1, 500)
  pickupLocation!: string;

  @Field(() => String)
  @Length(1, 500)
  deliveryLocation!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(0, 100)
  trackingNumber!: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  status!: string | null;

  @Field(() => Float, { nullable: true })
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
