import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFilterDto {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    limit?: number = 6;

    @IsOptional()
    @IsString()
    searchQuery?: string;
    
    @IsDate()
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    createDate?: Date;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsString()
    Pays?: string;

}