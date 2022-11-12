import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { Good } from './entities/good.entity';

@Injectable()
export class GoodsService {
  constructor(private dataSource: DataSource) {}

  async create(createGoodDto: CreateGoodDto): Promise<InsertResult> {
    const { good_name, price } = createGoodDto;

    return await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Good)
      .values({ good_name: good_name, price: price })
      .execute();
  }

  async findAll(): Promise<Good[]> {
    return await this.dataSource
      .getRepository(Good)
      .createQueryBuilder('Good')
      .getMany();
  }

  async findOne(good_idx: number): Promise<Good> {
    return await this.dataSource
      .getRepository(Good)
      .createQueryBuilder('Good')
      .where('Good.good_idx = :good_idx', { good_idx: good_idx })
      .getOne();
  }

  async update(
    good_idx: number,
    updateGoodDto: UpdateGoodDto,
  ): Promise<UpdateResult> {
    const { good_name, price } = updateGoodDto;
    return await this.dataSource
      .createQueryBuilder()
      .update(Good)
      .set({ good_name: good_name, price: price })
      .where('good_idx = :good_idx', { good_idx: good_idx })
      .execute();
  }

  async remove(good_idx: number): Promise<DeleteResult> {
    return await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(Good)
      .where('good_idx = :good_idx', { good_idx: good_idx })
      .execute();
  }
}
