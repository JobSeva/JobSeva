import React from "react";
import { motion } from "framer-motion";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background pt-20">
            <PublicNavbar />

            <section className="relative py-20 px-4 overflow-hidden bg-muted/20 border-b border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-6">
                        Privacy Policy
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        At JobSeva, we value your privacy and are committed to protecting your personal information.
                    </motion.p>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 py-16 prose prose-lg dark:prose-invert">
                <div className="space-y-12">
                    <div className="bg-card p-8 rounded-3xl border border-border/50">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Name, email, and contact details</li>
                            <li>Resume and profile data</li>
                            <li>Job preferences and activity</li>
                        </ul>
                    </div>

                    <div className="bg-card p-8 rounded-3xl border border-border/50">
                        <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>To provide job recommendations</li>
                            <li>To connect you with companies and NGOs</li>
                            <li>To improve platform performance</li>
                        </ul>
                    </div>

                    <div className="bg-card p-8 rounded-3xl border border-border/50">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Data Protection</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We implement industry-standard security measures to protect your data from unauthorized access.
                        </p>
                    </div>

                    <div className="bg-card p-8 rounded-3xl border border-border/50">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Sharing</h2>
                        <p className="text-muted-foreground mb-4">We do not sell your data. Information is only shared with:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Employers (for job applications)</li>
                            <li>NGOs (for training enrollment)</li>
                        </ul>
                    </div>

                    <div className="bg-card p-8 rounded-3xl border border-border/50">
                        <h2 className="text-2xl font-bold text-foreground mb-4">User Rights</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Access your data</li>
                            <li>Update your profile</li>
                            <li>Request account deletion</li>
                        </ul>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
