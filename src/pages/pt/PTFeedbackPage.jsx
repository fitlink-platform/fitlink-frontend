import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "~/contexts/AuthContext";
import { getFeedbackByPT } from "~/services/notificationService";
import { Star } from "lucide-react";
import FeedbackItem from "~/components/FeedbackItem";
import PTMainLayout from "~/layouts/pt/PTMainLayout";  // Import PTMainLayout

export default function PTFeedbackPage() {
  const { user } = useContext(AuthContext);  // Lấy thông tin người dùng đã đăng nhập
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFeedbacks = async () => {
      if (!user || !user._id) {
        setError("User not found or not logged in.");
        setLoading(false);
        return;
      }

      try {
        const res = await getFeedbackByPT(user._id);
        setFeedbacks(res.data || []);
      } catch (err) {
        console.error("❌ Error loading feedbacks:", err);
        setError("Failed to load feedbacks. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadFeedbacks();
  }, [user]);

  return (
    <PTMainLayout>
      {/* Content */}
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-7 h-7 text-orange-500" />
            <h1 className="text-3xl font-bold text-white">
              Your Feedbacks
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20 text-gray-400">
              Loading feedbacks...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p>{error}</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <Star className="w-10 h-10 mx-auto mb-3 text-orange-400" />
              <p>No feedback yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <FeedbackItem key={feedback._id} feedback={feedback} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PTMainLayout>
  );
}
