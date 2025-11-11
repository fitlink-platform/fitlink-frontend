import { useParams, useNavigate } from "react-router-dom"; // Lấy useNavigate để quay lại
import { useEffect, useState } from "react";
import { getFeedbackByPT } from "~/services/notificationService";
import FeedbackItem from "~/components/FeedbackItem";
import { FaStar } from "react-icons/fa"; 

export default function AdminFeedbackPage() {
  const { id } = useParams(); // Lấy id PT từ URL
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Khai báo useNavigate để sử dụng điều hướng

  // Hàm để quay lại trang trước
  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  useEffect(() => {
    console.log("Loading feedbacks for PT:", id); // Log id để kiểm tra
    const loadFeedbacks = async () => {
      try {
        const res = await getFeedbackByPT(id); // Lấy feedback của PT theo id
        setFeedbacks(res.data || []); // Lưu dữ liệu feedback vào state
      } catch (err) {
        console.error("Error loading feedbacks:", err);
      } finally {
        setLoading(false); // Đổi trạng thái loading khi hoàn thành
      }
    };
    if (id) {
      loadFeedbacks();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-8 transition-all">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={handleGoBack} // Xử lý quay lại
            className="text-orange-500 hover:text-orange-400 transition duration-300"
          >
            &#8592; Back {/* Icon mũi tên quay lại */}
          </button>
          <FaStar className="w-7 h-7 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-100">All Feedbacks for PT</h1>
        </div>

        {/* Loading or Feedback List */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-400">
            Loading feedbacks...
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <FaStar className="w-10 h-10 mx-auto mb-3 text-orange-400" />
            <p>No feedbacks available for this PT.</p>
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
  );
}
