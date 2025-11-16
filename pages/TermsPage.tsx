import React from 'react';

const TermsPage: React.FC = () => {
    return (
        <div className="py-12 md:py-20 animate-fade-in-up">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose dark:prose-invert">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">Last updated: October 26, 2023</p>

                <h2>1. Agreement to Terms</h2>
                <p>
                    By using our application, Econify (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
                </p>
                
                <h2>2. Use of the Service</h2>
                <p>
                    You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
                </p>
                <ul>
                    <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                    <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
                </ul>

                <h2>3. Intellectual Property</h2>
                <p>
                    The Service and its original content, features, and functionality are and will remain the exclusive property of Econify, Inc. and its licensors.
                </p>
                
                <h2>4. Disclaimer of Warranties</h2>
                <p>
                   The information provided by the Service is for informational purposes only and does not constitute financial or investment advice. You should not rely upon the material or information on the website as a basis for making any business, legal or any other decisions. We do not warrant the accuracy, completeness, or usefulness of this information. Any reliance you place on such information is strictly at your own risk.
                </p>

                <h2>5. Limitation of Liability</h2>
                <p>
                    In no event shall Econify, Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>

                <h2>6. Changes to Terms</h2>
                <p>
                    We may modify these Terms at any time. We will notify you by posting the updated Terms on this site. Your continued use of the Service after the posting of the revised Terms means that you accept and agree to the changes.
                </p>

                <h2>7. Contact Us</h2>
                <p>
                    If you have any questions about these Terms, please contact us at: <a href="mailto:legal@econify.ai">legal@econify.ai</a>
                </p>
            </div>
        </div>
    );
};

export default TermsPage;
