import { useEffect, useState } from "react";
import { Search, PlayCircle } from "lucide-react";
import { getRequest } from "../api/requests";

interface VideoTutorial {
  id: string;
  name: string;
  url: string;
  category?: string;
}

const Tutorials = () => {
  const [tutorials, setTutorials] = useState<VideoTutorial[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const res = await getRequest("/api/video-tutorials/all");
      setTutorials(res);
    } catch (err) {
      console.error("Failed to load tutorials", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTutorials = tutorials.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.category && t.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gentle Video Guidance 🌸
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explore expert-led tutorials designed to support you through every step of motherhood.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-10 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tutorials (feeding, sleep, recovery...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e5989b]/30 focus:border-[#e5989b]"
          />
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-gray-500">Loading tutorials...</p>
        ) : filteredTutorials.length === 0 ? (
          <div className="text-gray-500 bg-white rounded-xl p-6 shadow-sm border">
            No tutorials found. Try a different keyword 💗
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div className="aspect-video rounded-t-2xl overflow-hidden bg-[#fde2e4]">
                  <iframe
                    src={tutorial.url}
                    title={tutorial.name}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-800">
                      {tutorial.name}
                    </h3>
                    <PlayCircle className="w-5 h-5 text-[#e5989b] flex-shrink-0" />
                  </div>

                  {tutorial.category && (
                    <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-[#fde2e4] text-[#b56576]">
                      {tutorial.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorials;
