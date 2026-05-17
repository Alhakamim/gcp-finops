import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './services/billing.service';
import { GcpBillingService } from './services/gcp-billing.service';
import { ForecastService } from './services/forecast.service';
import { PrismaModule } from '../../common/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BillingController],
  providers: [BillingService, GcpBillingService, ForecastService],
  exports: [BillingService, ForecastService],
})
export class BillingModule {}
