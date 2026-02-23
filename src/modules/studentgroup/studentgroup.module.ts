import { Module } from '@nestjs/common';
import { StudentGroupService } from './studentgroup.service';
import { StudentGroupController } from './studentgroup.controller';

@Module({
  controllers: [StudentGroupController],
  providers: [StudentGroupService],
  exports: [StudentGroupService],
})
export class StudentGroupModule {}
