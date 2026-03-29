// backend/src/controllers/communications.controller.ts
import { Response } from "express";
import { commsService } from "../services/communications.service";
import { AuthenticatedRequest } from "../types/auth";
import { success } from "../common/http";

export class CommunicationsController {
  // Messages
  async getMessages(req: AuthenticatedRequest, res: Response) {
    const userId = req.auth!.userId;
    const { otherUserId } = req.query as { otherUserId?: string };

    if (otherUserId) {
        const msgs = await commsService.getMessages(userId, otherUserId);
        res.json(success(msgs));
    } else {
        const convos = await commsService.getConversations(userId);
        res.json(success(convos));
    }
  }

  async getUnreadMessagesCount(req: AuthenticatedRequest, res: Response) {
    const userId = req.auth!.userId;
    const count = await commsService.getUnreadMessagesCount(userId);
    res.json(success({ unreadCount: count }));
  }

  async sendMessage(req: AuthenticatedRequest, res: Response) {
    const userId = req.auth!.userId;
    const { receiverId, content, applicationId } = req.body;

    if (!receiverId || !content) {
      throw new Error("Missing required fields: receiverId, content");
    }

    const newMsg = await commsService.sendMessage(
      userId,
      receiverId,
      content,
      applicationId,
    );
    res.status(201).json(success(newMsg));
  }

  async markMessageRead(req: AuthenticatedRequest, res: Response) {
    const userId = req.auth!.userId;
    const { messageId } = req.params as { messageId: string };
    try {
      const msg = await commsService.markAsRead(userId, messageId);
      res.json(success(msg));
    } catch (err: any) {
      if (err.message === "Message not found")
        return res.status(404).json({ error: err.message });
      if (err.message === "Not authorized")
        return res.status(403).json({ error: err.message });
      throw err;
    }
  }

  // Notifications
  async getNotifications(req: AuthenticatedRequest, res: Response) {
    const userId = req.auth!.userId;
    const notifs = await commsService.getNotifications(userId);
    res.json(success(notifs));
  }

  async getUnreadNotificationsCount(req: AuthenticatedRequest, res: Response) {
    const userId = req.auth!.userId;
    const count = await commsService.getUnreadNotificationsCount(userId);
    res.json(success({ unreadCount: count }));
  }

  async markNotificationRead(req: AuthenticatedRequest, res: Response) {
    const userId = req.auth!.userId;
    const { notificationId } = req.params as { notificationId: string };
    try {
      const notif = await commsService.markNotifAsRead(
        userId,
        notificationId,
      );
      res.json(success(notif));
    } catch (err: any) {
      if (err.message === "Notification not found")
        return res.status(404).json({ error: err.message });
      if (err.message === "Not authorized")
        return res.status(403).json({ error: err.message });
      throw err;
    }
  }

  async markAllNotificationsRead(req: AuthenticatedRequest, res: Response) {
    const userId = req.auth!.userId;
    const result = await commsService.markAllNotifsAsRead(userId);
    res.json(success(result));
  }
}

export const commsController = new CommunicationsController();
