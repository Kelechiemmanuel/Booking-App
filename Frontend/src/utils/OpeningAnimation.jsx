import { motion } from "framer-motion";

const OpeningAnimation = ({ onComplete }) => {
    return (
        <motion.div
            className="fixed inset-0 z-9999 overflow-hidden bg-[#0F172A] text-white"
            initial={{
                opacity: 1,
                filter: "blur(0px)"
            }}
            animate={{
                opacity: 0,
                filter: "blur(8px)"
            }}
            transition={{
                duration: 1.2,
                delay: 4.5,
                ease: "easeInOut"
            }}
            onAnimationComplete={onComplete}
        >

            <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: "50px 50px"
                }}
            />


            <motion.div
                className="absolute top-0 left-0 h-px bg-white/30"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.7, ease: "easeOut" }}
            />

            <div className="relative z-10 flex h-full items-center justify-center">

                <div className="text-center">


                    <motion.p
                        className="mb-5 text-xs uppercase tracking-[0.5em] text-white/50"
                        initial={{
                            opacity: 0,
                            y: 15
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        transition={{
                            duration: 1.2,
                            delay: 0.3
                        }}
                    >
                        Your number one appointment booking platform
                    </motion.p>

                    <motion.h1
                        className="font-semibold text-5xl tracking-tight sm:text-6xl md:text-8xl"
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                            filter: "blur(12px)"
                        }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0.8, 1, 1, 0.95],
                            filter: ["blur(12px)", "blur(0px)", "blur(0px)", "blur(8px)"]
                        }}
                        transition={{
                            duration: 4.5,
                            times: [0, 0.2, 0.65, 1],
                            ease: "easeInOut"
                        }}
                    >
                        A K E S T A C K
                    </motion.h1>

                    <div className="mx-auto mt-6 h-px w-40 overflow-hidden bg-white/10">

                        <motion.div
                            className="h-full bg-white"
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{
                                duration: 2.7,
                                delay: 1.2,
                                ease: "easeInOut"
                            }}
                        />

                    </div>

                    <motion.div
                        className="mt-5 flex items-center justify-center gap-3 text-xs tracking-widest text-white/40 uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            delay: 1.6,
                            duration: 1.5
                        }}
                    >
                        <span>Loading</span>

                        <motion.span className="text-6xl"
                            animate={{
                                opacity: [0.2, 1, 0.2]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity
                            }}
                        >
                            •
                        </motion.span>

                        <motion.span className="text-6xl"
                            animate={{
                                opacity: [0.2, 1, 0.2]
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: 0.2
                            }}
                        >
                            •
                        </motion.span>

                        <motion.span className="text-6xl"
                            animate={{
                                opacity: [0.2, 1, 0.2]
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: 0.4
                            }}
                        >
                            •
                        </motion.span>
                    </motion.div>

                </div>

            </div>

            <motion.div
                className="absolute bottom-8 left-8 text-[10px] uppercase tracking-[0.3em] text-white/30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    delay: 1.8,
                    duration: 1.5
                }}
            >
                One link. Zero friction / 2026
            </motion.div>

            <motion.div
                className="absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.3em] text-white/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    delay: 1.8,
                    duration: 1.5
                }}
            >
                Lagos, NG
            </motion.div>

        </motion.div>
    );
};

export default OpeningAnimation;