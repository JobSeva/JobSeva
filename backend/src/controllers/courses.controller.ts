import { Request, Response } from "express";
import { coursesService } from "../services/courses.service";
import { success } from "../common/http";
import { AuthenticatedRequest } from "../types/auth";

export const coursesController = {
    async create(req: AuthenticatedRequest, res: Response) {
        const { title, description, duration, mode, category, image, location, contactNumber, rating, status } = req.body;
        const ngoId = req.auth!.userId;
        const course = await coursesService.create({
            title,
            description,
            duration,
            mode,
            category,
            image,
            location,
            contactNumber,
            rating,
            status,
            ngoId,
        });
        console.log("Course saved:", course);
        res.status(201).json(success(course));
    },

    async listAll(_req: Request, res: Response) {
        const courses = await coursesService.listAll();
        res.json(success(courses));
    },

    async listByNgo(req: Request, res: Response) {
        const ngoId = req.params.ngoId!;
        const courses = await coursesService.listByNgo(ngoId);
        res.json(success(courses));
    },

    async getById(req: Request, res: Response) {
        const id = req.params.id!;
        const course = await coursesService.getById(id);
        if (!course) {
            res.status(404).json({ success: false, message: "Course not found" });
            return;
        }
        res.json(success(course));
    },

    async update(req: AuthenticatedRequest, res: Response) {
        const id = req.params.id!;
        const { title, description, duration, mode, category, image, location, contactNumber, rating, status } = req.body;
        const course = await coursesService.update(id, {
            title,
            description,
            duration,
            mode,
            category,
            image,
            location,
            contactNumber,
            rating,
            status,
        });
        res.json(success(course));
    },

    async remove(req: AuthenticatedRequest, res: Response) {
        const id = req.params.id!;
        await coursesService.delete(id);
        res.json(success({ deleted: true }));
    },
};
