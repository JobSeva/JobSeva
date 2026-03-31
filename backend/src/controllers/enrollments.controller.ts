import { Request, Response } from "express";
import { enrollmentsService } from "../services/enrollments.service";
import { success } from "../common/http";
import { AuthenticatedRequest } from "../types/auth";

export const enrollmentsController = {
    async enroll(req: AuthenticatedRequest, res: Response) {
        const userId = req.auth!.userId;
        const { courseId } = req.body;
        const result = await enrollmentsService.enroll(userId, courseId);
        if (result.duplicate) {
            res.status(409).json({ success: false, message: "Already enrolled" });
            return;
        }
        res.status(201).json(success(result.enrollment));
    },

    async getUserEnrollments(req: AuthenticatedRequest, res: Response) {
        const userId = req.auth!.userId;
        const enrollments = await enrollmentsService.getUserEnrollments(userId);
        res.json(success(enrollments));
    },

    async getCourseEnrollments(req: Request, res: Response) {
        const courseId = req.params.courseId!;
        const enrollments = await enrollmentsService.getCourseEnrollments(courseId);
        res.json(success(enrollments));
    },
};
