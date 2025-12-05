import React, { useState, useEffect } from 'react';

interface LimitPageProps {
  onUnlock: () => void;
}

const LimitPage: React.FC<LimitPageProps> = ({ onUnlock }) => {
  const [timeLeft, setTimeLeft] = useState<string>("--:--:--");
  const [showDevInput, setShowDevInput] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
        const lastUsage = localStorage.getItem('talent_bridge_usage_timestamp');
        if (!lastUsage) return;

        const lastUsageTime = parseInt(lastUsage, 10);
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const targetTime = lastUsageTime + oneDayInMs;
        const now = Date.now();
        const difference = targetTime - now;

        if (difference > 0) {
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft(
                `${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        } else {
            setTimeLeft("00:00:00");
            localStorage.removeItem('talent_bridge_usage_timestamp');
            onUnlock();
        }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [onUnlock]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "Manoj007") {
        localStorage.removeItem('talent_bridge_usage_timestamp');
        onUnlock();
    } else {
        setError(true);
        // Reset error after animation
        setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#751A2B] opacity-20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#2E050D] opacity-20 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 max-w-sm w-full bg-[#1E1E1E] border border-gray-800 p-6 rounded-2xl shadow-xl">
            <div
                className="w-16 h-16 bg-orange-900/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg border border-orange-900/30 cursor-default"
            >
                ⏳
            </div>
            
            <h1 className="text-2xl font-bold mb-2 tracking-tight">Daily Limit Reached</h1>
            
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                To ensure service availability for everyone, we limit resume generation to <strong>one per day</strong> on this device.
            </p>
            
            <div className="bg-black/50 border border-gray-800 rounded-lg p-3 mb-4 text-left">
                <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Access Resets In</span>
                </div>
                <div className="text-3xl font-mono font-bold text-white tracking-widest text-center py-3 bg-[#2E050D] rounded-lg border border-[#4A0D18] shadow-inner">
                    {timeLeft}
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-center">
                    Please come back when the timer hits zero.
                </p>
            </div>

            <button 
                onClick={() => window.location.href = "https://www.google.com"}
                className="w-full py-2.5 bg-[#4A0D18] text-white font-bold rounded-lg hover:bg-[#5C1523] transition-all text-sm"
            >
                Return to Search
            </button>

            {!showDevInput ? (
                <button
                    onClick={() => setShowDevInput(true)}
                    className="mt-4 text-[10px] text-gray-600 hover:text-gray-400 underline transition-colors outline-none focus:outline-none block mx-auto"
                >
                    Developer Mode
                </button>
            ) : (
                <form onSubmit={handleUnlock} className="mt-4 flex flex-col items-center gap-2 w-full animate-fade-in-up">
                    <div className="flex w-full gap-2">
                        <input 
                            type="password" 
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="Enter Password"
                            className={`flex-1 bg-black/30 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-orange-500 transition-colors`}
                            autoFocus
                        />
                        <button 
                            type="submit"
                            className="bg-orange-900/40 text-orange-400 border border-orange-900/50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-900/60 transition-colors"
                        >
                            Unlock
                        </button>
                    </div>
                    {error && <span className="text-red-500 text-[10px]">Incorrect password</span>}
                    <button 
                        type="button" 
                        onClick={() => {
                            setShowDevInput(false);
                            setError(false);
                            setPasswordInput("");
                        }}
                        className="text-[9px] text-gray-600 hover:text-gray-400 mt-1"
                    >
                        Cancel
                    </button>
                </form>
            )}
        </div>
        <style>{`
            .animate-fade-in-up {
                animation: fadeInUp 0.3s ease-out forwards;
                opacity: 0;
                transform: translateY(5px);
            }
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `}</style>
    </div>
  );
};

export default LimitPage;