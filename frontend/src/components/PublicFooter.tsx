import { Link } from "react-router-dom";
import { Mail, Phone, Globe, Linkedin, Twitter, Instagram, ChevronRight } from "lucide-react";

export default function PublicFooter() {
    return (
        <footer className="relative border-t border-white/10 pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-card/40 backdrop-blur-xl overflow-hidden">
            {/* Top accent gradient border */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block logo-hover">
                            <img src="/JobSeva.png" alt="JobSeva" className="h-24 sm:h-28 w-auto object-contain" />
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-medium">
                            Connecting talent with real opportunities through AI-powered matching and professional NGOs.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-foreground/90 mb-6 px-1">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground/80 font-medium">
                            <li>
                                <Link to="/jobs" className="group flex items-center gap-2 hover:text-primary transition-colors">
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> Browse Jobs
                                </Link>
                            </li>
                            <li>
                                <Link to="/training" className="group flex items-center gap-2 hover:text-primary transition-colors">
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> Trainings
                                </Link>
                            </li>
                            <li>
                                <Link to="/companies" className="group flex items-center gap-2 hover:text-primary transition-colors">
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> Companies
                                </Link>
                            </li>
                            <li>
                                <Link to="/app" className="group flex items-center gap-2 hover:text-primary transition-colors">
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-foreground/90 mb-6 px-1">Resources</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground/80 font-medium">
                            <li>
                                <Link to="/about" className="group flex items-center gap-2 hover:text-primary transition-colors">
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="group flex items-center gap-2 hover:text-primary transition-colors">
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> Contact Support
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="group flex items-center gap-2 hover:text-primary transition-colors">
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="group flex items-center gap-2 hover:text-primary transition-colors">
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-foreground/90 mb-6 px-1">Contact</h4>
                        <ul className="space-y-5 text-sm text-muted-foreground/80 font-medium">
                            <li className="flex items-start gap-4">
                                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1">Email Support</span>
                                    <a href="mailto:jobsevaindia@gmail.com" className="hover:text-primary transition-colors">jobsevaindia@gmail.com</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1">Call Us</span>
                                    <a href="tel:+918850070036" className="hover:text-primary transition-colors">+91 8850070036</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1">Office Location</span>
                                    <span className="hover:text-primary transition-colors">Mumbai, Maharashtra, India</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground/60 font-medium">
                        © 2026 JobSeva. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8 text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                        <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
                        <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
