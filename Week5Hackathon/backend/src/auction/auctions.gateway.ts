import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
})
export class AuctionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(AuctionGateway.name);

  handleConnection(client: Socket) {
    const userId = Array.isArray(client.handshake.query.userId) 
      ? client.handshake.query.userId[0] 
      : client.handshake.query.userId;

    if (userId) {
      const roomName = String(userId);
      client.join(roomName); 
      this.logger.log(`✅ User ${userId} connected and joined private room.`);
    } else {
      this.logger.log(`⚠️ Client connected without userId: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`❌ Client disconnected: ${client.id}`);
  }

  /** Sends bid updates to everyone watching a specific auction */
  sendNewBid(auctionId: string, data: any) {
    const aid = String(auctionId);
    this.server.emit(`auction-${aid}`, { ...data, auctionId: aid });
    this.server.emit('auction-list-update', { ...data, auctionId: aid });
  }

  /** Sends notification about a new auction */
  sendNewAuctionNotification(data: any) {
    this.server.emit('new-auction-added', data);

    this.server.emit('notification', {
      title: 'New Auction Alert!',
      message: `A new ${data.make} ${data.model} has just been posted.`,
      auctionId: String(data._id),
      image: data.images?.[0],
      type: 'NEW_AUCTION',
    });
  }

  /** Sends auction result notifications when an auction ends */
  sendAuctionResultNotification(auction: any, winner: any, seller: any, finalPrice: number) {
    const auctionId = String(auction._id);

    // 1. Notify everyone that auction ended
    this.server.emit('auction-closed', {
      auctionId: auctionId,
      winnerName: winner?.name || null,
      winnerId: winner?._id ? String(winner._id) : null,
      sellerName: seller?.name || null,
      finalPrice,
    });

    // 2. Notify the winner personally (matches frontend: socket.on('won-auction'))
    if (winner?._id) {
      const winnerRoom = String(winner._id);
      this.server.to(winnerRoom).emit('won-auction', {
        auctionId: auctionId,
        finalPrice,
        message: `🎉 Congratulations ${winner.name}! You won the auction for ${auction.make} ${auction.model}.`,
      });
      
      // Also send a general notification for the bell/toast
      this.server.to(winnerRoom).emit('notification', {
        title: 'Auction Won! 🎉',
        message: `You won the ${auction.make} ${auction.model}!`,
        type: 'WINNER',
        auctionId: auctionId
      });
    }

    // 3. Notify the seller personally
    if (seller?._id) {
      const sellerRoom = String(seller._id);
      this.server.to(sellerRoom).emit('auction-sold', {
        auctionId: auctionId,
        finalPrice,
        message: `✅ Your auction for ${auction.make} ${auction.model} has ended.`,
      });
    }
  }
}