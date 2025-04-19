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
  Shield,
  Mail,
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
          name: "View Archival Materials",
          href: "/dashboard/documents/archival-materials",
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
          name: "View Courts of Record",
          href: "/dashboard/documents/courts-of-record",
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
      name: "System Reports",
      items: [
        {
          name: "System Reports Dashbord",
          href: "/dashboard/system_reports",
          icon: FileArchive,
        },
        // { name: "Add User", href: "/dashboard/users/add", icon: Plus },
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
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-gray-50">
          <Link to="/" className="flex items-center space-x-3">
            <img src={EduciteLogo} alt="Educite Logo" className="h-8 w-auto" />
            <span className="font-semibold text-gray-900">Educite Admin</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
          <nav className="flex-1 px-4 py-4 space-y-6">
            {navigationItems.map((section) => (
              <div key={section.name} className="space-y-3">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.name}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`
                          group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                          ${isActive 
                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                          }
                        `}
                      >
                        <Icon className={`
                          flex-shrink-0 mr-3 h-5 w-5 transition-colors duration-200
                          ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}
                        `}/>
                        <span className="truncate">{item.name}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-6 rounded-full bg-blue-600" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Enhanced User Profile Section */}
        <div className="flex-shrink-0 border-t border-gray-200">
          <div className="p-4 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
              <button
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                onClick={() => {/* handle logout */}}
              >
                <LogOut className="h-5 w-5" />
              </button>
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
          href: "/statutory-instruments",
        },
        {
          name: "Legal Notices",
          href: "/legal-notices",
        },
        {
          name: "Ordinances",
          href: "/ordinances",
        },
      ],

      // subcategories: [{ name: "About Educite", href: "/about" }],
    },

    archival: {
      title: "Archival Materials",
      subcategories: [
        {
          name: "Archival Materials",
          href: "/archival-materials",
        },
      ],
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
          href: "/open-access-resources",
          target: "_",
        },

        { name: "Educite Reports", href: "/educite_reports" },

        {
          name: "Procedure Documents",
          divisions: [
            "Civil Procedure",
            "Criminal Procedure",
            "Family Law Practice",
            "Land Transactions",
            "Commercial Law Practice",
          ],
        },
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
      <nav className="bg-white shadow-md relative border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <img
                  src={EduciteLogo}
                  alt="Educite Logo"
                  className="h-12 w-auto transition-transform duration-200 hover:scale-105"
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
                  <button className="text-gray-700 hover:text-blue-600 flex items-center py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium group">
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
                      className="absolute left-0 mt-0 w-screen max-w-max bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-200 ease-out border border-gray-100"
                      // onMouseEnter={() => setMegaMenuOpen(key)}
                      // onMouseLeave={() => setMegaMenuOpen(null)}
                    >
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-4 pb-4 border-b-2 border-blue-100 w-200">
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                          {key === "hansards" ? (
                            // Hansards columns
                            item.columns.map((column, columnIndex) => (
                              <div key={columnIndex} className="space-y-2">
                                {column.map((year) => (
                                  <Link
                                    key={year}
                                    to={`/hansards/${year}`}
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
                                          // to={`/judgments?court=${encodeURIComponent(
                                          //   subcategory.name
                                          // )}&division=${encodeURIComponent(
                                          //   division
                                          // )}`}
                                          to={`/judgments?court=${subcategory.name}/${division}`}
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
                            key == "gazettes" ||
                            key == "archival" ? (
                            // Others menu with links
                            <div className="col-span-2 grid grid-cols-auto gap-2">
                              {item.subcategories.map((subcategory) => (
                                <div
                                  key={subcategory.name}
                                  className="space-y-2"
                                >
                                  {subcategory.name == "Procedure Documents" ? (
                                    <>
                                      <div className="font-medium text-gray-900 px-3 py-2">
                                        {subcategory.name}
                                      </div>
                                      <div className="pl-4 space-y-1">
                                        {subcategory.divisions.map(
                                          (division) => (
                                            <Link
                                              key={division}
                                              // to={`/judgments?court=${encodeURIComponent(
                                              //   subcategory.name
                                              // )}&division=${encodeURIComponent(
                                              //   division
                                              // )}`}
                                              to={`/procedure_documents?subcategory=${encodeURIComponent(
                                                division
                                              )}`}
                                              className="block text-gray-700 hover:text-blue-600 hover:bg-blue-100/50 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                                            >
                                              {division}
                                            </Link>
                                          )
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <Link
                                      key={subcategory.name}
                                      to={subcategory.href}
                                      // target={
                                      //   subcategory.name == "Open Access Resources"
                                      //     ? "_blank"
                                      //     : "_self"
                                      // }
                                      className="text-gray-700 hover:text-blue-600 hover:bg-blue-100/50 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                                    >
                                      {subcategory.name}
                                    </Link>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            // Other categories
                            <div className="col-span-10 grid grid-cols-3 gap-6">
                              {item.subcategories.map((subcategory) => (
                                <Link
                                  key={subcategory}
                                  to={`/procedure_documents?category=${key}&subcategory=${encodeURIComponent(
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

              <div className="flex items-center space-x-4 ml-6 border-l border-gray-200 pl-6">
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
                       className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-2"
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
                        ? item.columns.flat().map((year: any) => (
                            <Link
                              key={year}
                              to={`/hansards/${year}`}
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
                                // to={`/judgments?court=${subcategory.name}/${division}`}
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
                                      // to={`/judgments?court=${encodeURIComponent(
                                      //   subcategory.name
                                      // )}&division=${encodeURIComponent(
                                      //   division
                                      // )}`}
                                      to={`/judgments?court=${subcategory.name}/${division}`}
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
                          key == "gazettes" ||
                          key == "archival"
                        ? item.subcategories.map((subcategory) => (
                            <div key={subcategory.name} className="space-y-2">
                              {subcategory.name == "Procedure Documents" ? (
                                <>
                                  <div className="text-gray-400 px-3 py-2">
                                    {subcategory.name}
                                  </div>
                                  <div className="pl-4 space-y-1">
                                    {subcategory.divisions.map((division) => (
                                      <Link
                                        key={division}
                                        // to={`/judgments?court=${encodeURIComponent(
                                        //   subcategory.name
                                        // )}&division=${encodeURIComponent(
                                        //   division
                                        // )}`}
                                        to={`/procedure_documents?subcategory=${division}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-all duration-200"
                                      >
                                        {division}
                                      </Link>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <Link
                                  key={subcategory.name}
                                  to={subcategory.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-all duration-200"
                                >
                                  {subcategory.name}
                                </Link>
                              )}
                            </div>
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
       {/* Enhanced Footer */}
       <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Upper Footer Section */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-16">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/documents"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200 flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>All Documents</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200 flex items-center space-x-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Blog</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Gavel className="h-4 w-4" />
                    <span>Terms of Service</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Privacy Policy</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Info className="h-4 w-4" />
                    <span>About Us</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact-us"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/open-access-resources"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Open Access Resources</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Facebook className="h-5 w-5 text-gray-300 hover:text-white" />
                  </a>
                  <a
                    href="#"
                    className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Twitter className="h-5 w-5 text-gray-300 hover:text-white" />
                  </a>
                  <a
                    href="#"
                    className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Linkedin className="h-5 w-5 text-gray-300 hover:text-white" />
                  </a>
                  <a
                    href="#"
                    className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Instagram className="h-5 w-5 text-gray-300 hover:text-white" />
                  </a>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-2">Newsletter</h3>
                <p className="text-sm text-gray-400 mb-4">Stay updated with our latest news and updates.</p>
                <form className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom Footer Section */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <div className="flex items-center space-x-4">
                <img
                  src={EduciteLogo}
                  alt="Educite Logo"
                  className="h-12 w-auto bg-white rounded-full p-2"
                />
                <span className="text-xl font-semibold text-white">Educite</span>
              </div>
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Educite. All rights reserved.
              </p>
            </div>
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
