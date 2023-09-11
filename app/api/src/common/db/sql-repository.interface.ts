export interface IResDto {
  success: boolean;
}

export type updateObject = {
  id: string | number;
  [key: string]: any;
};
export interface RepositoryPort<Entity> {
  insert(entity: Entity): Promise<IResDto>;
  updateOne(option: updateObject): Promise<IResDto>;
  findOneById(id: string): Promise<Entity>;
  findAll(): Promise<Entity[]>;
  delete(id: string): Promise<boolean>;
  transaction<T>(handler: () => Promise<T>): Promise<T>;
}
