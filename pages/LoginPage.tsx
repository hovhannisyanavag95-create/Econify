import React from 'react';
import { Page, User } from '../types';

interface LoginPageProps {
    setPage: (page: Page) => void;
    setIsAuthenticated: (isAuth: boolean) => void;
    setUser: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setPage, setIsAuthenticated, setUser }) => {

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const emailInput = form.elements.namedItem('email') as HTMLInputElement;

        // Simulate a successful login
        setIsAuthenticated(true);
        // In a real app, you'd fetch user details. Here we'll use a placeholder name.
        setUser({ fullName: 'Demo User', email: emailInput.value });
        setPage('chat');
    };

    return (
        <div className="flex items-center justify-center py-12 md:py-24 animate-fade-in-up">
            <div className="w-full max-w-md px-8">
                <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-xl">
                    <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome Back
                    </h2>
                    <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sign in to continue to Econify
                    </p>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-transparent placeholder-gray-500 text-gray-900 dark:text-gray-200 rounded-t-md focus:outline-none focus:ring-econify-blue focus:border-econify-blue focus:z-10 sm:text-sm" placeholder="Email address" />
                            </div>
                            <div>
                                <label htmlFor="password"className="sr-only">Password</label>
                                <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-transparent placeholder-gray-500 text-gray-900 dark:text-gray-200 rounded-b-md focus:outline-none focus:ring-econify-blue focus:border-econify-blue focus:z-10 sm:text-sm" placeholder="Password" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-econify-blue hover:text-blue-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-econify-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-econify-blue transition-colors">
                                Sign in
                            </button>
                        </div>
                    </form>
                    <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <a href="#" onClick={(e) => { e.preventDefault(); setPage('signup'); }} className="font-medium text-econify-blue hover:text-blue-500">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;