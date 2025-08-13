import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { Toaster } from "sonner";
import { DocsLayout } from "@nui/core";
import type { NavItem } from "@nui/plugin-docs";

import { Header } from "./components/layout/header";
import { MobileNav } from "./components/layout/mobile-nav";
import { PageHeader } from "./components/layout/page-header";
import { PageNavigation } from "./components/layout/page-navigation";
import { Sidebar } from "./components/layout/sidebar";
import { Toc } from "./components/layout/toc";
import { Logo } from "./components/logo";
import { mdxComponents } from "./components/mdx";
import { useNavigation } from "./hooks/use-navigation";
import { routes } from "./lib/routes";

export function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { navItems, sectionItems, activeSection, currentFile, prev, next } =
    useNavigation(pathname);

  // Reset scroll position to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Update document title based on current page
  useEffect(() => {
    const baseTitle = "NUI";
    const pageTitle = currentFile?.meta?.title;

    if (pageTitle) {
      document.title = `${pageTitle} - ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, [currentFile]);

  const handleSelect = (item: NavItem) => {
    if (item.path) navigate(item.path);
  };

  // Check if current page is a TSX file
  const isTsxPage = currentFile?.isTsx === true;

  return (
    <MDXProvider components={mdxComponents}>
      <DocsLayout
        header={
          <>
            <MobileNav
              items={navItems}
              currentPath={pathname}
              onSelect={handleSelect}
            />
            <Header
              title="NUI"
              logo={<Logo />}
              items={navItems}
              currentPath={pathname}
              onSelect={handleSelect}
            />
          </>
        }
        sidebar={
          isTsxPage ? undefined : (
            <Sidebar
              activeSection={activeSection}
              items={sectionItems}
              currentPath={pathname}
              onSelect={handleSelect}
            />
          )
        }
        toc={isTsxPage ? undefined : <Toc items={currentFile?.toc ?? []} />}
      >
        {!isTsxPage && (
          <PageHeader currentFile={currentFile} prev={prev} next={next} />
        )}
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
        {!isTsxPage && <PageNavigation prev={prev} next={next} />}
      </DocsLayout>
      <Toaster />
    </MDXProvider>
  );
}
