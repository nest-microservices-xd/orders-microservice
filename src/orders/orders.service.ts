import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from 'generated/prisma/client';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatus } from './dto/change-order-status.dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to Prisma Client');
  }

  create(createOrderDto: CreateOrderDto) {
    return this.order.create({
      data: createOrderDto,
    });
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { page, limit } = orderPaginationDto;

    const totalCount = await this.order.count({
      where: {
        status: orderPaginationDto.status,
      },
    });

    const currentPage = page ?? 1;
    const perPage = limit ?? 10;

    return {
      data: await this.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
          status: orderPaginationDto.status,
        },
      }),
      meta: {
        total: totalCount,
        page: currentPage,
        lastPage: Math.ceil(totalCount / perPage),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: { id },
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });
    }

    return order;
  }

  async changeStatus(changeOrderStatus: ChangeOrderStatus) {
    const { id, status } = changeOrderStatus;

    const order = await this.findOne(id);

    if (order.status === status) return order;

    return this.order.update({
      where: { id },
      data: {
        status: status,
      },
    });
  }
}
