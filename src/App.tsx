import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Layout } from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Partners from "./pages/Partners";
import About from "./pages/About";
import Overview from "./pages/dashboard/Overview";
import RecentActivity from "./pages/dashboard/RecentActivity";
import SubscriptionAnalytics from "./pages/dashboard/SubscriptionAnalytics";
import ViewUsers from "./pages/dashboard/ViewUsers";
import AddUser from "./pages/dashboard/AddUser";
import RolesPermissions from "./pages/dashboard/RolesPermissions";
import UserStatus from "./pages/dashboard/UserStatus";
import ViewSubscriptions from "./pages/dashboard/ViewSubscriptions";
import SubscriptionPlans from "./pages/dashboard/SubscriptionPlans";
import PaymentTransactions from "./pages/dashboard/PaymentTransactions";
import ExpiredSubscriptions from "./pages/dashboard/ExpiredSubscriptions";
import ViewDocuments from "./pages/dashboard/ViewDocuments";
import UploadDocument from "./pages/dashboard/UploadDocument";
import ManageCategories from "./pages/dashboard/ManageCategories";
import AddCategory from "./pages/dashboard/AddCategory";
import EditCategory from "./pages/dashboard/EditCategory";
import AddSubcategory from "./pages/dashboard/AddSubcategory";
import ManagePages from "./pages/dashboard/ManagePages";
import BlogPosts from "./pages/dashboard/BlogPosts";
import Testimonials from "./pages/dashboard/Testimonials";
import ViewReports from "./pages/dashboard/ViewReports";
import ViewJudgments from "./pages/dashboard/ViewJudgments";
import ViewLegislation from "./pages/dashboard/ViewLegislation";
import ViewHansards from "./pages/dashboard/ViewHansards";
import ViewGazettes from "./pages/dashboard/ViewGazettes";
import ViewActsOfParliament from "./pages/dashboard/ViewActsOfParliament";
import ViewStatutoryInstruments from "./pages/dashboard/ViewStatutoryInstruments";
import ViewRevisedEdition from "./pages/dashboard/ViewRevisedEdition";

// Public View All pages
import ViewAllJudgments from "./pages/ViewAllJudgments";
import ViewAllLegislation from "./pages/ViewAllLegislation";
import ViewAllHansards from "./pages/ViewAllHansards";
import ViewAllGazettes from "./pages/ViewAllGazettes";
import OpenAccessResources from "./pages/OpenAccessResources";
import AppContext from "./context/AppContext";
import ContactUs from "./pages/ContactUs";
import StatutoryInstruments from "./pages/StatutoryInstruments";
import ArchivalMaterials from "./pages/ArchivalMaterials";
import ViewArchivalMaterials from "./pages/dashboard/ViewArchivalMaterials";
import EduciteReports from "./pages/EduciteReports";
import ScrollToTop from "./components/ScrollToTop";
import ViewCourtsOfRecord from "./pages/dashboard/ViewCourtsOfRecord";
import DocumentPreview from "./components/DocumentPreview";
import Statistics from "./pages/dashboard/Statistics";
import ViewAllLegalNotices from "./pages/ViewAllLegalNotices";
import ViewAllOrdinances from "./pages/ViewAllOrdinances";
import ViewAllProcedureDocs from "./pages/ViewAllProcedureDocs";
import UserDetails from "./pages/dashboard/UserDetails";
import DocumentDetails from "./pages/DocumentDetails";
import ViewOtherDocuments from "./pages/ViewOtherDocuments";
import { pipeline } from "@xenova/transformers";
import { url1 } from "./lib/apiUrls";


