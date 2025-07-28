import { useState, useEffect } from "react";
import { Shield, ShieldAlert, Clock, ScrollText } from "lucide-react";

export default function App() {
  const [alert, setAlert] = useState(false);
  const [time, setTime] = useState("");
  const [history, setHistory] = useState([]); // سجل التسللات

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:3001/status")
        .then((res) => res.json())
        .then((data) => {
          console.log("Data from server:", data);

          setTime(data.time);

          if (data.alert && !alert) {
            // إذا حصل تسلل جديد (من false إلى true)
            setHistory((prev) => [
              { time: data.time, message: "🚨 تم اكتشاف سارق" },
              ...prev,
            ]);
          }

          setAlert(data.alert);
        })
        .catch((err) => console.error("Fetch error:", err));
    }, 1000);
    return () => clearInterval(interval);
  }, [alert]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* Header */}
      <div className="w-full bg-black/20 backdrop-blur-sm border-b border-gray-700/50 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
          <Shield className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            نظام كشف التسلل
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-6xl mx-auto">
        {/* Main Status Panel */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl w-full max-w-md">
            {/* Status Icon and Message */}
            <div className="flex flex-col items-center mb-6">
              {alert ? (
                <div className="flex flex-col items-center animate-pulse">
                  <div className="relative">
                    <ShieldAlert className="w-24 h-24 text-red-500 animate-bounce" />
                    <div className="absolute inset-0 w-24 h-24 bg-red-500/20 rounded-full animate-ping"></div>
                  </div>
                  <p className="text-red-400 text-xl font-bold mt-4 animate-bounce">
                    🚨 تم اكتشاف سارق!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Shield className="w-24 h-24 text-green-400" />
                    <div className="absolute inset-0 w-24 h-24 bg-green-400/10 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-green-400 text-xl font-bold mt-4">
                    ✅ كل شيء عادي
                  </p>
                </div>
              )}
            </div>

            {/* Last Update Time */}
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
              <Clock className="w-4 h-4" />
              <span>آخر تحديث: {time}</span>
            </div>
          </div>
        </div>

        {/* History Panel */}
        <div className="flex-1 max-w-lg">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl h-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-6 border-b border-gray-700/50">
              <ScrollText className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-gray-100">📜 سجل التسللات</h2>
            </div>

            {/* Content */}
            <div className="p-6">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                    <ScrollText className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">لا توجد أحداث مسجلة</p>
                  <p className="text-gray-500 text-sm mt-2">سيتم عرض التسللات المكتشفة هنا</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {history.map((event, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-mono text-sm">
                              {event.time}
                            </span>
                          </div>
                          <p className="text-gray-200 text-sm">{event.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
}