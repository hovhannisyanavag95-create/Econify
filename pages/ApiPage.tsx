import React from 'react';

const CodeBlock: React.FC<{ language: string; children: React.ReactNode }> = ({ language, children }) => (
    <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-4 overflow-x-auto">
        <code className={`language-${language} text-sm text-gray-800 dark:text-gray-200`}>
            {children}
        </code>
    </pre>
);

const ApiPage: React.FC = () => {
    const jsExample = `
fetch('https://api.econify.ai/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Analyze the latest inflation data for the US.',
    mode: 'deep'
  })
})
.then(response => response.json())
.then(data => console.log(data.analysis));
    `;

    const pythonExample = `
import requests

api_key = 'YOUR_API_KEY'
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}
data = {
    'prompt': 'Compare the GDP growth of Germany and France over the last 5 years.',
    'mode': 'standard'
}

response = requests.post('https://api.econify.ai/v1/analyze', headers=headers, json=data)

if response.status_code == 200:
    print(response.json()['analysis'])
else:
    print(f"Error: {response.status_code}")
    `;

    return (
        <div className="py-12 md:py-20 animate-fade-in-up">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">Econify Developer API</h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Integrate powerful macroeconomic analysis directly into your applications.</p>
                </div>

                <div className="mt-16 space-y-12">
                    {/* Getting Started */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Getting Started</h2>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                            Our API provides programmatic access to Econify's core analysis engine. To get started, you'll need to generate an API key from your account settings.
                        </p>
                    </section>
                    
                    {/* Authentication */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Authentication</h2>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                            All API requests must be authenticated using a Bearer token in the Authorization header.
                        </p>
                        <CodeBlock language="bash">
                            {`Authorization: Bearer YOUR_API_KEY`}
                        </CodeBlock>
                    </section>

                    {/* Endpoint */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Endpoint: /analyze</h2>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                            The primary endpoint for generating analysis.
                        </p>
                        <div className="mt-2 font-mono text-sm inline-block px-2 py-1 rounded bg-econify-blue/10 text-econify-blue">
                            POST https://api.econify.ai/v1/analyze
                        </div>
                    </section>

                    {/* Code Examples */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Code Examples</h2>
                        
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mt-6">JavaScript (Fetch)</h3>
                        <CodeBlock language="javascript">{jsExample.trim()}</CodeBlock>
                        
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mt-6">Python (Requests)</h3>
                        <CodeBlock language="python">{pythonExample.trim()}</CodeBlock>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ApiPage;
