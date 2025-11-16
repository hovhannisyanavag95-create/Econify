import React from 'react';

const ContactPage: React.FC = () => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle form submission
        alert("Thank you for your message. We'll get back to you shortly!");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="py-12 md:py-20 animate-fade-in-up">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">Get in Touch</h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="mt-16 bg-white dark:bg-gray-800/50 p-8 sm:p-12 rounded-2xl shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md shadow-sm focus:ring-econify-blue focus:border-econify-blue sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <input type="email" name="email" id="email" required autoComplete="email" className="mt-1 block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md shadow-sm focus:ring-econify-blue focus:border-econify-blue sm:text-sm" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                            <input type="text" name="subject" id="subject" required className="mt-1 block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md shadow-sm focus:ring-econify-blue focus:border-econify-blue sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                            <textarea id="message" name="message" rows={5} required className="mt-1 block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md shadow-sm focus:ring-econify-blue focus:border-econify-blue sm:text-sm resize-none"></textarea>
                        </div>
                        <div className="text-right">
                            <button type="submit" className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-econify-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-econify-blue transition-colors">
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
