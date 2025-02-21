import { ReactNode, useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  LayoutDashboard,
  LogOut,
  BookOpen,
  Gavel,
  FileSpreadsheet,
  Users,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Settings,
  PieChart,
  Upload,
  Bell,
  User,
  Menu,
  X,
  Activity,
  CreditCard,
  Search,
  Filter,
  Calendar,
  Tag,
  FileType,
  Download,
  Plus,
  Archive,
  ChevronRight,
  Eye,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Library,
  FolderArchive,
  GraduationCap,
  BarChart2,
  FileQuestion,
  Info,
  Building2,
  Globe,
  Book,
  Scroll,
  FileArchive,
  FileBarChart,
  LogIn,
  List,
} from "lucide-react";
import { Button } from "./ui/Button";
import EduciteLogo from "../../assets/imgs/educite-logo.png";
import AppContext from "../context/AppContext";
import { supabase } from "../lib/supabase";

interface LayoutProps {
  children: ReactNode;
}

function DashboardLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigationItems = [
    {
      name: "Document Management",
      items: [
        {
          name: "View Judgments",
          href: "/dashboard/documents/judgments",
          icon: Gavel,
        },
        {
          name: "View Legislation",
          href: "/dashboard/documents/legislation",
          icon: Scroll,
        },
        {
          name: "View Hansards",
          href: "/dashboard/documents/hansards",
          icon: BookOpen,
        },
        {
          name: "View Gazettes",
          href: "/dashboard/documents/gazettes",
          icon: FileSpreadsheet,
        },
        {
          name: "View Acts of Parliament",
          href: "/dashboard/documents/acts",
          icon: FileText,
        },
        {
          name: "View Statutory Instruments",
          href: "/dashboard/documents/statutory",
          icon: FileSpreadsheet,
        },
        {
          name: "View 7th Revised Edition",
          href: "/dashboard/documents/revised-edition",
          icon: Library,
        },
        {
          name: "View Documents",
          href: "/dashboard/documents",
          icon: FileText,
        },
        {
          name: "Upload Document",
          href: "/dashboard/documents/upload",
          icon: Upload,
        },
        {
          name: "Manage Categories",
          href: "/dashboard/documents/categories",
          icon: Tag,
        },
      ],
    },
    {
      name: "User Management",
      items: [
        { name: "View Users", href: "/dashboard/users", icon: Users },
        { name: "Add User", href: "/dashboard/users/add", icon: Plus },
        {
          name: "Roles & Permissions",
          href: "/dashboard/users/roles",
          icon: Settings,
        },
        {
          name: "Active/Inactive Users",
          href: "/dashboard/users/status",
          icon: Activity,
        },
      ],
    },
    {
      name: "Subscription Management",
      items: [
        {
          name: "View Subscriptions",
          href: "/dashboard/subscriptions",
          icon: CreditCard,
        },
        {
          name: "Subscription Plans",
          href: "/dashboard/subscriptions/plans",
          icon: FileText,
        },
        {
          name: "Payment Transactions",
          href: "/dashboard/subscriptions/transactions",
          icon: Activity,
        },
        {
          name: "Expired Subscriptions",
          href: "/dashboard/subscriptions/expired",
          icon: Archive,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          <div
            className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setSidebarOpen(false)}
          />

          <div
            className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-900 transition ease-in-out duration-300 transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-black" />
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center px-4">
              <Link to="/" className="flex items-center">
                {/* Logo */}
                <img src={EduciteLogo} alt="Educ" className="h-8 w-auto" />
              </Link>
            </div>

            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-8">
                {navigationItems.map((section) => (
                  <div key={section.name}>
                    <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {section.name}
                    </h3>
                    <div className="mt-2 space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={`
                              group flex items-center px-3 py-2 text-sm font-medium rounded-md
                              ${
                                isActive
                                  ? "bg-gray-800 text-white"
                                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                              }
                            `}
                          >
                            <Icon
                              className={`
                              mr-3 h-5 w-5
                              ${
                                isActive
                                  ? "text-white"
                                  : "text-gray-400 group-hover:text-white"
                              }
                            `}
                            />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-800 lg:bg-gray-900 lg:pt-5 lg:pb-4">
        <div className="flex items-center flex-shrink-0 px-6">
          <Link to="/" className="flex items-center">
            {/* Logo */}
            <img src={EduciteLogo} alt="Educite Logo" className="h-8 w-auto" />
          </Link>
        </div>

        <div className="mt-6 flex-1 flex flex-col overflow-y-auto">
          <nav className="px-3 mt-6 space-y-8">
            {navigationItems.map((section) => (
              <div key={section.name}>
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.name}
                </h3>
                <div className="mt-2 space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`
                          group flex items-center px-3 py-2 text-sm font-medium rounded-md
                          ${
                            isActive
                              ? "bg-gray-800 text-white"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }
                        `}
                      >
                        <Icon
                          className={`
                          mr-3 h-5 w-5
                          ${
                            isActive
                              ? "text-white"
                              : "text-gray-400 group-hover:text-white"
                          }
                        `}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="ml-3 w-full">
              <p className="text-sm font-medium text-white group-hover:text-gray-200">
                Admin User
              </p>
              <Link
                to="/logout"
                className="text-xs font-medium text-gray-400 group-hover:text-gray-300"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72 flex flex-col">
        {/* Top Navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-gray-900 border-b border-gray-800">
          <button
            type="button"
            className="px-4 border-r border-gray-800 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button className="max-w-xs bg-gray-900 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MainLayout({ children }: LayoutProps) {
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  // Generate Hansards years and split into columns
  const generateHansardYears = () => {
    const years = Array.from({ length: 70 }, (_, i) => 2025 - i);
    const columns = [];
    for (let i = 0; i < years.length; i += 7) {
      columns.push(years.slice(i, i + 7));
    }
    return columns;
  };

  const megaMenuItems = {
    hansards: {
      title: "Hansards",
      columns: generateHansardYears(),
    },
    courts: {
      title: "Courts of Record",
      subcategories: [
        "Supreme Court of Uganda",
        "Court of Appeal of Uganda",
        "Constitutional Court of Uganda",
        {
          name: "High Court of Uganda",
          divisions: [
            "Commercial Court Division",
            "Anti-Corruption Division",
            "Civil Division",
            "Criminal Division",
            "Family Division",
            "International Crimes Division",
            "Land Division",
            "Industrial Court Division",
            "Election Petitions",
          ],
        },
      ],
    },
    legislation: {
      title: "Legislation",
      // subcategories: ["Acts of Parliament", "Statutory Instruments"],
      subcategories: [
        {
          name: "Acts of Parliament",
          href: "/legislation",
        },
        {
          name: "Statutory Instruments",
          href: "/about",
        },
      ],

      // subcategories: [{ name: "About Educite", href: "/about" }],
    },

    archival: {
      title: "Archival Materials",
      subcategories: ["Archival Materials"],
    },
    // statutory: {
    //   title: "Statutory Instruments",
    //   subcategories: [
    //     "Statutory Instruments 2003",
    //     "Statutory Instruments 2002",
    //     "Statutory Instruments 2001",
    //   ],
    // },
    gazettes: {
      title: "Gazettes",
      subcategories: [
        {
          name: "Gazettes",
          href: "/gazettes",
        },
      ],
    },
    others: {
      title: "Others",
      subcategories: [
        { name: "About Educite", href: "/about" },
        // { name: "Partners", href: "/partners" },
        {
          name: "Open Access Resources",
          href: "https://openaccess.educitevl.edu.ug",
          target: "_",
        },
        { name: "Educite Reports", href: "/educite_reports" },
        // { name: "Educite Archives", href: "/educite-archives" },
        // { name: "Educite Reports", href: "/educite-reports" },
      ],
    },
  };

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error.message);
    } else {
      appContext?.setUser(null);
    }
    setShowActions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gradient-white shadow-lg relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                {/* Logo */}
                <img
                  src={EduciteLogo}
                  alt="Educite Logo"
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-4">
              {Object.entries(megaMenuItems).map(([key, item]) => (
                <div
                  key={key}
                  className="relative group"
                  onMouseEnter={() => setMegaMenuOpen(key)}
                  onMouseLeave={() => setMegaMenuOpen(null)}
                >
                  <button className="text-black hover:text-gray-100 flex items-center py-2 px-3 rounded-md hover:bg-blue-800/50 transition-all duration-200 font-medium">
                    {key === "hansards" && (
                      <BookOpen className="mr-2 h-5 w-5" />
                    )}
                    {key === "courts" && <Gavel className="mr-2 h-5 w-5" />}
                    {key === "legislation" && (
                      <Gavel className="mr-2 h-5 w-5" />
                    )}
                    {key === "acts" && <FileText className="mr-2 h-5 w-5" />}
                    {key === "archival" && (
                      <FileSpreadsheet className="mr-2 h-5 w-5" />
                    )}
                    {key === "statutory" && (
                      <FileSpreadsheet className="mr-2 h-5 w-5" />
                    )}
                    {key === "others" && (
                      <MoreVertical className="mr-2 h-5 w-5" />
                    )}
                    {item.title}
                  </button>

                  {/* Mega Menu Dropdown */}
                  {megaMenuOpen === key && (
                    <div
                      className="absolute left-0 mt-0 w-screen max-w-max bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-200 ease-out"
                      onMouseEnter={() => setMegaMenuOpen(key)}
                      onMouseLeave={() => setMegaMenuOpen(null)}
                    >
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-4 pb-4 border-b-2 border-blue-100">
                          {key === "hansards" && (
                            <BookOpen className="h-5 w-5 text-blue-600" />
                          )}
                          {key === "courts" && (
                            <Gavel className="h-5 w-5 text-blue-600" />
                          )}
                          {key === "acts" && (
                            <FileText className="h-5 w-5 text-blue-600" />
                          )}
                          {key === "statutory" && (
                            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                          )}
                          {key === "others" && (
                            <MoreVertical className="h-5 w-5 text-blue-600" />
                          )}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.title}
                          </h3>
                        </div>
                        <div className="grid grid-cols-10 gap-6">
                          {key === "hansards" ? (
                            // Hansards columns
                            item.columns.map((column, columnIndex) => (
                              <div key={columnIndex} className="space-y-2">
                                {column.map((year) => (
                                  <Link
                                    key={year}
                                    to="/hansards"
                                    className="block text-gray-700 hover:text-blue-600 hover:bg-blue-100/50 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                                  >
                                    Hansards {year}
                                  </Link>
                                ))}
                              </div>
                            ))
                          ) : key === "courts" ? (
                            // Courts of Record with nested High Court divisions
                            <div className="col-span-10 grid grid-cols-3 gap-6">
                              {item.subcategories.map((subcategory) =>
                                typeof subcategory === "string" ? (
                                  <Link
                                    key={subcategory}
                                    to={`/judgments?court=${encodeURIComponent(
                                      subcategory
                                    )}`}
                                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-100/50 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                                  >
                                    {subcategory}
                                  </Link>
                                ) : (
                                  <div
                                    key={subcategory.name}
                                    className="space-y-2"
                                  >
                                    <div className="font-medium text-gray-900 px-3 py-2">
                                      {subcategory.name}
                                    </div>
                                    <div className="pl-4 space-y-1">
                                      {subcategory.divisions.map((division) => (
                                        <Link
                                          key={division}
                                          to={`/judgments?court=${encodeURIComponent(
                                            subcategory.name
                                          )}&division=${encodeURIComponent(
                                            division
                                          )}`}
                                          className="block text-gray-700 hover:text-blue-600 hover:bg-blue-100/50 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                                        >
                                          {division}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          ) : key === "others" ||
                            key === "legislation" ||
                            key == "gazettes" ? (
                            // Others menu with links
                            <div className="col-span-10 grid grid-cols-3 gap-6">
                              {item.subcategories.map((subcategory) => (
                                <Link
                                  key={subcategory.name}
                                  to={subcategory.href}
                                  target={
                                    subcategory.name == "Open Access Resources"
                                      ? "_blank"
                                      : "_self"
                                  }
                                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-100/50 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                                >
                                  {subcategory.name}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            // Other categories
                            <div className="col-span-10 grid grid-cols-3 gap-6">
                              {item.subcategories.map((subcategory) => (
                                <Link
                                  key={subcategory}
                                  to={`/documents?category=${key}&subcategory=${encodeURIComponent(
                                    subcategory
                                  )}`}
                                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-100/50 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                                >
                                  {subcategory}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center space-x-4">
                {/* <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center text-black hover:text-gray-100 hover:bg-blue-800/50"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link> */}
                {appContext?.user ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setShowActions(!showActions)}
                      // className="flex items-center"
                    >
                      <div>
                        <span
                          className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      `}
                        >
                          {appContext?.user.display_name}
                        </span>
                        <div>
                          <span
                            className={`
                      inline-flex items-center px-2.5 py-0.5 mx-2 rounded-full text-xs font-medium
                      bg-purple-100 text-purple-800
                    `}
                          >
                            {appContext?.user.user_role.toUpperCase()}
                          </span>
                          {appContext?.user.subscription_tier && (
                            <>
                              .
                              <span
                                className={`
                        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      `}
                              >
                                {appContext?.user.subscription_tier?.toUpperCase()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </Button>
                    {showActions && (
                      <div className="absolute right-40 mt-28 w-30 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                        {appContext?.user.user_role == "admin" && (
                          <button
                            onClick={() => navigate("/dashboard")}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <List className="mr-3 h-4 w-4 text-gray-400" />
                            Dashboard
                          </button>
                        )}
                        <button
                          onClick={handleLogOut}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="mr-3 h-4 w-4 text-gray-400" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/login">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center bg-white text-blue-600 hover:bg-gray-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-black hover:text-black focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-900 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {Object.entries(megaMenuItems).map(([key, item]) => (
                <div key={key}>
                  <button
                    onClick={() => {
                      setMegaMenuOpen(megaMenuOpen === key ? null : key);
                    }}
                    className="text-white flex items-center w-full text-left py-2 px-3 rounded-md hover:bg-gray-800 transition-all duration-200"
                  >
                    {key === "hansards" && (
                      <BookOpen className="mr-2 h-5 w-5" />
                    )}
                    {key === "courts" && <Gavel className="mr-2 h-5 w-5" />}
                    {key === "acts" && <FileText className="mr-2 h-5 w-5" />}
                    {key === "statutory" && (
                      <FileSpreadsheet className="mr-2 h-5 w-5" />
                    )}
                    {key === "others" && (
                      <MoreVertical className="mr-2 h-5 w-5" />
                    )}
                    {item.title}
                  </button>

                  {/* Expandable Submenu */}
                  {megaMenuOpen === key && (
                    <div className="pl-6 mt-2 space-y-2">
                      {key === "hansards"
                        ? item.columns.flat().map((year) => (
                            <Link
                              key={year}
                              to="/hansards"
                              onClick={() => setMobileMenuOpen(false)}
                              className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-all duration-200"
                            >
                              Hansards {year}
                            </Link>
                          ))
                        : key === "courts"
                        ? item.subcategories.map((subcategory) =>
                            typeof subcategory === "string" ? (
                              <Link
                                key={subcategory}
                                to={`/judgments?court=${encodeURIComponent(
                                  subcategory
                                )}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-all duration-200"
                              >
                                {subcategory}
                              </Link>
                            ) : (
                              <div key={subcategory.name} className="space-y-2">
                                <div className="text-gray-400 px-3 py-2">
                                  {subcategory.name}
                                </div>
                                <div className="pl-4 space-y-1">
                                  {subcategory.divisions.map((division) => (
                                    <Link
                                      key={division}
                                      to={`/judgments?court=${encodeURIComponent(
                                        subcategory.name
                                      )}&division=${encodeURIComponent(
                                        division
                                      )}`}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-all duration-200"
                                    >
                                      {division}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )
                          )
                        : key === "others" ||
                          key === "legislation" ||
                          key == "gazettes"
                        ? item.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.name}
                              to={subcategory.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-all duration-200"
                            >
                              {subcategory.name}
                            </Link>
                          ))
                        : item.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory}
                              to={`/documents?category=${key}&subcategory=${encodeURIComponent(
                                subcategory
                              )}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-all duration-200"
                            >
                              {subcategory}
                            </Link>
                          ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 space-y-2">
                {appContext?.user ? (
                  <>
                    {appContext?.user.user_role == "admin" && (
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-white hover:text-gray-100 py-2 px-3 rounded-md hover:bg-gray-800 transition-all duration-200"
                      >
                        <LayoutDashboard className="inline-block mr-2 h-5 w-5" />
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/"
                      onClick={() => {
                        handleLogOut();
                        setMobileMenuOpen(false);
                      }}
                      className="block text-white hover:text-gray-100 py-2 px-3 rounded-md hover:bg-gray-800 transition-all duration-200"
                    >
                      <LogOut className="inline-block mr-2 h-5 w-5" />
                      Sign Out
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-white hover:text-gray-100 py-2 px-3 rounded-md hover:bg-gray-800 transition-all duration-200"
                  >
                    <LogIn className="inline-block mr-2 h-5 w-5" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-200">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/documents"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    All Documents
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </li>

                <li>
                  <Link
                    to="https://openaccess.educitevl.edu.ug"
                    target="_"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Open Access Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200">Follow Us</h3>
              <div className="mt-4 flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8">
            <p className="text-center text-sm text-gray-400">
              © {new Date().getFullYear()} Educite. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  if (isDashboard) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return <MainLayout>{children}</MainLayout>;
}
