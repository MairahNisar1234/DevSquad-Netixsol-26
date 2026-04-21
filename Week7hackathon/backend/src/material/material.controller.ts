import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { MaterialService } from './material.service';

@Controller('materials')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.materialService.create(createDto);
  }

  @Get()
  findAll() {
    return this.materialService.findAll();
  }

  @Patch(':id/add-stock')
  updateStock(@Param('id') id: string, @Body('amount') amount: number) {
    return this.materialService.addStock(id, amount);
  }
  @Patch(':id/restock')
async restock(
  @Param('id') id: string, 
  @Body('amount') amount: number
) {
  console.log('Controller received restock request for:', id);
  return this.materialService.addStock(id, amount);
}
}