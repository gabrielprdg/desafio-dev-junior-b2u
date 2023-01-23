import { AddCarParams } from '../../../../domain/use-cases/car/add-car'
import { AddCarRepository } from '../../../../data/protocols/car/add-car-repository'
import { LoadCarsRepository } from '../../../../data/protocols/car/load-cars-repository'
import { TypeOrmCar } from '../entities/typeorm-car'
import { AppDataSource } from '../helper/app-data-source'
import { Mapper } from '../mappers/car-mapper'
import { CarModel } from '../../../../domain/models/car'
import { UpdateCarByIdRepository } from '../../../../data/protocols/car/update-car-by-id-repository'
import { DeleteCarByIdRepository } from '../../../../data/protocols/car/delete-by-id-repository'
import { UpdateCarRawData } from '../../../../domain/use-cases/car/update-car-by-id'

export class TypeOrmCarRepository implements AddCarRepository, LoadCarsRepository, UpdateCarByIdRepository, DeleteCarByIdRepository {
  async add (carData: AddCarParams): Promise<void> {
    const car = new TypeOrmCar()

    car.name = carData.name
    car.brand = carData.brand
    car.manufactureYear = carData.manufactureYear
    car.description = carData.description
    car.owner = carData.owner

    await AppDataSource.getInstance()
      .getRepository(TypeOrmCar)
      .save(car)
  }

  async loadAll (): Promise<CarModel[]> {
    const cars = await AppDataSource.getInstance()
    .getRepository(TypeOrmCar)
    .createQueryBuilder('car')
    .leftJoinAndSelect('car.owner', 'owner')
    .getMany()

    const domainCar = Mapper.toDomainEntities(cars)

    return domainCar
  }

  async updateById (id: string, data: UpdateCarRawData): Promise<void> {
    await AppDataSource.getInstance()
    .createQueryBuilder()
    .update(TypeOrmCar)
    .set(data)
    .where('id = :id', { id })
    .execute()
  }

  async deleteById (id: string): Promise<void> {
    await AppDataSource.getInstance()
    .createQueryBuilder()
    .delete()
    .from(TypeOrmCar)
    .where('id = :id', { id })
    .execute()
  }
}
