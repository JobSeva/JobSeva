import { motion } from "framer-motion";

interface LoaderProps {
    fullScreen?: boolean;
    message?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

const Loader = ({
    fullScreen = false,
    message,
    size = "md"
}: LoaderProps) => {
    // Determine the effective size - fullScreen always uses 'xl'
    const effectiveSize = fullScreen ? "xl" : size;

    const containerClasses = fullScreen
        ? "fixed inset-0 z-[9999] bg-background/95 backdrop-blur-2xl flex flex-col items-center justify-center pt-8"
        : `flex ${effectiveSize === 'sm' ? 'flex-row' : 'flex-col'} items-center justify-center w-full min-h-[${effectiveSize === 'sm' ? 'auto' : '300px'}] ${effectiveSize === 'sm' ? 'py-1' : 'py-12'} gap-4`;

    const sizeClasses = {
        sm: { container: "w-6 h-6", logo: "w-3 h-3", ring: "border-2", text: "text-sm", gap: "gap-2" },
        md: { container: "w-32 h-32", logo: "w-16 h-16", ring: "border-4", text: "text-lg", gap: "gap-12" },
        lg: { container: "w-48 h-48", logo: "w-24 h-24", ring: "border-[5px]", text: "text-xl", gap: "gap-16" },
        xl: { container: "w-64 h-64", logo: "w-32 h-32", ring: "border-[6px]", text: "text-2xl", gap: "gap-20" }
    };

    const currentSize = sizeClasses[effectiveSize];

    return (
        <div className={containerClasses}>
            <div className={`relative ${currentSize.container} flex items-center justify-center shrink-0`}>
                {/* Branded Gradient Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className={`absolute inset-0 rounded-full ${currentSize.ring} border-t-primary border-r-orange-500 border-b-secondary border-l-transparent shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)]`}
                />

                {/* Subtle secondary ring for depth */}
                {effectiveSize !== 'sm' && (
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className={`absolute inset-3 rounded-full ${currentSize.ring} border-t-orange-400/20 border-r-transparent border-b-primary/20 border-l-transparent`}
                    />
                )}

                {/* Pulsing Outer Glow */}
                {effectiveSize === 'xl' && (
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-orange-500/20 blur-3xl"
                    />
                )}

                {/* Logo Container */}
                <div className="relative z-10 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [0.95, 1.1, 0.95],
                            opacity: 1
                        }}
                        transition={{
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                            opacity: { duration: 0.5 }
                        }}
                    >
                        {effectiveSize === 'sm' ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        ) : (
                            <img
                                src="/JobSeva.png"
                                alt="JobSeva"
                                className={`${currentSize.logo} object-contain transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]`}
                            />
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Loading Text */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: effectiveSize === 'sm' ? 0 : 15, x: effectiveSize === 'sm' ? 10 : 0 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`flex ${effectiveSize === 'sm' ? 'flex-row' : 'flex-col'} items-center gap-2`}
                >
                    <p className={`${currentSize.text} font-heading font-bold tracking-tight ${effectiveSize === 'sm' ? 'text-current' : 'bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent'} text-center`}>
                        {message}
                    </p>

                    {effectiveSize !== 'sm' && (
                        <div className="flex gap-2">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -6, 0],
                                        opacity: [0.4, 1, 0.4]
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                        ease: "easeInOut"
                                    }}
                                    className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-orange-500"
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Loader;
