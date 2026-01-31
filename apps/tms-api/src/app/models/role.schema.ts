/**
 * Role data shape only. No database or Mongoose.
 */
export enum RoleStatus {
  Active = 1,
  Inactive = 0,
}

export interface IRole {
  id: string;
  name: string;
  description: string;
  status: RoleStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface IRoleCreate {
  name: string;
  description: string;
  status?: RoleStatus;
}

export interface IRoleUpdate {
  name?: string;
  description?: string;
  status?: RoleStatus;
}
