import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { getRequest } from "../api/requests";
import ChatBot from "../components/ai_chatbot/ChatBot";

const AIChatbot = () => {
  const [isBotCreated, setIsBotCreated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkBotExists = async () => {
    try {
      // const res = await getRequest('/ai-chatbot/exists');
      // console.log("Check: ", res);

      setIsBotCreated(true);
      setLoading(false);
      
      // Show create modal only if bot doesn't exist
      // if (!res) {
      //   setShowCreateModal(true);
      // }
    } catch (error) {
      console.error("Error checking bot:", error);
      setLoading(false);
      // If there's an error, show modal anyway
      setShowCreateModal(true);
    }
  };

  useEffect(() => {
    checkBotExists();
  }, []);

  const createAIBot = async () => {
    try {
      // API call to create bot would go here
      // await postRequest('/ai-chatbot/create', {});
      setIsBotCreated(true);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating bot:", error);
    }
  };

  const handleSkipOrCancel = () => {
    setShowCreateModal(false);
    // Redirect to home page after a small delay for smooth transition
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-2xl flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl">🤖</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Render ChatBot directly - no wrapper */}
      {isBotCreated ? (
        <ChatBot />
      ) : (
        // When bot doesn't exist - show content that fits in layout
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <span className="text-white text-5xl">🤖</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              AI Parenting Assistant
            </h1>
            <div className="space-y-4 text-lg text-gray-600 max-w-xl mx-auto">
              <p>
                Get personalized parenting advice, vaccination reminders, and growth tracking all in one place.
              </p>
              <p>
                Create your AI assistant to get started with personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Portal to render modal at root level - this will blur entire app */}
      {showCreateModal && createPortal(
        <div className="fixed inset-0 z-50">
          {/* Blur overlay for entire app */}
          <div className="absolute inset-0 backdrop-blur-md bg-black/20"></div>
          
          {/* Create Bot Modal */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-md w-full relative">
              {/* Close button - redirects to home */}
              <button
                onClick={handleSkipOrCancel}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="w-20 h-20 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-4xl">✨</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Create Your AI Assistant
              </h2>
              
              <p className="text-gray-600 mb-8 text-center">
                Get personalized parenting help by creating your AI companion. 
                It will learn about your children and provide tailored advice.
              </p>
              
              <button
                onClick={createAIBot}
                className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full mb-3"
              >
                Create AI Assistant
              </button>
              
              <button
                onClick={handleSkipOrCancel}
                className="w-full text-gray-500 hover:text-gray-700 text-sm transition-colors py-3 hover:bg-gray-50 rounded-lg"
              >
                Skip and go to Home
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                  You can always create your AI assistant later from your profile
                </p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default AIChatbot;