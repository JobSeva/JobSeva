import React from "react";
import { motion } from "framer-motion";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
    return (
        <div className="min-h-screen bg-background pt-20">
            <PublicNavbar />

            <section className="relative py-24 px-4 overflow-hidden bg-[#0A0118]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent blur-3xl opacity-50" />
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 text-primary text-xs font-bold uppercase tracking-widest">
                        Contact Us
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-extrabold text-white leading-tight">
                        Get in <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Touch</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground mt-6 text-lg font-medium leading-relaxed">
                        Have questions or need support? We're here to help you.
                    </motion.p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="clean-card p-8 bg-card border border-border/50 rounded-3xl flex items-start gap-6">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                                <Mail className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-heading font-bold text-foreground">Email Support</h3>
                                <p className="text-muted-foreground mt-2">jobsevaindia@gmail.com</p>
                            </div>
                        </div>

                        <div className="clean-card p-8 bg-card border border-border/50 rounded-3xl flex items-start gap-6">
                            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary text-orange-500 flex-shrink-0">
                                <Phone className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-heading font-bold text-foreground">Phone</h3>
                                <p className="text-muted-foreground mt-2">+91 8850070036</p>
                            </div>
                        </div>

                        <div className="clean-card p-8 bg-card border border-border/50 rounded-3xl flex items-start gap-6">
                            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 flex-shrink-0">
                                <MapPin className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-heading font-bold text-foreground">Office Location</h3>
                                <p className="text-muted-foreground mt-2">Mumbai, Maharashtra, India</p>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground border-l-4 border-primary pl-4">
                            Our team typically responds within 24 hours. For urgent queries, please contact us via phone.
                        </p>
                    </div>

                    {/* Contact Form */}
                    <div className="clean-card p-8 bg-card border border-border/50 rounded-3xl">
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Send us a Message</h2>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-foreground mb-2">Full Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-foreground mb-2">Email Address</label>
                                <input type="email" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-foreground mb-2">Message</label>
                                <textarea rows={5} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" placeholder="Your message..."></textarea>
                            </div>
                            <button type="button" className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold">
                                👉 Send Message <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
