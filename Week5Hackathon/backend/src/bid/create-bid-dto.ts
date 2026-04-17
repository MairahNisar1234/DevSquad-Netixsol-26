import { IsNumber, IsPositive, IsMongoId } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsMongoId()
  auctionId!: string;
}