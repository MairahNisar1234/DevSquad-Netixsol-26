"use client";
import React, { useState } from 'react';
import { FiSearch, FiUser, FiShoppingBag, FiX, FiMenu } from 'react-icons/fi';
import { Drawer, Box, Typography, IconButton, Stack, Button } from '@mui/material';
import { useGetCartQuery, useRemoveFromCartMutation } from '@/src/components/services/apiService';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { data: rawData } = useGetCartQuery();
  const cartItems = rawData?.items || [];
  const serverTotal = rawData?.totalPrice || 0;

  const [removeItem] = useRemoveFromCartMutation();

  const handleDelete = async (productId: string) => {
    try {
      await removeItem(productId).unwrap();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  // Logic to handle navigation and close all drawers
  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
    setIsCartOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 md:py-5 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          <IconButton 
            className="lg:hidden" 
            onClick={() => setIsMenuOpen(true)} 
            sx={{ color: 'black', p: 1 }}
          >
            <FiMenu size={22} />
          </IconButton>
          
          <div className="hidden lg:flex gap-6 xl:gap-8 text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800">
            <Link href="/products" className="hover:text-black transition-colors whitespace-nowrap">Woman</Link>
            <Link href="/products" className="hover:text-black transition-colors whitespace-nowrap">Men</Link>
            <Link href="/products" className="relative pb-1 border-b-2 border-black whitespace-nowrap">All</Link>
          </div>
        </div>

        {/* LOGO: Returns to Home */}
        <Link href="/" className="flex items-center justify-center shrink-0">
          <div className="text-lg sm:text-xl md:text-2xl font-light tracking-tighter cursor-pointer flex gap-1">
            <span className="text-gray-400">YOUR</span>
            <span className="font-black text-black uppercase">SNEAKER</span>
          </div>
        </Link>

        <div className="flex items-center justify-end gap-3 sm:gap-4 md:gap-7 text-lg md:text-xl text-gray-700 flex-1">
          <button className="hidden md:block hover:text-black transition-all">
            <FiUser strokeWidth={1.5} />
          </button>
          <button className="hover:text-black transition-all">
            <FiSearch strokeWidth={1.5} />
          </button>
          <button onClick={() => setIsCartOpen(true)} className="relative hover:text-black transition-all pt-1">
            <FiShoppingBag strokeWidth={1.5} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-black text-white text-[8px] md:text-[9px] w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold">
                {cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <Drawer
        anchor="left"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        slotProps={{ 
          paper: { 
            sx: { 
              width: { xs: '100vw', sm: '350px' }, 
              p: { xs: 3, sm: 4 },
              transition: 'all 0.3s ease'
            } 
          } 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <IconButton onClick={() => setIsMenuOpen(false)}>
            <FiX size={28} />
          </IconButton>
          
          {/* LOGO INSIDE MOBILE DRAWER */}
          <Box 
            onClick={() => handleNavigation('/')} 
            sx={{ cursor: 'pointer', display: 'flex', gap: 0.5 }}
          >
            <Typography sx={{ fontSize: '1rem', fontWeight: 300, color: '#9ca3af', letterSpacing: '-0.05em' }}>
              YOUR
            </Typography>
            <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: 'black', letterSpacing: '-0.05em' }}>
              SNEAKER
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, cursor: 'pointer', '&:hover': { opacity: 0.6 } }}>
          <FiSearch size={20} strokeWidth={1.5} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Search
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5, cursor: 'pointer', '&:hover': { opacity: 0.6 } }}>
          <FiUser size={20} strokeWidth={1.5} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Login
          </Typography>
        </Box>

        <Stack spacing={2.5}>
          {[
            { name: 'ALL', path: '/products' },
            { name: 'WOMAN', path: '/products' },
            { name: 'MEN', path: '/products' },
            { name: 'WORKOUT', path: '/products?category=workout' },
            { name: 'RUN', path: '/products?category=run' },
            { name: 'FOOTBALL', path: '/products?category=football' }
          ].map((item, index) => (
            <Typography 
              key={item.name} 
              onClick={() => handleNavigation(item.path)}
              sx={{ 
                fontSize: { xs: '1.6rem', sm: '1.8rem' },
                fontWeight: 900, 
                cursor: 'pointer',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                borderBottom: index === 0 ? '2.5px solid black' : 'none',
                pb: index === 0 ? 0.5 : 0,
                display: 'inline-block',
                '&:hover': { color: 'gray' }
              }}
            >
              {item.name}
            </Typography>
          ))}
        </Stack>
      </Drawer>

      {/* CART DRAWER */}
      <Drawer
        anchor="right"
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        slotProps={{ 
          paper: { 
            sx: { 
              width: { xs: '100vw', sm: '400px', md: '450px' }, 
              p: { xs: 2, sm: 3 }, 
              display: 'flex', 
              flexDirection: 'column' 
            } 
          } 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.2rem', sm: '1.5rem' }, textTransform: 'uppercase' }}>Your Bag</Typography>
          <IconButton onClick={() => setIsCartOpen(false)}><FiX size={24} /></IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
          {cartItems.length === 0 ? (
            <Typography sx={{ textAlign: 'center', mt: 10, color: 'gray' }}>Your bag is empty.</Typography>
          ) : (
            <Stack spacing={2.5}>
              {cartItems.map((item: any) => (
                <Box key={item.productId} sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, borderBottom: '1px solid #eee', pb: 2 }}>
                  <Box sx={{ width: { xs: 80, sm: 90 }, height: { xs: 80, sm: 90 }, bgcolor: '#f6f6f6', borderRadius: 2, position: 'relative', flexShrink: 0 }}>
                    <Image 
                      src={item.image || '/placeholder-shoe.png'} 
                      alt={item.name} 
                      fill 
                      className="object-contain p-2" 
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: 0.5 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: { xs: '0.75rem', sm: '0.85rem' }, lineHeight: 1.2 }}>
                        {item.name}
                      </Typography>
                      <Typography sx={{ fontWeight: 500, color: 'gray', fontSize: '0.75rem' }}>
                        ${item.price} x {item.quantity}
                      </Typography>
                    </Box>
                    <button 
                      onClick={() => handleDelete(item.productId)}
                      className="text-[9px] sm:text-[10px] font-black uppercase tracking-tighter text-red-500 hover:text-red-700 transition-colors"
                    >
                      [ Remove Item ]
                    </button>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        <Box sx={{ pt: 3, borderTop: '2px solid black', mt: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontWeight: 600, color: 'gray', fontSize: '0.7rem' }}>SUBTOTAL</Typography>
            <Typography sx={{ fontWeight: 900 }}>${Number(serverTotal).toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography sx={{ fontWeight: 900, fontSize: '1.1rem' }}>TOTAL</Typography>
            <Typography sx={{ fontWeight: 900, fontSize: '1.1rem' }}>${Number(serverTotal).toFixed(2)}</Typography>
          </Box>
          <Button 
            fullWidth 
            disableElevation
            sx={{ 
              bgcolor: 'black', 
              color: 'white', 
              py: { xs: 1.5, sm: 2 }, 
              borderRadius: 0, 
              fontWeight: 900, 
              fontSize: '0.9rem',
              '&:hover': { bgcolor: '#333' } 
            }}
          >
            CHECKOUT
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;