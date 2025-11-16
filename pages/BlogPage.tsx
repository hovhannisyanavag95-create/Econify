import React from 'react';

interface BlogPostCardProps {
    imageUrl: string;
    category: string;
    title: string;
    excerpt: string;
    authorName: string;
    authorAvatar: string;
    date: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ imageUrl, category, title, excerpt, authorName, authorAvatar, date }) => (
    <a href="#" className="group block bg-white dark:bg-gray-800/50 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
        <div className="relative">
            <img src={imageUrl} alt={title} className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-6">
            <p className="text-sm font-semibold text-econify-blue uppercase tracking-wide">{category}</p>
            <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-econify-blue transition-colors">{title}</h3>
            <p className="mt-3 text-base text-gray-500 dark:text-gray-400">{excerpt}</p>
            <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src={authorAvatar} alt={authorName} />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{authorName}</p>
                    <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{date}</time>
                    </div>
                </div>
            </div>
        </div>
    </a>
);


const BlogPage: React.FC = () => {
    const posts = [
        {
            imageUrl: 'https://images.unsplash.com/photo-1665686306574-1ace09918530?q=80&w=2070&auto=format&fit=crop',
            category: 'Inflation',
            title: 'Navigating the New Normal: Is High Inflation Here to Stay?',
            excerpt: 'We dive deep into the latest CPI data, analyzing the core drivers and what central banks might do next.',
            authorName: 'Dr. Sarah Lee',
            authorAvatar: 'https://i.pravatar.cc/150?img=35',
            date: 'Oct 10, 2023',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1932&auto=format&fit=crop',
            category: 'Global Trade',
            title: 'Supply Chains in Flux: A Look at Post-Pandemic Global Trade',
            excerpt: 'The world\'s trade routes are being redrawn. We explore the trends, from near-shoring to the role of new technologies.',
            authorName: 'Alex Johnson',
            authorAvatar: 'https://i.pravatar.cc/150?img=68',
            date: 'Oct 2, 2023',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1559757147-51658df9c4d2?q=80&w=2070&auto=format&fit=crop',
            category: 'GDP & Growth',
            title: 'Recession or Soft Landing? Analyzing Q3 GDP Figures',
            excerpt: 'The latest GDP numbers are out, and the debate is heating up. We break down what the figures mean for the economy.',
            authorName: 'Maria Garcia',
            authorAvatar: 'https://i.pravatar.cc/150?img=49',
            date: 'Sep 25, 2023',
        },
    ];

    return (
        <div className="py-12 md:py-20 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">The Econify Blog</h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Insights and analysis on the global economy from our team of experts.</p>
                </div>

                <div className="mt-16 grid gap-10 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                    {posts.map(post => <BlogPostCard key={post.title} {...post} />)}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
