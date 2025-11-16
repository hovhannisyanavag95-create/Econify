import React from 'react';

const HistoryPage: React.FC = () => {
    // In a real application, this would come from state or an API call.
    // For now, it's an empty array to reflect a new user's history.
    const historyItems: any[] = [];

    return (
        <div className="py-12 md:py-20 animate-fade-in-up">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">Your Activity History 📖</h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Review your past chat sessions and data visualizations.</p>
                </div>

                <div className="mt-12">
                    {historyItems.length > 0 ? (
                        <div className="space-y-4">
                            {/* History items would be mapped here in a real implementation */}
                        </div>
                    ) : (
                        <div className="text-center bg-white dark:bg-gray-800/50 p-8 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No History Yet</h3>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                Your past conversations and data visualizations will appear here once you start using the app.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;