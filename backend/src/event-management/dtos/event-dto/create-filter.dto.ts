import {Timezone} from "../../../shared/types/timezone";
import {timeZonesNames} from "@vvo/tzdb";
import {IsArray, IsBoolean, IsDate, IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString} from 'class-validator';
import { Transform } from 'class-transformer';
import { PricingType } from "src/shared/enum/PricingType.enum";
export class CreateFilterDto {


    @IsOptional()
    @IsString()
    searchQuery?: string = null;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    limit?: number = 6;

    @IsOptional()
    @Transform(({ value }) => value.split(','))
    @IsArray() @IsString({ each: true }) 
    topics?: string[] = null;

    @IsOptional()
    @Transform(({ value }) => value.split(','))
    @IsArray() @IsString({ each: true }) 
    languages?: string[] = null;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    startDate : Date = null;
    
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    endDate : Date = null;

    @IsIn(timeZonesNames, { message: 'Invalid timezone' })
    @IsOptional()
    @IsString()
    timezone ?: Timezone = null;
    
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => Number(value))
    registrations : number = null;
    
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => Number(value))
    meetings : number = null;
    
    @IsOptional()
    @IsString() 
    state : string = null; 
    
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
        if (value == PricingType.PAID) {
            return true;
        } else if (value == PricingType.FREE) {
            return false;
        } else {
            return null;
        }
})
    paid : boolean = null;
    
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => Number(value))
    price : number = null;

    @IsOptional()
    @Transform(({ value }) => value.split(','))
    @IsArray() @IsString({ each: true }) 
    type?: string[] = null;

    @IsOptional()
    @Transform(({ value }) => value.split(','))
    @IsArray() @IsString({ each: true }) 
    countries?: string[] = null;

}