import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { PopupAnnouncement } from "@/components/site/PopupAnnouncement";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Donate from "./pages/Donate.tsx";
import Founder from "./pages/Founder.tsx";
import Contact from "./pages/Contact.tsx";
import DynamicPage from "./pages/DynamicPage.tsx";
import Events from "./pages/Events.tsx";
import { Volunteer, Mentor, Apply } from "./pages/FormPages.tsx";
import AdminAuth from "./pages/admin/AdminAuth.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminPopups from "./pages/admin/AdminPopups.tsx";
import AdminEvents from "./pages/admin/AdminEvents.tsx";
import AdminApplications from "./pages/admin/AdminApplications.tsx";
import AdminReports from "./pages/admin/AdminReports.tsx";
import AdminGallery from "./pages/admin/AdminGallery.tsx";
import Reports from "./pages/Reports.tsx";
import Gallery from "./pages/Gallery.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <PopupAnnouncement />
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
          <Route path="/media/news" element={<DynamicPage />} />
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
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
