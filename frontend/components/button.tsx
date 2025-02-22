"use client"

import { useFormStatus } from "react-dom";

interface ButtonProps {
    text: string;
    disabled?: boolean; // Optional disabled prop
    className?: string; // Optional className prop for styling flexibility
}

export default function Button({ text, disabled = false, className }: ButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={disabled || pending} // Disable if `disabled` is true or form is pending
            className={`h-10 px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg transition duration-300 ease-in-out hover:bg-indigo-700 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed ${className ?? ''}`}
        >
            {pending ? "Loading..." : text}
        </button>
    );
}
