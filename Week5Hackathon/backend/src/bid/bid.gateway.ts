// backend/src/bid/bid.gateway.ts
import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})
export class BidGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  /**
   * 🔔 1. BID START (Global Notification)
   * Triggered when a new auction is created.
   */
  emitNewAuction(data: any) {
    this.server.emit('notification', {
      type: 'BID_START',
      title: 'New Auction Live!',
      message: `A ${data.make} ${data.model} is now open for bidding.`,
      auctionId: data._id,
      image: data.images?.[0],
    });
  }

  /**
   * 🔔 2. NEW BID (Global & Room Specific)
   * Triggered when someone places a higher bid.
   */


// Change this line to accept both arguments
// backend/src/bid/bid.gateway.ts

emitNewBid(auctionId: string, data: any) {
  const notificationTime = data.time ? new Date(data.time) : new Date();

  this.server.emit('notification', {
    ...data,
    auctionId: auctionId,
    displayTime: notificationTime.toLocaleString() 

    
  });
  this.server.emit('auction-updated', {
    _id: auctionId,
    highestBid: data.highestBid,
    highestBidderId: data.highestBidderId,
  });

}

  /**
   * 🔔 3 & 4. BID ENDED / WINNER (Global Notification)
   * Triggered by the Cron Job when time expires.
   */
 /**
   * 🔔 3 & 4. BID ENDED / WINNER
   */
  emitAuctionClosed(auctionId: string, auctionData: any) {
    const hasWinner = !!auctionData.highestBidderId;

    // 1. Emit the generic notification (Keep this for a Notification Bell/Toast)
    this.server.emit('notification', {
      type: hasWinner ? 'BID_WINNER' : 'BID_ENDED',
      title: hasWinner ? 'Auction Won!' : 'Auction Closed',
      message: hasWinner 
        ? `The ${auctionData.make} has been sold for $${auctionData.highestBid}!` 
        : `The auction for ${auctionData.make} has ended without a winner.`,
      auctionId: auctionId,
      winnerId: auctionData.highestBidderId,
    });

    // 2. FIX: Emit 'auction-closed' (What your frontend useEffect is listening for)
    this.server.emit('auction-closed', { auctionId });

    // 3. FIX: Emit 'won-auction' if there is a winner
    // Your frontend code expects: socket.on('won-auction', (data) => ...)
    if (hasWinner) {
      this.server.emit('won-auction', {
        auctionId: auctionId,
        winnerId: auctionData.highestBidderId,
      });
    }

    this.server.emit(`auction-${auctionId}`, { status: 'closed' });
  }
}