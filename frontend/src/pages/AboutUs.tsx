import { motion } from "framer-motion";
import PublicNavbar from "@/components/PublicNavbar";
import { Shield, Target, Users, Sparkles, CheckCircle } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-background text-foreground pt-20">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-border bg-muted/20">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
                    >
                        <Sparkles className="w-4 h-4" /> Empowering Careers
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-heading font-extrabold mb-6"
                    >
                        About <span className="text-primary">JobSeva</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground leading-relaxed"
                    >
                        JobSeva is more than just a job board. We are a bridge between talent and opportunity, driven by technology and a commitment to making hiring faster, fairer, and more effective.
                    </motion.p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={0}
                        className="clean-card p-8 group border-l-4 border-l-primary"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Target className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold mb-4">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            To empower every professional to find their dream job and every company to find the perfect talent through innovative, transparent, and user-centric solutions.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={1}
                        className="clean-card p-8 group border-l-4 border-l-secondary"
                    >
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Shield className="w-6 h-6 text-secondary" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold mb-4">Our Vision</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            To become the world's most trusted recruitment ecosystem where opportunities are accessible to everyone, regardless of their background or location.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
                        <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-heading font-bold">
                            Why <span className="text-primary">Choose Us</span>?
                        </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Users, title: "Candidate First", desc: "We prioritize the user experience, ensuring that job seeking is simple and stress-free." },
                            { icon: CheckCircle, title: "Verified Jobs", desc: "Every job posting is vetted to ensure you only apply to legitimate opportunities." },
                            { icon: Sparkles, title: "AI-Powered", desc: "Our smart algorithms match you with roles that truly fit your skills and goals." },
                        ].map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                                className="clean-card p-6 text-center hover:shadow-lg transition-all"
                            >
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-heading font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Illustration/Image Placeholder */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl overflow-hidden aspect-[21/9] bg-gradient-to-br from-primary/20 to-secondary/20 border border-border flex items-center justify-center p-12 text-center"
                    >
                        <div>
                            <h3 className="text-2xl font-heading font-bold mb-4">Building the Future of Work</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Join us on our journey to redefine recruitment. Whether you're a job seeker or a company, we're here to help you succeed.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer Copy (Simplified) */}
            <footer className="py-10 px-4 text-center border-t border-border">
                <p className="text-sm text-muted-foreground">© 2026 JobSeva. All rights reserved.</p>
            </footer>
        </div>
    );
}
