import React from 'react';
import { Joyride, STATUS } from 'react-joyride';
import { useApp } from '../context/AppContext';
import { X, LayoutDashboard, Wallet, Sparkles, MessageSquare } from 'lucide-react';

const CustomTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  skipProps,
  size
}) => {
  return (
    <div
      {...tooltipProps}
      className="bg-[#0f172a]/95 border border-indigo-500/30 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.25)] max-w-sm w-full p-6 text-white backdrop-blur-md animate-fade-in relative z-[9999]"
    >
      <button
        {...skipProps}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        title="Skip Tour"
      >
        <X size={16} />
      </button>

      <div className="flex items-center gap-3 mb-3">
        {step.icon && <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">{step.icon}</div>}
        <h4 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">{step.title}</h4>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed mb-6">
        {step.content}
      </p>

      <div className="flex items-center justify-between">
        {/* Step Indicator */}
        <span className="text-xs text-gray-400 font-medium">
          Step {index + 1} of {size}
        </span>

        <div className="flex gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-all duration-200"
            >
              Back
            </button>
          )}
          <button
            {...primaryProps}
            className="px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all duration-200"
          >
            {index === size - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function OnboardingTour() {
  const { user, completeTour } = useApp();

  // If user has completed tour, or is not logged in, don't show
  if (!user || user.has_completed_tour) {
    return null;
  }

  const steps = [
    {
      target: '#tour-sidebar',
      title: 'Navigation Center',
      content: 'Access all aspects of your financial journey from here—Dashboard, Transactions, Portfolio, AI Advisor, and News.',
      icon: <LayoutDashboard size={20} />,
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '#tour-summary',
      title: 'Financial Health at a Glance',
      content: 'Monitor your total net worth, monthly spending, monthly income, and remaining budget dynamically.',
      icon: <Wallet size={20} />,
      placement: 'bottom',
    },
    {
      target: '#tour-advisor',
      title: 'FinPilot AI Advisor',
      content: 'Get personalized, intelligent financial recommendations, warnings, and tips customized to your spending patterns.',
      icon: <Sparkles size={20} />,
      placement: 'bottom',
    },
    {
      target: '#tour-transactions',
      title: 'Track Expenses',
      content: 'View, add, modify, or delete your transaction records. Try uploading bills or receipts to auto-populate!',
      icon: <MessageSquare size={20} />,
      placement: 'left',
    }
  ];

  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      completeTour();
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      steps={steps}
      continuous
      showSkipButton
      showProgress
      tooltipComponent={CustomTooltip}
      styles={{
        options: {
          arrowColor: '#0f172a',
          overlayColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 9999
        },
        spotlight: {
          borderRadius: '16px',
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.75), 0 0 15px rgba(99,102,241,0.5)'
        }
      }}
    />
  );
}
