<div className="max-w-7xl mx-auto">
      

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 px-3 sm:px-4 lg:px-6">
          <div className="lg:w-1/4">
            <div className="lg:hidden mb-4">
              <details className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                
                  <CommunityLeftSidebar />
              </details>
            </div> 
            {/* Desktop Left Sidebar */}
            <div className="hidden lg:block sticky top-16">
              <CommunityLeftSidebar />
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-4 sm:mb-6">
              <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-b border-[#e5989b]/20">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Community Feed</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Share your parenting journey</p>
              </div>
              <div className="p-4 sm:p-5">
                <CommunityCenter />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Mobile: hidden, Desktop: 1/4 */}
          <div className="lg:w-1/4">
            {/* Mobile Toggle for Right Sidebar */}
            <div className="lg:hidden mb-4">
              <details className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <summary className="px-4 py-3 bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-b border-[#e5989b]/20 cursor-pointer list-none">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Community Info</h3>
                    <svg 
                      className="w-5 h-5 text-[#e5989b] transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>
                <div className="p-4">
                  <CommunityRightSidebar />
                </div>
              </details>
            </div>
            
            {/* Desktop Right Sidebar */}
            <div className="hidden lg:block sticky top-6">
              <CommunityRightSidebar />
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-50">
          <div className="flex justify-around items-center">
            <button className="flex flex-col items-center text-[#e5989b]">
              <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-xs font-medium">Home</span>
            </button>
            <button className="flex flex-col items-center text-gray-400 hover:text-[#e5989b]">
              <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              <span className="text-xs font-medium">Chats</span>
            </button>
            <button className="flex flex-col items-center text-gray-400 hover:text-[#e5989b]">
              <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="text-xs font-medium">Groups</span>
            </button>
            <button className="flex flex-col items-center text-gray-400 hover:text-[#e5989b]">
              <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 006 10a6 6 0 0112 0c0 .459-.031.909-.086 1.333A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Create Post Button */}
      <button className="lg:hidden fixed bottom-20 right-4 w-12 h-12 bg-[#e5989b] text-white rounded-full shadow-lg hover:bg-[#d88a8d] transition-colors flex items-center justify-center z-50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>