import React from "react";
import { motion } from "framer-motion";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";

export default function Terms() {
    return (
        <div className="min-h-screen bg-background pt-20">
            <PublicNavbar />

            <section className="relative py-20 px-4 overflow-hidden bg-muted/20 border-b border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-6">
                        Terms & Conditions
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        By using JobSeva, you agree to the following terms and conditions.
                    </motion.p>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 py-16 prose prose-lg dark:prose-invert">
                <div className="space-y-12">
                    <div className="bg-card p-8 rounded-3xl border border-border/50">
                        <h2 className="text-2xl font-bold text-foreground mb-4">User Responsibilities</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Provide accurate information</li>
                            <li>Do not misuse the platform</li>
                            <li>Maintain account security</li>
                        </ul>
                    </div>

                    <div className="bg-card p-8 rounded-3xl border border-border/50">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Platform Usage</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>JobSeva is for professional use only</li>
                            <li>Any fraudulent activity will lead to account suspension</li>
                        </ul>
                    </div>

                    <div className="bg-card p-8 rounded-3xl border border-border/50">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Job Applications</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>JobSeva does not guarantee job placement</li>
                            <li>Employers are responsible for hiring decisions</li>
                        </ul>
                    </div>

                    <div className="bg-card p-8 rounded-3xl border border-border/50">
                        <h2 className="text-2xl font-bold text-foreground mb-4">NGO & Training</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>NGOs must provide accurate course details</li>
                            <li>Users enroll at their own discretion</li>
                        </ul>
                    </div>

                    <div className="bg-card p-8 rounded-3xl border border-border/50">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
                        <p className="text-muted-foreground mb-4">JobSeva is not responsible for:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Job rejections</li>
                            <li>Employer decisions</li>
                            <li>External communication issues</li>
                        </ul>
                    </div>

                    <div className="bg-card p-8 rounded-3xl border border-border/50">
                        <h2 className="text-2xl font-bold text-foreground mb-4">Account Termination</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to suspend accounts violating our policies.
                        </p>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
