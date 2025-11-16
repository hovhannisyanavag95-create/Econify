import React, { useState } from 'react';
import { Page, User } from '../types';
import { SpinnerIcon } from '../components/Icons';

interface SignUpPageProps {
    setPage: (page: Page) => void;
    setIsAuthenticated: (isAuth: boolean) => void;
    setUser: (user: User) => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ setPage, setIsAuthenticated, setUser }) => {
    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<typeof formData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const validate = (): Partial<typeof formData> => {
        const newErrors: Partial<typeof formData> = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid.";
        }
        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }
        return newErrors;
    };
    
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setApiError('');
        setIsLoading(true);

        // Simulate API call to a backend
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate a common error case (e.g., email already exists)
        if (formData.email.toLowerCase() === 'exists@econify.ai') {
            setApiError('An account with this email already exists.');
            setIsLoading(false);
        } else {
            // On success, log the user in and navigate to chat
            setIsLoading(false);
            setIsAuthenticated(true);
            setUser({ fullName: formData.fullName, email: formData.email });
            setPage('chat');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear specific error on change for better UX
        if (errors[e.target.name as keyof typeof errors]) {
            setErrors({ ...errors, [e.target.name]: undefined });
        }
    };

    return (
        <div className="flex items-center justify-center py-12 md:py-24 animate-fade-in-up">
            <div className="w-full max-w-md px-8">
                <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-xl">
                    <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
                        Create an Account
                    </h2>
                    <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Start your journey with Econify
                    </p>

                    <form className="mt-8 space-y-4" onSubmit={handleSignUp} noValidate>
                        {apiError && (
                            <div className="p-3 bg-negative/10 text-negative text-sm rounded-md" role="alert">
                                {apiError}
                            </div>
                        )}
                        <div>
                            <label htmlFor="fullName" className="sr-only">Full Name</label>
                            <input id="fullName" name="fullName" type="text" autoComplete="name" required 
                                className={`appearance-none relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-econify-blue focus:border-econify-blue focus:z-10 sm:text-sm bg-transparent ${errors.fullName ? 'border-negative' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                            {errors.fullName && <p className="mt-1 text-xs text-negative">{errors.fullName}</p>}
                        </div>

                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input id="email-address" name="email" type="email" autoComplete="email" required 
                                className={`appearance-none relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-econify-blue focus:border-econify-blue focus:z-10 sm:text-sm bg-transparent ${errors.email ? 'border-negative' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="mt-1 text-xs text-negative">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password"className="sr-only">Password</label>
                            <input id="password" name="password" type="password" autoComplete="new-password" required
                                className={`appearance-none relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-econify-blue focus:border-econify-blue focus:z-10 sm:text-sm bg-transparent ${errors.password ? 'border-negative' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Password (min. 8 characters)"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <p className="mt-1 text-xs text-negative">{errors.password}</p>}
                        </div>

                         <div>
                            <label htmlFor="confirmPassword"className="sr-only">Confirm Password</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required
                                className={`appearance-none relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-econify-blue focus:border-econify-blue focus:z-10 sm:text-sm bg-transparent ${errors.confirmPassword ? 'border-negative' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && <p className="mt-1 text-xs text-negative">{errors.confirmPassword}</p>}
                        </div>

                        <div className="pt-2">
                            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-econify-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-econify-blue transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'Create Account'}
                            </button>
                        </div>
                    </form>
                    <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <a href="#" onClick={(e) => { e.preventDefault(); setPage('login'); }} className="font-medium text-econify-blue hover:text-blue-500">
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;