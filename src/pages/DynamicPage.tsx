import { useLocation, Navigate } from "react-router-dom";
import { ContentPage } from "@/components/site/ContentPage";
import { PAGE_CONTENT } from "@/content/pages";

const DynamicPage = () => {
  const { pathname } = useLocation();
  const content = PAGE_CONTENT[pathname];
  if (!content) return <Navigate to="/404" replace />;
  return (
    <ContentPage
      eyebrow={content.eyebrow}
      title={content.title}
      intro={content.intro}
      image={content.image}
      body={content.body}
      cta={content.cta}
    />
  );
};

export default DynamicPage;
