import React, { useState, useRef } from 'react';
import { Page, User } from '../types';
import { CheckIcon, SpinnerIcon, LockClosedIcon } from '../components/Icons';

interface PricingPageProps {
    setPage: (page: Page) => void;
    setIsAuthenticated: (isAuth: boolean) => void;
    setUser: (user: User) => void;
}

const PlanFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center space-x-3">
        <CheckIcon className="flex-shrink-0 w-5 h-5 text-positive" />
        <span className="text-gray-600 dark:text-gray-400">{children}</span>
    </li>
);

const PricingCard: React.FC<{ plan: string; price: string; description: string; features: string[]; popular?: boolean, onSelect: () => void; }> = ({ plan, price, description, features, popular, onSelect }) => (
    <div className={`relative flex flex-col p-8 bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ${popular ? 'border-2 border-econify-blue' : 'border border-gray-200 dark:border-gray-700'}`}>
        {popular && <div className="absolute top-0 -translate-y-1/2 bg-econify-blue text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">Most Popular</div>}
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{plan}</h3>
        <p className="mt-4 text-gray-500 dark:text-gray-400">{description}</p>
        <div className="mt-6">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">${price}</span>
            <span className="text-base font-medium text-gray-500 dark:text-gray-400">/mo</span>
        </div>
        <ul className="mt-8 space-y-4 flex-grow">
            {features.map((feature, index) => <PlanFeature key={index}>{feature}</PlanFeature>)}
        </ul>
        <button 
            onClick={onSelect}
            className={`w-full mt-10 py-3 px-6 text-center font-semibold rounded-lg transition-colors ${popular ? 'bg-econify-blue text-white hover:bg-blue-700' : 'bg-gray-100 dark:bg-gray-700 text-econify-blue hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            Get Started
        </button>
    </div>
);

const CheckoutForm: React.FC<{
    selectedPlan: { plan: string; price: string };
    onCancel: () => void;
    setPage: (page: Page) => void;
    setIsAuthenticated: (isAuth: boolean) => void;
    setUser: (user: User) => void;
}> = ({ selectedPlan, onCancel, setPage, setIsAuthenticated, setUser }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '' });
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            
            // Simulate account creation and login
            const user: User = {
                fullName: formData.fullName || 'Pro User',
                email: formData.email || 'pro@econify.ai'
            };
            setUser(user);
            setIsAuthenticated(true);
            
            // Redirect to chat page after a short delay to show success state
            setTimeout(() => {
                setPage('chat');
            }, 2000);
        }, 2000);
    };
    
    if (isSuccess) {
        return (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <CheckIcon className="w-16 h-16 mx-auto text-positive" />
                <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Purchase Successful!</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome to Econify {selectedPlan.plan}! You will be redirected shortly.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl animate-fade-in-up">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                        You've selected the <span className="font-semibold text-econify-blue">{selectedPlan.plan}</span> plan.
                    </p>
                </div>
                <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">&times; Cancel</button>
            </div>
            
            <form onSubmit={handleCheckout} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Account Information</h3>
                </div>
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input type="text" name="fullName" id="fullName" required onChange={handleInputChange} value={formData.fullName} className="mt-1 block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md shadow-sm focus:ring-econify-blue focus:border-econify-blue sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input type="email" name="email" id="email" required onChange={handleInputChange} value={formData.email} autoComplete="email" className="mt-1 block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md shadow-sm focus:ring-econify-blue focus:border-econify-blue sm:text-sm" />
                </div>

                <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Payment Details</h3>
                </div>
                 <div className="md:col-span-2">
                    <label htmlFor="card-details" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Details</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                        </div>
                        <input type="text" name="card-details" id="card-details" required className="block w-full px-10 py-3 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md focus:ring-econify-blue focus:border-econify-blue sm:text-sm" placeholder="Card Number" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date</label>
                        <input type="text" name="expiry-date" id="expiry-date" required className="mt-1 block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md shadow-sm focus:ring-econify-blue focus:border-econify-blue sm:text-sm" placeholder="MM / YY" />
                    </div>
                     <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">CVC</label>
                        <input type="text" name="cvc" id="cvc" required className="mt-1 block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md shadow-sm focus:ring-econify-blue focus:border-econify-blue sm:text-sm" placeholder="CVC" />
                    </div>
                </div>

                <div className="md:col-span-2 mt-4 flex flex-col items-center">
                     <button type="submit" disabled={isLoading} className="w-full max-w-xs flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-econify-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-econify-blue transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isLoading ? <SpinnerIcon className="w-5 h-5" /> : <><LockClosedIcon className="w-5 h-5" /> Pay ${selectedPlan.price}</>}
                    </button>
                    <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">By clicking Pay, you agree to the Terms of Service.</p>
                </div>
            </form>
        </div>
    );
};


const PricingPage: React.FC<PricingPageProps> = ({ setPage, setIsAuthenticated, setUser }) => {
    const [selectedPlan, setSelectedPlan] = useState<{plan: string; price: string} | null>(null);
    const checkoutRef = useRef<HTMLDivElement>(null);
    
    const handlePlanSelect = (plan: string, price: string) => {
        setSelectedPlan({ plan, price });
        setTimeout(() => {
            checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    return (
        <div className="py-12 md:py-20 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Plans for Every Analyst 🚀</h2>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Choose the plan that's right for you and unlock powerful insights.</p>
                </div>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <PricingCard
                        plan="Basic"
                        price="0"
                        description="Perfect for students & hobbyists starting their economic journey. 🎓"
                        features={["Standard AI model", "10 queries/day", "Basic data analysis", "Community support"]}
                        onSelect={() => setPage('signup')}
                    />
                     <PricingCard
                        plan="Pro"
                        price="15.99"
                        description="For professionals who need advanced analysis and unlimited power. 💼"
                        features={["Advanced AI models", "Unlimited queries", "Deep analysis mode", "Image & chart uploads", "Priority email support"]}
                        popular
                        onSelect={() => handlePlanSelect('Pro', '15.99')}
                    />
                     <PricingCard
                        plan="Enterprise"
                        price="69.99"
                        description="Custom solutions for teams and organizations needing dedicated support. 🏢"
                        features={["All Pro features", "Team accounts", "Dedicated infrastructure", "API Access & Integrations", "24/7 dedicated support"]}
                        onSelect={() => handlePlanSelect('Enterprise', '69.99')}
                    />
                </div>
                
                {selectedPlan && (
                    <div ref={checkoutRef} className="mt-20 max-w-4xl mx-auto">
                       <CheckoutForm 
                            selectedPlan={selectedPlan} 
                            onCancel={() => setSelectedPlan(null)}
                            setPage={setPage}
                            setIsAuthenticated={setIsAuthenticated}
                            setUser={setUser}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PricingPage;