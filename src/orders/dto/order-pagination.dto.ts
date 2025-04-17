import { PaginationDto } from 'src/common';
import { OrderStatusList } from '../enum/order.enum';
import { OrderStatus } from 'generated/prisma';
import { IsEnum, IsOptional } from 'class-validator';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `Valid status are ${OrderStatusList.join(', ')}`,
  })
  status: OrderStatus;
}
