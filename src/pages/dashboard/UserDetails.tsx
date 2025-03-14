import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  Folder,
  Clock,
  Calendar,
  FileDown,
} from "lucide-react";
import dayjs from "dayjs";
import {
  Table,
  Card,
  Spin,
  Empty,
  Button,
  DatePicker,
  Typography,
  Form,
} from "antd";
import { Bar } from "react-chartjs-2";
import { supabase } from "../../lib/supabase";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import { saveAs } from "file-saver";

interface UserDetails {
  id: string;
  email: string;
  name: string;
  last_sign_in_at: string;
}

interface DownloadStats {
  totalDownloads: number;
  categoryStats: {
    category: string;
    count: number;
  }[];
  itemStats: {
    item_name: string;
    category: string;
    count: number;
    last_downloaded: string;
  }[];
  recentDownloads: {
    item_name: string;
    category: string;
    downloaded_at: string;
  }[];
}

interface MonthlyStats {
  month: string;
  downloads: number;
  views: number;
  logins: number;
}

interface Filters {
  dateRange: [Date | null, Date | null];
  category: string;
  search: string;
}

const UserDetails = () => {
  const [form] = Form.useForm();
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    dayjs().toDate()
  );
  const [stats, setStats] = useState<DownloadStats>({
    totalDownloads: 0,
    categoryStats: [],
    itemStats: [],
    recentDownloads: [],
  });

  const [filters, setFilters] = useState<Filters>({
    dateRange: [null, null],
    category: "",
    search: "",
  });
  const [filteredItemStats, setFilteredItemStats] = useState<
    typeof stats.itemStats
  >([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);

  const fetchUserDetails = async (month: any) => {
    // console.log("month", month);
    if (!userId) return;

    try {
      setLoading(true);

      // Fetch user details
      const { data: userData, error: userError } = await supabase
        .from("_users")
        .select("*")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      // Fetch download statistics
      // const { data: downloadsData, error: downloadsError } = await supabase
      //   .from("downloads")
      //   .select(
      //     `
      //     *,
      //     documents:document_id (
      //       name,
      //       category
      //     )
      //   `
      //   )
      //   .eq("user_id", userId);

      const { data: downloadsData, error: downloadsError } = await supabase
        .rpc("get_user_downloads", { p_user_id: userId, p_month: month })
        .range(0, 100000);
      // .gte(
      //   "created_at",
      //   new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      // );

      const { data: count, error: countERR } = await supabase.rpc(
        "get_user_download_count",
        {
          p_user_id: userId,
          p_month: selectedMonth?.getMonth() + 1, // March
          p_year: selectedMonth?.getFullYear(), // Year 2025
        }
      );

      // console.log("count", count);

      if (downloadsError) {
        console.error("Error fetching downloads:", downloadsError);
      }

      // Process monthly statistics
      const monthlyData = new Map<string, MonthlyStats>();

      const processMonthlyData = (
        data: any[],
        type: "downloads" | "views" | "logins"
      ) => {
        data.forEach((item) => {
          const date = new Date(item.created_at);
          const monthKey = date.toLocaleString("default", {
            month: "long",
            year: "numeric",
          });

          if (!monthlyData.has(monthKey)) {
            monthlyData.set(monthKey, {
              month: monthKey,
              downloads: 0,
              views: 0,
              logins: 0,
            });
          }

          const stats = monthlyData.get(monthKey)!;
          stats[type]++;
        });
      };

      processMonthlyData(downloadsData.data || [], "downloads");
      // processMonthlyData(viewsData.data || [], "views");
      // processMonthlyData(loginsData.data || [], "logins");

      setMonthlyStats(Array.from(monthlyData.values()));

      // Process statistics
      const categoryMap = new Map<string, number>();
      const itemMap = new Map<
        string,
        { count: number; category: string; last_downloaded: string }
      >();

      downloadsData.forEach((download) => {
        // console.log("download", download);
        const category = download?.document_category || "Uncategorized";
        const itemName = download?.document_name || "Unknown Document";

        // Update category stats
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);

        // Update item stats
        const existingItem = itemMap.get(itemName) || {
          count: 0,
          category,
          last_downloaded: download.created_at,
        };
        itemMap.set(itemName, {
          ...existingItem,
          count: existingItem.count + 1,
          last_downloaded:
            new Date(download.created_at) >
            new Date(existingItem.last_downloaded)
              ? download.created_at
              : existingItem.last_downloaded,
        });
      });

      setUser(userData);
      setStats({
        totalDownloads: count,
        categoryStats: Array.from(categoryMap.entries()).map(
          ([category, count]) => ({
            category,
            count,
          })
        ),
        itemStats: Array.from(itemMap.entries()).map(([item_name, stats]) => ({
          item_name,
          ...stats,
        })),

        recentDownloads: downloadsData
          .slice(0, 10)
          .map((download) => ({
            item_name: download?.document_name || "Unknown Document",
            category: download?.document_category || "Uncategorized",
            downloaded_at: download.created_at,
          }))
          .sort(
            (a, b) =>
              new Date(b.downloaded_at).getTime() -
              new Date(a.downloaded_at).getTime()
          ),
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    // console.log("selected month", );
    fetchUserDetails(selectedMonth?.getMonth() + 1);
    form.setFieldsValue({
      month: dayjs(selectedMonth),
    });
  }, [selectedMonth]);

  // Apply filters
  useEffect(() => {
    let filtered = [...stats.itemStats];

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.item_name.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply date range filter
    if (filters.dateRange[0] && filters.dateRange[1]) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.last_downloaded);
        return (
          itemDate >= filters.dateRange[0]! && itemDate <= filters.dateRange[1]!
        );
      });
    }

    setFilteredItemStats(filtered);
  }, [filters, stats.itemStats]);

  const resetFilters = () => {
    setFilters({
      dateRange: [null, null],
      category: "",
      search: "",
    });
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  if (!user && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty description="User not found" />
      </div>
    );
  }

  const categoryColumns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Downloads",
      dataIndex: "count",
      key: "count",
      sorter: (a: any, b: any) => a.count - b.count,
    },
  ];

  const itemColumns = [
    {
      title: "Document Name",
      dataIndex: "item_name",
      key: "item_name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Downloads",
      dataIndex: "count",
      key: "count",
      sorter: (a: any, b: any) => a.count - b.count,
    },
    {
      title: "Last Downloaded",
      dataIndex: "last_downloaded",
      key: "last_downloaded",
      render: (text: string) => new Date(text).toLocaleDateString(),
      sorter: (a: any, b: any) =>
        new Date(a.last_downloaded).getTime() -
        new Date(b.last_downloaded).getTime(),
    },
  ];

  const generateMonthlyReport = () => {
    if (!selectedMonth || !user) return;

    console.log("user", user);

    const monthYear = selectedMonth?.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(18);
    doc.text(`User Activity Report - ${monthYear}`, 14, 22);
    doc.setFontSize(11);
    doc.text(`User: ${user?.display_name}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 38);

    // Add monthly statistics
    // const monthStats = monthlyStats.find((stat) => stat.month === monthYear);

    doc.setFontSize(14);
    doc.text("Monthly Activity Summary", 14, 50);
    doc.setFontSize(11);
    doc.text(
      [
        `Total Downloads: ${stats?.totalDownloads}`,
        `Categories: ${stats?.categoryStats.length}`,
        // `Logins: ${monthStats.logins}`,
      ],
      14,
      60
    );

    // Add documents table
    const tableColumn = [
      "Document",
      "Category",
      "Downloads",
      "Last Downloaded",
    ];
    const tableRows = filteredItemStats.map((item) => [
      item.item_name,
      item.category,
      item.count,
      new Date(item.last_downloaded).toLocaleDateString(),
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      theme: "grid",
      styles: { fontSize: 9 },
    });

    doc.save(
      `${user?.display_name
        .toLowerCase()
        .replace(" ", "-")}-monthly-report-${monthYear
        .toLowerCase()
        .replace(" ", "-")}.pdf`
    );
  };

  const exportMonthlyCSV = () => {
    if (!selectedMonth || !user) return;

    const monthYear = selectedMonth.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    const monthStats = monthlyStats.find((stat) => stat.month === monthYear);

    const data = [
      {
        User: user.name,
        Email: user.email,
        Month: monthYear,
        Downloads: monthStats?.downloads || 0,
        Views: monthStats?.views || 0,
        Logins: monthStats?.logins || 0,
      },
    ];

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(
      blob,
      `${user?.display_name
        .toLowerCase()
        .replace(" ", "-")}-monthly-report-${monthYear
        .toLowerCase()
        .replace(" ", "-")}.csv`
    );
  };

  const chartData = {
    labels: stats.categoryStats.map((stat) => stat.category),
    datasets: [
      {
        label: "Downloads by Category",
        data: stats.categoryStats.map((stat) => stat.count),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/system_reports"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            User Activity Report{" "}
            {/* <Typography.Text
              className="text-3xl"
              style={{
                width: 150,
                padding: 0,
                margin: 0,
              }}
            >
              - {user ? user?.display_name : ""}
            </Typography.Text> */}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-3">
            <Form form={form}>
              <Form.Item name="month">
                <DatePicker.MonthPicker
                  onChange={(date) => setSelectedMonth(date?.toDate() || null)}
                  className="w-full"
                  style={{
                    width: 180,
                  }}
                />
              </Form.Item>
            </Form>

            <Button
              type="primary"
              icon={<FileDown size={16} />}
              onClick={() => {
                console.log("Monthly...");
                generateMonthlyReport();
              }}
              className="flex items-center gap-1"
            >
              Export PDF
            </Button>
            <Button
              icon={<Download size={16} />}
              onClick={() => {
                exportMonthlyCSV();
              }}
              className="flex items-center gap-1"
            >
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className="flex items-center justify-center"
          style={{
            height: "calc(100vh - 400px)",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Download className="text-blue-500" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Downloads</p>
                  <h3 className="text-2xl font-bold">{stats.totalDownloads}</h3>
                </div>
              </div>
            </Card>

            <Card className="shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Folder className="text-green-500" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Categories</p>
                  <h3 className="text-2xl font-bold">
                    {stats.categoryStats.length}
                  </h3>
                </div>
              </div>
            </Card>

            <Card className="shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FileText className="text-purple-500" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Unique Documents</p>
                  <h3 className="text-2xl font-bold">
                    {stats.itemStats.length}
                  </h3>
                </div>
              </div>
            </Card>

            <Card className="shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Clock className="text-orange-500" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Active</p>
                  <h3 className="text-lg font-bold">
                    {new Date(user.last_sign_in_at).toLocaleDateString()}
                  </h3>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card title="Downloads by Category" className="shadow-md">
              <div className="h-80">
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </Card>

            <Card title="Category Statistics" className="shadow-md">
              <Table
                columns={categoryColumns}
                dataSource={stats.categoryStats}
                pagination={false}
                rowKey="category"
              />
            </Card>
          </div>

          <Card title="Document Download Details" className="shadow-md mb-8">
            <Table
              columns={itemColumns}
              dataSource={stats.itemStats}
              pagination={{ pageSize: 10 }}
              rowKey="item_name"
            />
          </Card>

          <Card title="Recent Downloads" className="shadow-md">
            <div className="space-y-4">
              {stats.recentDownloads.map((download, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Download size={20} className="text-gray-500" />
                    <div>
                      <p className="font-medium">{download.item_name}</p>
                      <p className="text-sm text-gray-500">
                        {download.category}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(download.downloaded_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default UserDetails;
