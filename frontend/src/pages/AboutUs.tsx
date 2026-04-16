import React from "react";
import { motion } from "framer-motion";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { Target, Eye, Settings, CheckCircle2 } from "lucide-react";

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-background pt-20">
            <PublicNavbar />

            {/* Dark Modern Hero */}
            <section className="relative py-24 px-4 overflow-hidden bg-[#0A0118]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent blur-3xl opacity-50" />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 text-primary text-xs font-bold uppercase tracking-widest">
                        About JobSeva
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-extrabold text-white leading-tight">
                        Bridging the Gap between <br /><span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Talent and Opportunity</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground mt-6 text-lg font-medium leading-relaxed">
                        JobSeva is a modern job hiring platform designed to connect job seekers, companies, and NGOs through a seamless and intelligent ecosystem. Our platform leverages smart matching and structured data to help individuals find the right opportunities and organizations find the right talent.
                    </motion.p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="clean-card p-10 bg-card border border-border/50 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary group-hover:w-2 transition-all" />
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                            <Target className="w-7 h-7" />
                        </div>
                        <h2 className="text-3xl font-heading font-bold mb-4 text-foreground">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Our mission is to simplify the hiring process and make job opportunities accessible to everyone, especially freshers and underserved communities, by integrating skill-based training and employment.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="clean-card p-10 bg-card border border-border/50 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-secondary group-hover:w-2 transition-all" />
                        <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary text-orange-500 mb-6">
                            <Eye className="w-7 h-7" />
                        </div>
                        <h2 className="text-3xl font-heading font-bold mb-4 text-foreground">Our Vision</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            To become India's most trusted platform for job placement and skill development by bridging the gap between talent and opportunity.
                        </p>
                    </motion.div>
                </div>

                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-heading font-bold text-foreground">What We Do</h2>
                        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Creating a unified ecosystem for all stakeholders</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            "Connect job seekers with verified companies",
                            "Enable NGOs to provide training and courses",
                            "Help companies find skilled candidates efficiently",
                            "Provide a unified dashboard for all users"
                        ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 bg-muted/30 rounded-2xl border border-border/40 text-center hover:shadow-lg transition-all">
                                <Settings className="w-8 h-8 mx-auto text-primary mb-4" />
                                <p className="text-sm font-bold text-foreground">{item}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-heading font-bold text-foreground">Why Choose JobSeva</h2>
                    </div>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
                        {[
                            "AI-powered job matching",
                            "Verified companies and NGOs",
                            "Skill-based training programs",
                            "Easy application process"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50">
                                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                                <span className="font-bold text-foreground text-lg">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
