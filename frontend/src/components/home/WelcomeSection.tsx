interface WelcomeSectionProps {
  firstName?: string;
}

const WelcomeSection = ({ firstName }: WelcomeSectionProps) => (
  <div className="mb-6 sm:mb-8 text-center sm:text-left">
    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#e5989b]/20 shadow-sm mb-3">
      <div className="w-1.5 h-1.5 bg-[#e5989b] rounded-full animate-pulse mr-1.5"></div>
      <span className="text-xs sm:text-sm text-gray-600">Parenting Dashboard</span>
    </div>
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
      Welcome back,{" "}
      <span className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] bg-clip-text text-transparent">
        {firstName}
      </span>
      !
    </h1>
    <p className="text-base sm:text-lg text-gray-700 max-w-2xl">
      Here's your parenting dashboard for today. Track your children's growth and milestones in one place.
    </p>
  </div>
);

export default WelcomeSection;