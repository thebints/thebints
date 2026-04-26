import { useLocation, Navigate } from "react-router-dom";
import { ContentPage } from "@/components/site/ContentPage";
import { PAGE_CONTENT } from "@/content/pages";
import { NAV } from "@/components/site/SiteLayout";

const ICON_BY_PATH: Record<string, string> = NAV.reduce((acc, item) => {
  item.children?.forEach((c) => {
    acc[c.to] = c.icon;
  });
  return acc;
}, {} as Record<string, string>);

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
      icon={content.icon ?? ICON_BY_PATH[pathname]}
      body={content.body}
      cta={content.cta}
    />
  );
};

export default DynamicPage;
