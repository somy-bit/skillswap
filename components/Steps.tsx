"use client";

import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DARK_BTN, LIGHT_BTN, DARK_TEXT, LIGHT_TEXT } from "@/lib/utils";



type MultiStepFormProps = {
    steps: ReactNode[];
    onFinish?: () => void;// 👈 key part
};

export default function Steps({ steps, onFinish }: MultiStepFormProps) {
    const [step, setStep] = useState<number>(0);

    const variants = {
        enter: { x: 100, opacity: 0, position: "absolute" }, // slide in from right
        center: { x: 0, opacity: 1, position: "relative" }, // active
        exit: { x: 0, opacity: 0, scaleY: 0.0, position: "absolute" }, // fade out while moving left
    };


    const handleNext = () => {
        if (step === steps.length - 1) {
            // ✅ Last step, call parent callback
            onFinish?.();
        } else {
            setStep((s) => Math.min(s + 1, steps.length - 1));
        }
    };



    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            {!steps || steps.length === 0 ? (
                <p className={`dark:text-white text-gray-800 opacity-70`}>No steps available</p>
            ) : (
                <>
                    <AnimatePresence >
                        <motion.div
                            key={step}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="w-full flex items-center justify-center text-center"
                        >
                            {steps[step]}
                        </motion.div>
                    </AnimatePresence>
                    <div className={`flex w-md px-10 flex-row ${step === 0 ? 'justify-center' : 'justify-between'}`}>
                        {
                            step !== 0 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className={`mt-8  px-6 py-2 darkbtn lightbtn`}
                                >
                                    Back
                                </button>
                            )
                        }

                        <button
                            onClick={handleNext}
                            className={`mt-8 lightbtn darkbtn px-6 py-2 rounded-lg `}
                        >
                            {step === steps.length - 1 ? "Finish" : "Next"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
