import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Users,
  Eye,
  Calendar,
  FileDown,
  UserCheck,
  BarChart3,
  PieChart,
  LineChart,
  Search,
} from "lucide-react";
import { Tabs, DatePicker, Table, Button, Select } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";
import { fetchUsers } from "../../lib/users";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;

const Statistics = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState([null, null]);
  const [chartType, setChartType] = useState("bar");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    downloads: [],
    logins: [],
    views: [],
    userStats: [],
  });
  const [popularDocs, setPopularDocs] = useState([]);
  const [searchMetrics, setSearchMetrics] = useState({
    totalSearches: 0,
    topSearchTerms: [],
    averageSearchTime: 0,
  });
  const [categoryMetrics, setCategoryMetrics] = useState([]);

  const mockPopularDocs = [
    {
      document_id: 1,
      documents: {
        title: "Supreme Court Judgment 2023/001",
        category: "Judgments",
        subcategory: "Supreme Court",
      },
      count: 245,
    },
    {
      document_id: 2,
      documents: {
        title: "Companies Act 2012",
        category: "Legislation",
        subcategory: "Acts",
      },
      count: 189,
    },
    {
      document_id: 3,
      documents: {
        title: "Parliamentary Proceedings March 2024",
        category: "Hansards",
        subcategory: "Parliament",
      },
      count: 156,
    },
    {
      document_id: 4,
      documents: {
        title: "Constitutional Amendment Bill 2024",
        category: "Bills",
        subcategory: "Constitutional",
      },
      count: 134,
    },
    {
      document_id: 5,
      documents: {
        title: "Legal Notice No. 45 of 2024",
        category: "Legal Notices",
        subcategory: "2024",
      },
      count: 98,
    },
  ];

  // Mock search metrics
  const mockSearchMetrics = {
    totalSearches: 1247,
    topSearchTerms: [
      { term: "company registration", count: 89 },
      { term: "land law", count: 76 },
      { term: "criminal procedure", count: 65 },
      { term: "constitutional rights", count: 54 },
      { term: "civil procedure", count: 48 },
    ],
    averageSearchTime: 2.3,
  };

  // Mock category metrics
  const mockCategoryMetrics = [
    { category: "Judgments", count: 1245 },
    { category: "Legislation", count: 867 },
    { category: "Hansards", count: 543 },
    { category: "Legal Notices", count: 432 },
    { category: "Bills", count: 234 },
    { category: "Gazettes", count: 189 },
  ];

  useEffect(() => {
    setPopularDocs(mockPopularDocs);
    setSearchMetrics(mockSearchMetrics);
    setCategoryMetrics(mockCategoryMetrics);
  }, []);

  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        // Fetch downloads data
        // const { data: downloadsData, error: downloadsError } = await supabase
        //   .from("downloads")
        //   .select("*")
        const { data: downloadsData, error: downloadsError } = await supabase
          .from("downloads")
          .select("*")
          .gte(
            "created_at",
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          );

        // console.log("downloads", downloadsData);

        if (downloadsError) throw downloadsError;

        // Fetch logins data
        const { data: loginsData, error: loginsError } = await supabase
          .from("user_logins")
          .select("*");

        // console.log("loginsData", loginsData);

        if (loginsError) throw loginsError;

        // Fetch views data
        const { data: viewsData, error: viewsError } = await supabase
          .from("document_views")
          .select("*");

        // console.log("viewsData", viewsData);

        if (viewsError) throw viewsError;

        // Fetch user data
        // const { data: userData, error: userError } = await supabase
        //   .from("_users")
        //   .select("*");

        const userData = await fetchUsers();

        // console.log("userData", userData);

        // if (userError) throw userError;

        // Process user statistics
        const userStats = userData.map((user) => {
          const userDownloads = downloadsData.filter(
            (d) => d.user_id === user.id
          ).length;
          const userLogins = loginsData.filter(
            (l) => l.user_id === user.id
          ).length;
          const userViews = viewsData.filter(
            (v) => v.user_id === user.id
          ).length;

          return {
            id: user.id,
            name: user.name || user.email,
            email: user.email,
            downloads: userDownloads,
            logins: userLogins,
            views: userViews,
            lastActive: user.lastLogin || "N/A",
          };
        });

        setStats({
          downloads: downloadsData || [],
          logins: loginsData || [],
          views: viewsData || [],
          userStats,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
        // Use mock data for demonstration
        const mockUserStats = [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            downloads: 45,
            logins: 23,
            views: 120,
            lastActive: "2023-04-15",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            downloads: 32,
            logins: 18,
            views: 87,
            lastActive: "2023-04-14",
          },
          {
            id: 3,
            name: "Robert Johnson",
            email: "robert@example.com",
            downloads: 67,
            logins: 34,
            views: 156,
            lastActive: "2023-04-16",
          },
          {
            id: 4,
            name: "Emily Davis",
            email: "emily@example.com",
            downloads: 21,
            logins: 12,
            views: 63,
            lastActive: "2023-04-13",
          },
          {
            id: 5,
            name: "Michael Wilson",
            email: "michael@example.com",
            downloads: 54,
            logins: 28,
            views: 142,
            lastActive: "2023-04-15",
          },
        ];

        setStats({
          downloads: Array(30)
            .fill(0)
            .map((_, i) => ({
              id: i,
              created_at: new Date(Date.now() - i * 86400000).toISOString(),
              user_id: Math.floor(Math.random() * 5) + 1,
            })),
          logins: Array(50)
            .fill(0)
            .map((_, i) => ({
              id: i,
              created_at: new Date(Date.now() - i * 86400000).toISOString(),
              user_id: Math.floor(Math.random() * 5) + 1,
            })),
          views: Array(100)
            .fill(0)
            .map((_, i) => ({
              id: i,
              created_at: new Date(Date.now() - i * 86400000).toISOString(),
              user_id: Math.floor(Math.random() * 5) + 1,
            })),
          userStats: mockUserStats,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  useEffect(() => {
    const fetchExtendedStatistics = async () => {
      try {
        // Fetch popular documents
        const { data: popularDocsData } = await supabase
          .from("document_views")
          .select(
            `
            document_id,
            documents (
              title,
              category,
              subcategory
            ),
            count
          `
          )
          .group("document_id")
          .order("count", { ascending: false })
          .limit(10);

        // Fetch search metrics
        const { data: searchData } = await supabase
          .from("search_logs")
          .select("*")
          .gte(
            "created_at",
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          );

        // Fetch category metrics
        const { data: categoryData } = await supabase
          .from("documents")
          .select("category, subcategory")
          .count();

        setPopularDocs(popularDocsData || []);
        setSearchMetrics({
          totalSearches: searchData?.length || 0,
          topSearchTerms: processSearchTerms(searchData),
          averageSearchTime: calculateAverageSearchTime(searchData),
        });
        setCategoryMetrics(categoryData || []);
      } catch (error) {
        console.error("Error fetching extended statistics:", error);
      }
    };

    fetchExtendedStatistics();
  }, []);

  // Prepare chart data
  const prepareChartData = () => {
    // Group data by date
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const downloadsByDate = {};
    const loginsByDate = {};
    const viewsByDate = {};

    last7Days.forEach((date) => {
      downloadsByDate[date] = 0;
      loginsByDate[date] = 0;
      viewsByDate[date] = 0;
    });

    stats.downloads.forEach((download) => {
      const date = new Date(download.created_at).toISOString().split("T")[0];
      if (last7Days.includes(date)) {
        downloadsByDate[date] = (downloadsByDate[date] || 0) + 1;
      }
    });

    stats.logins.forEach((login) => {
      const date = new Date(login.created_at).toISOString().split("T")[0];
      if (last7Days.includes(date)) {
        loginsByDate[date] = (loginsByDate[date] || 0) + 1;
      }
    });

    stats.views.forEach((view) => {
      const date = new Date(view.created_at).toISOString().split("T")[0];
      if (last7Days.includes(date)) {
        viewsByDate[date] = (viewsByDate[date] || 0) + 1;
      }
    });

    return {
      labels: last7Days,
      datasets: [
        {
          label: "Downloads",
          data: last7Days.map((date) => downloadsByDate[date]),
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          borderColor: "rgb(53, 162, 235)",
          borderWidth: 1,
        },
        {
          label: "Logins",
          data: last7Days.map((date) => loginsByDate[date]),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 1,
        },
        {
          label: "Views",
          data: last7Days.map((date) => viewsByDate[date]),
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          borderColor: "rgb(153, 102, 255)",
          borderWidth: 1,
        },
      ],
    };
  };

  const preparePieData = () => {
    const totalDownloads = stats.downloads.length;
    const totalLogins = stats.logins.length;
    const totalViews = stats.views.length;

    return {
      labels: ["Downloads", "Logins", "Views"],
      datasets: [
        {
          data: [totalDownloads, totalLogins, totalViews],
          backgroundColor: [
            "rgba(53, 162, 235, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
          borderColor: [
            "rgb(53, 162, 235)",
            "rgb(75, 192, 192)",
            "rgb(153, 102, 255)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Export functions
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Educite User Statistics Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Add table
    const tableColumn = [
      "User",
      "Email",
      "Downloads",
      "Logins",
      "Views",
      "Last Active",
    ];
    const tableRows = stats.userStats.map((user) => [
      user.name,
      user.email,
      user.downloads,
      user.logins,
      user.views,
      new Date(user.lastActive).toLocaleDateString(),
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 9 },
    });

    doc.save("educite-statistics-report.pdf");
  };

  const exportToCSV = () => {
    const data = stats.userStats.map((user) => ({
      Name: user.name,
      Email: user.email,
      Downloads: user.downloads,
      Logins: user.logins,
      Views: user.views,
      LastActive: new Date(user.lastActive).toLocaleDateString(),
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "educite-statistics-report.csv");
  };

  // Table columns
  const userColumns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text: string, record: any) => (
        <Button
          type="link"
          onClick={() => navigate(`/dashboard/user/${record.id}`)}
          className="text-left"
          size="small"
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Downloads",
      dataIndex: "downloads",
      key: "downloads",
      sorter: (a, b) => a.downloads - b.downloads,
    },
    {
      title: "Logins",
      dataIndex: "logins",
      key: "logins",
      sorter: (a, b) => a.logins - b.logins,
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: "Last Active",
      dataIndex: "lastActive",
      key: "lastActive",
      render: (text) => new Date(text).toDateString(),
      sorter: (a, b) =>
        new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime(),
    },
  ];

  useEffect(() => {
    const fetchExtendedStatistics = async () => {
      try {
        // Fetch most viewed documents using RPC
        const { data: viewsData, error: viewsError } = await supabase.rpc(
          "get_document_view_stats"
        );

        if (viewsError) throw viewsError;

        // Fetch search metrics using RPC
        const { data: searchTermData, error: searchError } = await supabase.rpc(
          "get_search_term_stats"
        );

        if (searchError) throw searchError;

        // Get total searches count
        const { count: totalSearches, error: searchCountError } = await supabase
          .from("search_logs")
          .select("*", { count: "exact", head: true })
          .gte(
            "created_at",
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          );

        if (searchCountError) throw searchCountError;

        // Fetch category distribution using RPC
        const { data: categoryData, error: categoryError } = await supabase.rpc(
          "get_category_distribution"
        );

        if (categoryError) throw categoryError;

        // Transform the data to match your component's expected format
        const transformedViewsData = viewsData.map((doc) => ({
          document_id: doc.document_id,
          documents: {
            title: doc.title,
            category: doc.category,
            subcategory: doc.subcategory,
          },
          count: Number(doc.view_count),
        }));

        const transformedSearchTerms = searchTermData.map((term) => ({
          term: term.search_term,
          count: Number(term.count),
        }));

        console.log("first", {
          transformedViewsData,
          totalSearches: totalSearches || 0,
          topSearchTerms: transformedSearchTerms,
          averageSearchTime: 0,
          categoryData,
        });

        setPopularDocs(transformedViewsData);
        setSearchMetrics({
          totalSearches: totalSearches || 0,
          topSearchTerms: transformedSearchTerms,
          averageSearchTime: 0, // You might want to add this to your RPC if needed
        });
        setCategoryMetrics(
          categoryData.map((cat) => ({
            category: cat.category,
            count: Number(cat.count),
          }))
        );
      } catch (error) {
        console.error("Error fetching extended statistics:", error);
        // Fallback to mock data
        setPopularDocs(mockPopularDocs);
        setSearchMetrics(mockSearchMetrics);
        setCategoryMetrics(mockCategoryMetrics);
      }
    };

    fetchExtendedStatistics();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          {/* <Link to="/" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={24} />
          </Link> */}
          <h1 className="text-3xl font-bold text-gray-800">
            Statistics & Reports
          </h1>
        </div>
        <div className="flex gap-3">
          <Button
            type="primary"
            icon={<FileDown size={16} />}
            onClick={exportToPDF}
            className="flex items-center gap-1"
          >
            Export PDF
          </Button>
          <Button
            icon={<Download size={16} />}
            onClick={exportToCSV}
            className="flex items-center gap-1"
          >
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Downloads</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.downloads.length}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Download className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        {/* New metrics */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Searches</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {searchMetrics.totalSearches}
              </h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Search className="text-amber-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Logins</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.logins.length}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UserCheck className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Views</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.views.length}
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Eye className="text-purple-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Most Viewed Documents</h2>
          <div className="space-y-4">
            {popularDocs.map((doc, index) => (
              <div
                key={doc.document_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <span className="text-lg font-semibold text-gray-500 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    {/* <Tooltip title={doc.documents.title}> */}
                    <p className="font-medium truncate">
                      {doc.documents.title}
                    </p>
                    {/* </Tooltip> */}
                    <p className="text-sm text-gray-500 truncate">
                      {doc.documents.category}
                    </p>
                  </div>
                </div>
                <span className="text-blue-600 font-semibold flex-shrink-0 ml-4">{doc.count} views</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Top Search Terms</h2>
          <div className="space-y-4">
            {searchMetrics.topSearchTerms.map((term, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium">{term.term}</span>
                <span className="text-gray-600">{term.count} searches</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Document Distribution by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryMetrics.map((category) => (
            <div key={category.category} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800">{category.category}</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {category.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Select
              defaultValue="bar"
              style={{ width: 120 }}
              onChange={setChartType}
            >
              <Option value="bar">Bar Chart</Option>
              <Option value="line">Line Chart</Option>
              <Option value="pie">Pie Chart</Option>
            </Select>
          </div>
          <RangePicker
            onChange={(dates) => setDateRange(dates)}
            className="w-full md:w-auto"
          />
        </div>

        <div className="h-80">
          {chartType === "bar" && (
            <Bar
              data={prepareChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Activity Over Last 7 Days",
                  },
                },
              }}
            />
          )}
          {chartType === "line" && (
            <Line
              data={prepareChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Activity Trends Over Last 7 Days",
                  },
                },
              }}
            />
          )}
          {chartType === "pie" && (
            <Pie
              data={preparePieData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Activity Distribution",
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">User Activity Report</h2>
        <Table
          columns={userColumns}
          dataSource={stats.userStats.map((user) => ({
            ...user,
            key: user.id,
          }))}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default Statistics;
