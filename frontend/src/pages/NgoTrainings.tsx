import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, Filter, Clock, MapPin, Users, Heart } from "lucide-react";

export default function NgoTrainings() {
    const [searchQuery, setSearchQuery] = useState("");

    const trainings = [
        {
            id: 1,
            title: "Advanced Web Development Bootcamp",
            provider: "Global Tech Foundation",
            duration: "6 Months",
            mode: "Online",
            description: "Learn MERN stack from scratch with real-world projects and placement assistance.",
            students: 1200,
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600&h=400"
        },
        {
            id: 2,
            title: "Digital Marketing & SEO Mastery",
            provider: "Youth Empowerment NGO",
            duration: "3 Months",
            mode: "Offline",
            description: "Master social media marketing, SEO, and content creation. Hands-on training included.",
            students: 850,
            image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=600&h=400"
        },
        {
            id: 3,
            title: "Spoken English & Communication Skills",
            provider: "EduCare Initiative",
            duration: "2 Months",
            mode: "Online",
            description: "Enhance your professional communication skills to crack job interviews with confidence.",
            students: 2400,
            image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600&h=400"
        },
        {
            id: 4,
            title: "Financial Accounting & Tally PRIME",
            provider: "Career Build NGO",
            duration: "4 Months",
            mode: "Offline",
            description: "Become a professional accountant. Learn core financial concepts and Tally software in-depth.",
            students: 630,
            image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600&h=400"
        }
    ];

    const filteredTrainings = trainings.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl sm:text-3xl font-heading font-bold">
                    Training <span className="text-primary">Programs</span>
                </h1>
                <p className="text-muted-foreground mt-1">
                    Explore and enroll in skill-development courses provided by our NGO partners.
                </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search for courses or providers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>
                <button className="px-6 py-3 rounded-xl bg-muted text-foreground flex items-center justify-center gap-2 hover:bg-muted/80 transition-colors font-medium">
                    <Filter className="w-4 h-4" /> Filters
                </button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrainings.map((course, i) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        className="clean-card group flex flex-col overflow-hidden"
                    >
                        {/* Image Box */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 flex gap-2">
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold backdrop-blur-md ${course.mode === 'Online' ? 'bg-blue-500/80 text-white' : 'bg-orange-500/80 text-white'}`}>
                                    {course.mode}
                                </span>
                            </div>
                            <button className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-colors">
                                <Heart className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-2 text-primary text-xs font-semibold mb-2">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{course.provider}</span>
                            </div>

                            <h3 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {course.title}
                            </h3>

                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                {course.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" /> {course.duration}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4" /> {course.students}+ Enrolled
                                </div>
                            </div>

                            <div className="mt-auto">
                                <button className="w-full py-2.5 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                                    Enroll Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredTrainings.length === 0 && (
                <div className="text-center py-20 text-muted-foreground clean-card">
                    No courses found matching "{searchQuery}"
                </div>
            )}
        </div>
    );
}
