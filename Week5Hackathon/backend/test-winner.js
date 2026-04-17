const mongoose = require('mongoose');
const { io } = require('socket.io-client');

// Replace these with actual IDs from your MongoDB
const WINNER_USER_ID = '69d391e4f96e5587bb1ae40a'; // The ID of the user logged in on your browser
const AUCTION_ID = '69d3e0f60efd6dd3d9743629';    // The auction you are currently looking at

async function forceWinner() {
  try {
    await mongoose.connect('mongodb://localhost:27017/your-db-name');
    console.log('Connected to DB...');

    // 1. Create a "Winning Bid" for our test user
    // This ensures the logic finds a highest bid
    const testBid = {
      auctionId: new mongoose.Types.ObjectId(AUCTION_ID),
      bidderId: new mongoose.Types.ObjectId(WINNER_USER_ID),
      amount: 50000,
      createdAt: new Date()
    };
    
    // We insert directly into the bids collection
    await mongoose.connection.collection('bids').insertOne(testBid);
    console.log('Test bid inserted.');

    // 2. Force the Auction to "Closed" and set the winner
    const updatedAuction = await mongoose.connection.collection('auctions').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(AUCTION_ID) },
      { 
        $set: { 
          status: 'closed', 
          winnerId: new mongoose.Types.ObjectId(WINNER_USER_ID),
          highestBid: 50000,
          updatedAt: new Date()
        } 
      },
      { returnDocument: 'after' }
    );

    console.log('Auction marked as CLOSED in DB.');

    // 3. Manually trigger the Sockets
    // This mimics what your AuctionService.finalizeAuction does
    const socket = io('http://localhost:3000');
    
    socket.on('connect', () => {
      console.log('Socket connected, emitting win events...');
      
      // Notify the specific auction room
      socket.emit('auction-closed', {
        id: AUCTION_ID,
        auctionId: AUCTION_ID,
        winnerId: WINNER_USER_ID,
        finalPrice: 50000
      });

      // Notify the private winner room
      // Note: You might need to adjust your Gateway to allow this emit 
      // or just rely on the 'auction-closed' listener in AuctionDetails.tsx
      socket.emit('won-auction', {
        auctionId: AUCTION_ID,
        finalPrice: 50000,
        message: "TEST: You won!"
      });

      console.log('Events emitted. Check your browser!');
      setTimeout(() => process.exit(), 2000);
    });

  } catch (err) {
    console.error(err);
  }
}

forceWinner();