import { Module } from "@nestjs/common";
import { RoleSeedService } from "./role-seed.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "src/user-management/entities/role.entity";

@Module({
    imports: [
      TypeOrmModule.forFeature([Role])
    ],
    providers: [RoleSeedService],
    exports: [RoleSeedService],
})
export class RoleSeedModule {}
