import { AppError } from "../common/errors";
import { prisma } from "../lib/prisma";
import { Message, Notification } from "../types/domain";

export const mapPrismaMessageToMessage = (prismaMsg: any): Message => ({
  id: prismaMsg.id,
  senderId: prismaMsg.senderId,
  receiverId: prismaMsg.receiverId,
  applicationId: prismaMsg.applicationId || undefined,
  content: prismaMsg.content,
  isRead: prismaMsg.isRead,
  createdAt: prismaMsg.createdAt.toISOString(),
});

export const mapPrismaNotificationToNotification = (
  prismaNotif: any
): Notification => ({
  id: prismaNotif.id,
  userId: prismaNotif.userId,
  title: prismaNotif.title,
  body: prismaNotif.body,
  type: prismaNotif.type as any,
  isRead: prismaNotif.isRead,
  createdAt: prismaNotif.createdAt.toISOString(),
});

export const commsService = {
  async getConversations(userId: string) {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const map = new Map<string, any>();
    for (const msg of messages) {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!map.has(otherUser.id)) {
        map.set(otherUser.id, {
          id: otherUser.id,
          name: otherUser.name,
          role: otherUser.role,
          avatarUrl: undefined,
          lastMessage: {
            content: msg.content,
            createdAt: msg.createdAt.toISOString(),
            isRead: msg.isRead,
            isSender: msg.senderId === userId,
          },
          unreadCount: 0,
        });
      }
      if (msg.receiverId === userId && !msg.isRead) {
        map.get(otherUser.id).unreadCount++;
      }
    }
    return Array.from(map.values());
  },

  async getMessages(userId1: string, userId2: string): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
    return messages.map(mapPrismaMessageToMessage);
  },

  async getUnreadMessagesCount(userId: string): Promise<number> {
    return prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  },

  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
    applicationId?: string
  ): Promise<Message> {
    const msg = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        applicationId,
      },
    });

    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    if (sender) {
      await prisma.notification.create({
        data: {
          userId: receiverId,
          title: "New Message",
          body: "You have a new message from ",
          type: "message",
        },
      });
    }

    return mapPrismaMessageToMessage(msg);
  },

  async markAsRead(userId: string, otherUserId: string): Promise<void> {
    await prisma.message.updateMany({
      where: {
        receiverId: userId,
        senderId: otherUserId,
        isRead: false,
      },
      data: { isRead: true },
    });
  },

  async getNotifications(userId: string): Promise<Notification[]> {
    const notifs = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return notifs.map(mapPrismaNotificationToNotification);
  },

  async getUnreadNotificationsCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  },

  async markNotifAsRead(userId: string, notificationId: string): Promise<void> {
    const notif = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notif) {
      throw new AppError(404, "Notification not found", "NOT_FOUND");
    }
    if (notif.userId !== userId) {
      throw new AppError(403, "Not authorized", "FORBIDDEN");
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },

  async markAllNotifsAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
};
