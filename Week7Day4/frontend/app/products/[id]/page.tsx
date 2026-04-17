"use client";
import React from 'react';
import { useParams } from 'next/navigation';
// Update path to @/src/services/apiService if that's your structure
import { useGetProductsQuery, useAddToCartMutation } from '@/src/components/services/apiService'; 
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  Stack 
} from '@mui/material'; 
// Use Grid2 for the 'size' prop to work correctly
import Grid from '@mui/material/Grid'; 
import Image from 'next/image';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

export default function ProductDetails() {
  const { id } = useParams();
  const { data: products, isLoading } = useGetProductsQuery();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const product = products?.find((p: any) => p.id === id);

const handleAddToCart = async () => {
  try {
    await addToCart(product).unwrap();
    // Remove or comment out this line:
    // setIsCartOpen(true); 
    
    alert("Added to bag!"); // Use a simple alert or toast instead
  } catch (err) {
    console.error(err);
  }
};

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress color="inherit" />
    </Box>
  );

  if (!product) return <Typography sx={{ mt: 10, textAlign: 'center' }}>Product not found.</Typography>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={8}>
          
          {/* LEFT: Image Section */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ 
              bgcolor: '#f6f6f6', 
              borderRadius: '40px', 
              height: '600px', 
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Image 
                src={product.picture?.url || ""} 
                alt={product.name} 
                fill 
                priority
                className="object-contain p-12 transition-transform duration-700 hover:scale-110" 
              />
            </Box>
          </Grid>

          {/* RIGHT: Info Section */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#ff4d4d', letterSpacing: 2 }}>
                  {product.discountPrice ? 'Special Offer' : 'New Arrival'}
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 1, mt: 1 }}>
                  {product.name}
                </Typography>
                <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                  ${product.discountPrice || product.price}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8 }}>
                {product.description || "Designed for ultimate comfort and performance."}
              </Typography>

              <Box sx={{ pt: 4 }}>
                <Button 
                  fullWidth
                  variant="contained" 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  sx={{ 
                    bgcolor: 'black', 
                    color: 'white', 
                    py: 2.5, 
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#333' }
                  }}
                >
                  {isAdding ? "Adding..." : "Add to Bag"}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
}