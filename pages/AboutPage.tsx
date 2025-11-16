import React from 'react';
import { BrainIcon, GlobeIcon, ChartBarIcon } from '../components/Icons';

const ValueCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="text-center">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-econify-blue/10 text-econify-blue mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400">{children}</p>
    </div>
);

const TeamMemberCard: React.FC<{ name: string; title: string; imageUrl: string }> = ({ name, title, imageUrl }) => (
    <div className="text-center">
        <img className="mx-auto h-32 w-32 rounded-full object-cover mb-4" src={imageUrl} alt={name} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
        <p className="text-econify-blue">{title}</p>
    </div>
);

const AboutPage: React.FC = () => {
    return (
        <div className="animate-fade-in-up">
            {/* Mission Section */}
            <section className="py-20 md:py-28 bg-white dark:bg-gray-800/30">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Our Mission 🎯
                    </h1>
                    <p className="text-lg md:text-xl text-medium-gray dark:text-gray-300">
                        To make understanding the economy simple and accessible for everyone. We use AI to turn complex data into clear, actionable insights for smarter decision-making. 💡
                    </p>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                         <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Core Values</h2>
                         <p className="mt-4 text-lg text-medium-gray dark:text-gray-400">The principles that guide our work every day.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <ValueCard icon={<BrainIcon className="w-8 h-8" />} title="Clarity">
                            We make the complex simple, turning confusing data into clear insights. ✨
                        </ValueCard>
                        <ValueCard icon={<ChartBarIcon className="w-8 h-8" />} title="Accuracy">
                            Our insights are built on reliable data and cutting-edge AI, so you can trust our analysis. 🎯
                        </ValueCard>
                        <ValueCard icon={<GlobeIcon className="w-8 h-8" />} title="Accessibility">
                           We're breaking down barriers, making economic knowledge available to all. 🌍
                        </ValueCard>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gray-50 dark:bg-deep-navy/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                         <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Meet the Team</h2>
                         <p className="mt-4 text-lg text-medium-gray dark:text-gray-400">The minds behind Econify.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        <TeamMemberCard name="Alex Johnson" title="Founder & CEO" imageUrl="https://i.pravatar.cc/150?img=68" />
                        <TeamMemberCard name="Maria Garcia" title="Lead AI Researcher" imageUrl="https://i.pravatar.cc/150?img=49" />
                        <TeamMemberCard name="David Chen" title="Head of Product" imageUrl="https://i.pravatar.cc/150?img=32" />
                        <TeamMemberCard name="Sarah Lee" title="Principal Economist" imageUrl="https://i.pravatar.cc/150?img=35" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;