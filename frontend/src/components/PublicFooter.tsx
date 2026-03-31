import { Link } from "react-router-dom";
import { Mail, Phone, Globe } from "lucide-react";

export default function PublicFooter() {
    return (
        <footer className="border-t border-border py-10 px-4 sm:px-6 lg:px-8 bg-card/30">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
                    <div className="max-w-xs">
                        <div className="mb-3 logo-hover inline-block">
                            <img src="/JobSeva.png" alt="JobSeva" className="h-24 sm:h-28 w-auto" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Connecting talent with real opportunities. Your next career move starts here.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-sm mb-3 text-foreground">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link to="/training" className="hover:text-primary inline-block hover:translate-x-1 transition-all duration-300">
                                    Training
                                </Link>
                            </li>
                            <li>
                                <Link to="/jobs" className="hover:text-primary inline-block hover:translate-x-1 transition-all duration-300">
                                    Browse Jobs
                                </Link>
                            </li>
                            <li>
                                <a href="/#how-it-works" className="hover:text-primary inline-block hover:translate-x-1 transition-all duration-300">
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <Link to="/app" className="hover:text-primary inline-block hover:translate-x-1 transition-all duration-300">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-sm mb-3 text-foreground">Contact</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary/70" /> support@jobseva.com
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary/70" /> +91 9967267280
                            </li>
                            <li className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-primary/70" /> www.jobseva.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-6 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground">© 2026 JobSeva. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
