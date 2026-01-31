/**
 * Storage data shape only. No database or Mongoose.
 */
export interface IStorage {
  id: string;
  name: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface IStorageCreate {
  name: string;
  path: string;
}

export interface IStorageUpdate {
  name?: string;
  path?: string;
}
