/**
 * Category data shape only. No database or Mongoose.
 */
export enum CategoryStatus {
  Active = 1,
  Inactive = 0,
}

export interface ICategory {
  id: string;
  name: string;
  description: string;
  status: CategoryStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICategoryCreate {
  name: string;
  description: string;
  status?: CategoryStatus;
}

export interface ICategoryUpdate {
  name?: string;
  description?: string;
  status?: CategoryStatus;
}
