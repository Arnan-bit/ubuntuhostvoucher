'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class RequestPageErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Request Page Error:', error, errorInfo);
        this.setState({ error, errorInfo });
        
        // Log error to monitoring service (if available)
        if (typeof window !== 'undefined') {
            // You can integrate with error tracking services here
            // e.g., Sentry, LogRocket, etc.
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                        <div className="text-center">
                            {/* Error Icon */}
                            <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangle className="w-12 h-12 text-red-500" />
                            </div>

                            {/* Error Title */}
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Oops! Something went wrong
                            </h1>

                            {/* Error Description */}
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                                We encountered an error while loading the request page. 
                                Don't worry, this is usually temporary and can be fixed easily.
                            </p>

                            {/* Error Details (in development) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        Error Details:
                                    </h3>
                                    <pre className="text-sm text-red-600 dark:text-red-400 overflow-auto">
                                        {this.state.error.message}
                                    </pre>
                                    {this.state.errorInfo && (
                                        <details className="mt-2">
                                            <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                                                Stack Trace
                                            </summary>
                                            <pre className="text-xs text-gray-500 dark:text-gray-500 mt-2 overflow-auto">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={this.handleRetry}
                                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Try Again
                                </button>
                                
                                <button
                                    onClick={this.handleGoHome}
                                    className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    <Home className="w-5 h-5" />
                                    Go Home
                                </button>
                            </div>

                            {/* Help Text */}
                            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="font-semibold">Need Help?</span>
                                </div>
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    If this problem persists, please contact our support team or try accessing the page later.
                                </p>
                            </div>

                            {/* Common Solutions */}
                            <div className="mt-6 text-left">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                    Common Solutions:
                                </h3>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">•</span>
                                        <span>Refresh the page or try again in a few moments</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">•</span>
                                        <span>Clear your browser cache and cookies</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">•</span>
                                        <span>Check your internet connection</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-1">•</span>
                                        <span>Try using a different browser or incognito mode</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// HOC wrapper for easier usage
export const withRequestPageErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>
) => {
    const WrappedComponent = (props: P) => (
        <RequestPageErrorBoundary>
            <Component {...props} />
        </RequestPageErrorBoundary>
    );
    
    WrappedComponent.displayName = `withRequestPageErrorBoundary(${Component.displayName || Component.name})`;
    
    return WrappedComponent;
};
