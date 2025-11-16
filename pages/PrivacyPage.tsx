import React from 'react';

const PrivacyPage: React.FC = () => {
    return (
        <div className="py-12 md:py-20 animate-fade-in-up">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose dark:prose-invert">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">Last updated: October 26, 2023</p>

                <h2>1. Introduction</h2>
                <p>
                    Welcome to Econify ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
                </p>

                <h2>2. Information We Collect</h2>
                <p>
                    We may collect information about you in a variety of ways. The information we may collect on the Service includes:
                </p>
                <ul>
                    <li>
                        <strong>Personal Data:</strong> Personally identifiable information, such as your name, and email address, that you voluntarily give to us when you register with the Service.
                    </li>
                    <li>
                        <strong>Usage Data:</strong> Information your browser sends whenever you visit our Service. This Usage Data may include information such as your computer's IP address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, and other diagnostic data.
                    </li>
                     <li>
                        <strong>User Inputs:</strong> We collect the questions, prompts, and any uploaded files you provide to the AI model to generate analysis.
                    </li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>
                    Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:
                </p>
                <ul>
                    <li>Create and manage your account.</li>
                    <li>Improve our AI models and the overall quality of our service.</li>
                    <li>Monitor and analyze usage and trends to improve your experience.</li>
                    <li>Respond to your comments and questions and provide customer service.</li>
                </ul>
                
                <h2>4. Disclosure of Your Information</h2>
                <p>
                   We do not share your personal information with third parties except as described in this Privacy Policy. We may share your information with third-party vendors and service providers that provide services to us, but they will be obligated not to disclose or use it for any other purpose.
                </p>

                <h2>5. Security of Your Information</h2>
                <p>
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                </p>

                <h2>6. Contact Us</h2>
                <p>
                    If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@econify.ai">privacy@econify.ai</a>
                </p>
            </div>
        </div>
    );
};

export default PrivacyPage;
