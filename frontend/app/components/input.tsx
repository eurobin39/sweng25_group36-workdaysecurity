import { InputHTMLAttributes } from "react";

interface InputProps {
    errors?: string[];
    name: string;
    defaultValue?: string[];
}

export default function Input({ name, errors = [], ...rest }: InputProps & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="flex flex-col gap-2">
            <input
                name={name}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           rounded-md w-full h-11 px-4 focus:outline-none
                           ring-1 focus:ring-2 ring-gray-300 focus:ring-indigo-500 border-none
                           placeholder:text-gray-600 dark:placeholder:text-gray-400
                           disabled:bg-gray-200 disabled:text-gray-700 disabled:opacity-100 disabled:cursor-not-allowed"
                {...rest}
            />
            {errors.length > 0 && (
                <div className="text-red-500 font-medium text-sm">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}

        </div>
    );
}
