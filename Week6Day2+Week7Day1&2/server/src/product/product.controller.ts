import { 
  Controller, Get, Post, Body, Param, Put, Delete, 
  UseGuards, Query, Patch, NotFoundException 
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { UserRole } from '../schemas/user.schema';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Controller('products')
export class ProductsController {
  // FIXED: Injected NotificationsGateway so this.notificationsGateway is defined
  constructor(
    private readonly productsService: ProductsService,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  async updatePatch(@Param('id') id: string, @Body() updateData: any) {
    console.log(`Incoming PATCH update for ID: ${id}`);
    return this.productsService.update(id, updateData);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updatePut(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // --- NEW REVIEW LOGIC ---
  @Post(':id/reviews')
  async createReview(
    @Param('id') id: string,
    @Body() reviewDto: { userName: string, rating: number, comment: string },
  ) {
    const updatedProduct = await this.productsService.addReview(id, reviewDto);

    if (!updatedProduct) {
      throw new NotFoundException('Product not found for review');
    }

    // Trigger Real-time Broadcast
    // We send the latest review and the new average rating
    if (this.notificationsGateway.server) {
      this.notificationsGateway.server.emit('newReviewAdded', {
        productId: id,
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        newAverage: updatedProduct.averageRating,
        totalReviews: updatedProduct.numReviews,
      });
      console.log(`⭐ Real-time Review Sync for: ${updatedProduct.name}`);
    }

    return updatedProduct;
  }
}