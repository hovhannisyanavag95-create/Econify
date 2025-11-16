import React from 'react';
import { Page } from '../types';

interface CareersPageProps {
    setPage: (page: Page) => void;
}

interface JobOpeningProps {
    title: string;
    department: string;
    location: string;
    type: string;
    setPage: (page: Page) => void;
}

const JobOpening: React.FC<JobOpeningProps> = ({ title, department, location, type, setPage }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h3 className="text-lg font-semibold text-econify-blue">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
                {department} &middot; {location} &middot; {type}
            </p>
        </div>
        <button onClick={() => setPage('contact')} className="bg-econify-blue text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex-shrink-0">
            Apply Now
        </button>
    </div>
);


const CareersPage: React.FC<CareersPageProps> = ({ setPage }) => {
    return (
        <div className="animate-fade-in-up">
            {/* Hero Section */}
            <section className="py-20 text-center bg-white dark:bg-gray-800/30">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Join Our Team
                    </h1>
                    <p className="text-lg md:text-xl text-medium-gray dark:text-gray-300">
                        Help us build the future of economic intelligence. We're looking for passionate, curious, and creative people to join us on our mission.
                    </p>
                </div>
            </section>

            {/* Open Positions Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Current Openings</h2>
                    
                    <div className="space-y-6">
                        <JobOpening 
                            title="Senior AI/ML Engineer"
                            department="Engineering"
                            location="Remote"
                            type="Full-time"
                            setPage={setPage}
                        />
                        <JobOpening 
                            title="Product Manager, Analytics"
                            department="Product"
                            location="New York, NY"
                            type="Full-time"
                            setPage={setPage}
                        />
                        <JobOpening 
                            title="Macroeconomic Research Analyst"
                            department="Economics"
                            location="London, UK"
                            type="Full-time"
                            setPage={setPage}
                        />
                         <JobOpening 
                            title="Senior Frontend Engineer"
                            department="Engineering"
                            location="Remote"
                            type="Full-time"
                            setPage={setPage}
                        />
                    </div>

                    <div className="text-center mt-12 p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Don't see a role that fits?</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            We're always looking for talented people. Send us your resume and tell us why you want to work at Econify.
                        </p>
                        <button onClick={() => setPage('contact')} className="mt-4 bg-transparent text-econify-blue font-semibold py-2 px-4 border border-econify-blue rounded-lg hover:bg-econify-blue hover:text-white transition-colors">
                            Get in Touch
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CareersPage;
