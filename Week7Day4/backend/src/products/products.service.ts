import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { request, gql } from 'graphql-request';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private readonly hygraphUrl: string;
  private readonly authToken: string;

  constructor(private configService: ConfigService) {
    this.hygraphUrl = this.configService.get<string>('HYGRAPH_URL')!;
    this.authToken = this.configService.get<string>('HYGRAPH_TOKEN')!;
  }

  async findCategories() {
    this.logger.log('--- BACKEND: Fetching categories ---');
    const query = gql`
      query GetCategories {
        categories {
          id
          name
        }
      }
    `;
    try {
      const headers = { Authorization: `Bearer ${this.authToken}` };
      const data: any = await request(this.hygraphUrl, query, {}, headers);
      console.log('--- CATEGORY DATA CHECK ---');
      console.log(`Successfully fetched ${data.categories?.length || 0} categories.`);
      return data.categories;
    } catch (error: any) {
      this.logger.error('Failed to fetch categories');
      return [];
    }
  }

  async findAll() {
    this.logger.log('--- BACKEND: Fetching products from Hygraph ---');
    
    // Updated query to include discountPrice
    const query = gql`
      query GetProducts {
        products {
          id
          name
          price
          discountPrice
          discountPercent
          description
          slug
          picture {
            url
          }
          category
        }
      }
    `;

    try {
      const headers = { Authorization: `Bearer ${this.authToken}` };
      const data: any = await request(this.hygraphUrl, query, {}, headers);
      
      console.log('--- BACKEND DATA CHECK ---');
      if (data.products && data.products.length > 0) {
        console.log(`Successfully fetched ${data.products.length} products.`);
        // Enhanced log to check the new discountPrice field
        console.log('Sample Check:', {
          name: data.products[0].name,
          price: data.products[0].price,
          discountPrice: data.products[0].discountPrice || 'NONE',
          url: data.products[0].picture?.url || 'MISSING'
        });
      }

      return data.products;
    } catch (error: any) {
      this.logger.error('Failed to fetch products from Hygraph');
      console.error('Error details:', error.message);
      throw error;
    }
  }
}