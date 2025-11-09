import MainLayout from "~/layouts/MainLayout";
import ChatAIWindow from "~/components/chat/ChatAIWindow";

export default function AIChatPage() {
  return (
    <MainLayout>
      <div className="pt-[100px] px-6 pb-10 bg-gray-50 min-h-screen">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            🤖 Chat với trợ lý AI
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Hỏi về lịch tập, chế độ ăn, recovery… AI sẽ gợi ý dựa trên kiến thức huấn luyện viên.
          </p>
        </div>

        <div className="max-w-5xl mx-auto h-[70vh]">
          <ChatAIWindow />
        </div>
      </div>
    </MainLayout>
  );
}
