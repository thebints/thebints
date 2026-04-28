import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { PopupAnnouncement } from "@/components/site/PopupAnnouncement";

// Eager: home is the most-visited entry
import Index from "./pages/Index.tsx";

// Lazy-load everything else to slash initial JS
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Donate = lazy(() => import("./pages/Donate.tsx"));
const Founder = lazy(() => import("./pages/Founder.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const DynamicPage = lazy(() => import("./pages/DynamicPage.tsx"));
const Events = lazy(() => import("./pages/Events.tsx"));
const FormPages = lazy(() => import("./pages/FormPages.tsx"));
const Volunteer = lazy(() => import("./pages/FormPages.tsx").then(m => ({ default: m.Volunteer })));
const Mentor = lazy(() => import("./pages/FormPages.tsx").then(m => ({ default: m.Mentor })));
const Apply = lazy(() => import("./pages/FormPages.tsx").then(m => ({ default: m.Apply })));
const Reports = lazy(() => import("./pages/Reports.tsx"));
const Gallery = lazy(() => import("./pages/Gallery.tsx"));
const News = lazy(() => import("./pages/News.tsx"));
const NewsPost = lazy(() => import("./pages/NewsPost.tsx"));

// Admin (separate chunk – never loaded by visitors)
const AdminAuth = lazy(() => import("./pages/admin/AdminAuth.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminPopups = lazy(() => import("./pages/admin/AdminPopups.tsx"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents.tsx"));
const AdminApplications = lazy(() => import("./pages/admin/AdminApplications.tsx"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports.tsx"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery.tsx"));
const AdminNews = lazy(() => import("./pages/admin/AdminNews.tsx"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <PopupAnnouncement />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />

            {/* About */}
            <Route path="/about/founder" element={<Founder />} />
            <Route path="/about/vision-mission" element={<DynamicPage />} />
            <Route path="/about/values" element={<DynamicPage />} />
            <Route path="/about/governance" element={<DynamicPage />} />
            <Route path="/about/background" element={<DynamicPage />} />

            {/* Focus */}
            <Route path="/focus/economic-empowerment" element={<DynamicPage />} />
            <Route path="/focus/education" element={<DynamicPage />} />
            <Route path="/focus/housing" element={<DynamicPage />} />
            <Route path="/focus/welfare" element={<DynamicPage />} />
            <Route path="/focus/leadership" element={<DynamicPage />} />

            {/* Programmes */}
            <Route path="/programmes/women-empowerment" element={<DynamicPage />} />
            <Route path="/programmes/girl-child-education" element={<DynamicPage />} />
            <Route path="/programmes/skills-for-dignity" element={<DynamicPage />} />
            <Route path="/programmes/mentorship-circle" element={<DynamicPage />} />
            <Route path="/programmes/welfare-care" element={<DynamicPage />} />
            <Route path="/programmes/enterprise-support" element={<DynamicPage />} />
            <Route path="/programmes/back-to-school" element={<DynamicPage />} />
            <Route path="/programmes/dignity-kit" element={<DynamicPage />} />
            <Route path="/programmes/widows-support" element={<DynamicPage />} />
            <Route path="/programmes/housing-initiative" element={<DynamicPage />} />

            {/* Get Involved */}
            <Route path="/get-involved/partner" element={<DynamicPage />} />
            <Route path="/get-involved/csf" element={<DynamicPage />} />
            <Route path="/get-involved/volunteer" element={<Volunteer />} />
            <Route path="/get-involved/mentor" element={<Mentor />} />
            <Route path="/get-involved/apply" element={<Apply />} />

            {/* Media & Resources */}
            <Route path="/media/news" element={<News />} />
            <Route path="/media/news/:slug" element={<NewsPost />} />
            <Route path="/media/events" element={<Events />} />
            <Route path="/media/gallery" element={<Gallery />} />
            <Route path="/media/reports" element={<Reports />} />

            {/* Admin */}
            <Route path="/admin/auth" element={<AdminAuth />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="popups" element={<AdminPopups />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="news" element={<AdminNews />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
