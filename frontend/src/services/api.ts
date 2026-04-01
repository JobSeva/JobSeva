import api from "@/lib/api";

// ─── Profile Services ───
export const getSeekerProfile = async () => {
    const response = await api.get("/seeker/profile");
    return response.data;
};

export const updateSeekerProfile = async (data: any) => {
    const response = await api.put("/seeker/profile", data);
    return response.data;
};

export const addSeekerExperience = async (data: any) => {
    const response = await api.post("/seeker/profile/experience", data);
    return response.data;
};

export const updateSeekerExperience = async (id: string, data: any) => {
    const response = await api.put(`/seeker/profile/experience/${id}`, data);
    return response.data;
};

export const deleteSeekerExperience = async (id: string) => {
    const response = await api.delete(`/seeker/profile/experience/${id}`);
    return response.data;
};

export const addSeekerEducation = async (data: any) => {
    const response = await api.post("/seeker/profile/education", data);
    return response.data;
};

export const updateSeekerEducation = async (id: string, data: any) => {
    const response = await api.put(`/seeker/profile/education/${id}`, data);
    return response.data;
};

export const deleteSeekerEducation = async (id: string) => {
    const response = await api.delete(`/seeker/profile/education/${id}`);
    return response.data;
};

export const uploadSeekerAvatar = async (avatarUrl: string) => {
    const response = await api.post("/seeker/profile/avatar", { avatarUrl });
    return response.data;
};

export const uploadSeekerResume = async (resumeUrl: string) => {
    const response = await api.post("/seeker/profile/resume", { resumeUrl });
    return response.data;
};

export const deleteSeekerResume = async () => {
    const response = await api.delete("/seeker/profile/resume");
    return response.data;
};

export const getNgoProfile = async () => {
    const response = await api.get("/ngo/profile");
    return response.data;
};

export const updateNgoProfile = async (data: any) => {
    const response = await api.put("/ngo/profile", data);
    return response.data;
};

export const getAllJobs = async (params: any = {}) => {
    const response = await api.get("/jobs", { params });
    return response.data;
};

export const createJob = async (jobData: any) => {
    const response = await api.post("/company/jobs", jobData);
    return response.data;
};

export const getCompanyJobs = async () => {
    const response = await api.get("/company/jobs");
    return response.data;
};

export const getCompanyJobById = async (jobId: string) => {
    const response = await api.get(`/company/jobs/${jobId}`);
    return response.data;
};

export const updateCompanyJob = async (jobId: string, jobData: any) => {
    const response = await api.put(`/company/jobs/${jobId}`, jobData);
    return response.data;
};


export const applyJob = async (jobId: string) => {
    const response = await api.post("/applications", { jobId });
    return response.data;
};

export const getUserApplications = async () => {
    const response = await api.get("/applications");
    return response.data;
};

export const getRecommendations = async () => {
    const response = await api.get("/jobs/recommendations");
    return response.data;
};

export const getApplicants = async (jobId: string) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
};

export const getCompanyJobApplicants = async (jobId: string) => {
    const response = await api.get(`/company/jobs/${jobId}/applicants`);
    return response.data;
};


export const updateSettings = async (data: { emailNotifications?: boolean; marketingEmails?: boolean; darkMode?: boolean }) => {
    const response = await api.put("/user/settings", data);
    return response.data;
};

export const updatePassword = async (data: { currentPassword: string; nextPassword: string }) => {
    const response = await api.put("/user/change-password", data);
    return response.data;
};

export const uploadResume = async (file: File, onProgress?: (percentage: number) => void) => {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await api.post("/user/upload-resume", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentage);
            }
        },
    });
    return response.data;
};

// ─── Course Services ───
export const createCourse = async (data: { title: string; description: string; duration: string; mode: string; category: string; image?: string; location?: string; contactNumber?: string; rating?: number; status?: string }) => {
    const response = await api.post("/courses", data);
    return response.data;
};

export const getAllCourses = async () => {
    const response = await api.get("/courses");
    return response.data;
};

export const getNgoCourses = async (ngoId: string) => {
    const response = await api.get(`/courses/ngo/${ngoId}`);
    return response.data;
};

export const getCourseById = async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
};

export const updateCourse = async (id: string, data: any) => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
};

export const deleteCourse = async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
};

// ─── Enrollment Services ───
export const enrollCourse = async (courseId: string) => {
    const response = await api.post("/enrollments", { courseId });
    return response.data;
};

export const getUserEnrollments = async () => {
    const response = await api.get("/enrollments/mine");
    return response.data;
};

export const getCourseEnrollments = async (courseId: string) => {
    const response = await api.get(`/enrollments/course/${courseId}`);
    return response.data;
};

// ─── Auth Services ───
export const verifyEmail = async (token: string) => {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
};

export const resendVerification = async (email: string) => {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
};
