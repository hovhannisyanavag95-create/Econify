import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { SpinnerIcon, CheckIcon } from '../components/Icons';

interface ProfilePageProps {
    user: User;
    setUser: (user: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, setUser }) => {
    const [formData, setFormData] = useState<User>({ ...user });
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setFormData({ ...user });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage('');

        // Simulate API call
        setTimeout(() => {
            setUser(formData);
            setIsSaving(false);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }, 1500);
    };

    return (
        <div className="py-12 md:py-20 animate-fade-in-up">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-xl">
                    <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Account Settings
                    </h1>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
                        Manage your account information.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                id="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-transparent placeholder-gray-500 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-econify-blue focus:border-econify-blue sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-transparent placeholder-gray-500 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-econify-blue focus:border-econify-blue sm:text-sm"
                            />
                        </div>
                        <div className="flex items-center justify-end gap-4 pt-2">
                             {successMessage && (
                                <div className="flex items-center gap-2 text-sm text-positive transition-opacity duration-300">
                                    <CheckIcon className="w-5 h-5" />
                                    <span>{successMessage}</span>
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="group relative flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-econify-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-econify-blue transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSaving ? <SpinnerIcon className="w-5 h-5" /> : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;