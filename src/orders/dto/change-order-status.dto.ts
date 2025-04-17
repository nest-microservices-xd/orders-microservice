import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatus } from 'generated/prisma';
import { OrderStatusList } from '../enum/order.enum';

export class ChangeOrderStatus {
  @IsUUID(4)
  id: string;

  @IsEnum(OrderStatusList, {
    message: `Possible status values are ${OrderStatusList.join(', ')}`,
  })
  status: OrderStatus;
}