function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [editDocModalVisible, setEditDocModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(false);
  const [selectedDocumentPreviewVisible, setSelectedDocumentPreviewVisible] =
    useState(false);
  const [documentPreview, setDocumentPreview] = useState(null);

  useEffect(() => {
    // This runs only on the client
    const checkMobile = () => {
      const ua = navigator.userAgent;
      setIsMobile(/Mobi|Android/i.test(ua));
    };

    checkMobile();

    // Optional: add a resize listener if you want to react to window resizing
    // window.addEventListener('resize', checkMobile);
    // return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // console.log("selectedDocumentPreviewVisible", selectedDocumentPreviewVisible);
  // console.log("documentPreview", documentPreview);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Educite Virtual Library</title>
        <meta name="title" content="Educite Virtual Library" />
        <meta
          name="description"
          content="Access thousands of educational documents, legal resources, and academic materials through Educite's comprehensive virtual library."
        />
      </Helmet>
      <AppContext.Provider
        value={{
          user,
          setUser,
          editDocModalVisible,
          setEditDocModalVisible,
          selectedDocument,
          setSelectedDocument,
          selectedDocumentPreviewVisible,
          setSelectedDocumentPreviewVisible,
          documentPreview,
          setDocumentPreview,
        }}
      >
        {selectedDocumentPreviewVisible && (
          <DocumentPreview
            documentUrl={isMobile ? `${url1}/api/download?url=${documentPreview.file_url}&name=${documentPreview.title}` : documentPreview.file_url}
            documentDetails={{
              id: documentPreview.id,
              title: documentPreview.title,
              description: documentPreview.subcategory,
            }}
            onClose={() => setSelectedDocumentPreviewVisible(false)}
          />
        )}
        <ToastContainer position="top-center" autoClose={3000} />

        <ErrorBoundary>
          <Router>
            <Layout>
              <Suspense
                fallback={
                  <div className="flex h-screen items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                  </div>
                }
              >
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Overview />} />
                  <Route
                    path="/dashboard/activity"
                    element={<RecentActivity />}
                  />
                  <Route
                    path="/dashboard/subscription-analytics"
                    element={<SubscriptionAnalytics />}
                  />
                  <Route path="/dashboard/users" element={<ViewUsers />} />
                  <Route path="/dashboard/users/add" element={<AddUser />} />
                  <Route
                    path="/dashboard/users/roles"
                    element={<RolesPermissions />}
                  />
                  <Route
                    path="/dashboard/users/status"
                    element={<UserStatus />}
                  />
                  <Route
                    path="/dashboard/subscriptions"
                    element={<ViewSubscriptions />}
                  />
                  <Route
                    path="/dashboard/subscriptions/plans"
                    element={<SubscriptionPlans />}
                  />
                  <Route
                    path="/dashboard/subscriptions/transactions"
                    element={<PaymentTransactions />}
                  />
                  <Route
                    path="/dashboard/subscriptions/expired"
                    element={<ExpiredSubscriptions />}
                  />

                  <Route
                    path="/document/:documentId"
                    element={<DocumentDetails />}
                  />

                  {/* Document Management Routes */}
                  <Route
                    path="/dashboard/documents"
                    element={<ViewDocuments />}
                  />
                  <Route
                    path="/dashboard/documents/upload"
                    element={<UploadDocument />}
                  />
                  <Route
                    path="/dashboard/documents/categories"
                    element={<ManageCategories />}
                  />
                  <Route
                    path="/dashboard/documents/categories/add"
                    element={<AddCategory />}
                  />
                  <Route
                    path="/dashboard/documents/categories/edit/:categoryId"
                    element={<EditCategory />}
                  />
                  <Route
                    path="/dashboard/documents/subcategories/add"
                    element={<AddSubcategory />}
                  />

                  {/* Specific Document Type Routes */}
                  <Route
                    path="/dashboard/documents/judgments"
                    element={<ViewJudgments />}
                  />
                  <Route
                    path="/dashboard/documents/legislation"
                    element={<ViewLegislation />}
                  />
                  <Route
                    path="/dashboard/documents/hansards"
                    element={<ViewHansards />}
                  />
                  <Route
                    path="/dashboard/documents/archival-materials"
                    element={<ViewArchivalMaterials />}
                  />
                  <Route
                    path="/dashboard/documents/gazettes"
                    element={<ViewGazettes />}
                  />



                  <Route
                    path="/dashboard/documents/acts"
                    element={<ViewActsOfParliament />}
                  />
                  <Route
                    path="/dashboard/documents/courts-of-record"
                    element={<ViewCourtsOfRecord />}
                  />
                  <Route
                    path="/dashboard/documents/statutory"
                    element={<ViewStatutoryInstruments />}
                  />
                  <Route
                    path="/dashboard/documents/revised-edition"
                    element={<ViewRevisedEdition />}
                  />

                  {/* Content Management Routes */}
                  <Route
                    path="/dashboard/content/pages"
                    element={<ManagePages />}
                  />
                  <Route
                    path="/dashboard/system_reports"
                    element={<Statistics />}
                  />

                  <Route
                    path="/dashboard/user/:userId"
                    element={<UserDetails />}
                  />
                  <Route
                    path="/dashboard/content/blog"
                    element={<BlogPosts />}
                  />
                  <Route
                    path="/dashboard/content/testimonials"
                    element={<Testimonials />}
                  />
                  <Route path="/dashboard/reports" element={<ViewReports />} />

                  {/* Public Routes */}
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/about" element={<About />} />

                  {/* Public View All Routes */}
                  <Route path="/judgments" element={<ViewAllJudgments />} />
                  <Route path="/other_documents" element={<ViewOtherDocuments />} />
                  <Route
                    path="/procedure_documents"
                    element={<ViewAllProcedureDocs />}
                  />
                  <Route
                    path="/statutory-instruments"
                    element={<StatutoryInstruments />}
                  />
                  <Route
                    path="/archival-materials"
                    element={<ArchivalMaterials />}
                  />
                  <Route path="/educite_reports" element={<EduciteReports />} />
                  <Route path="/legislation" element={<ViewAllLegislation />} />
                  <Route
                    path="/legal-notices"
                    element={<ViewAllLegalNotices />}
                  />
                  <Route path="/ordinances" element={<ViewAllOrdinances />} />
                  <Route path="/hansards/:year" element={<ViewAllHansards />} />
                  <Route path="/hansards" element={<ViewAllHansards />} />
                  <Route path="/gazettes" element={<ViewAllGazettes />} />
                  <Route
                    path="/open-access-resources"
                    element={<OpenAccessResources />}
                  />
                  <Route path="/contact-us" element={<ContactUs />} />
                </Routes>
              </Suspense>
            </Layout>
          </Router>
        </ErrorBoundary>
      </AppContext.Provider>
    </HelmetProvider>
  );
}

export default App;
