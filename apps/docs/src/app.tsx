import { useEffect, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { contents, navigation } from "virtual:docs";
import { DocsLayout } from "@nui/core";
import type { NavItem } from "@nui/vite-plugin-docs";

import { Header } from "./components/layout/header";
import { MobileNav } from "./components/layout/mobile-nav";
import { PageHeader } from "./components/layout/page-header";
import { PageNavigation } from "./components/layout/page-navigation";
import { Sidebar } from "./components/layout/sidebar";
import { Toc } from "./components/layout/toc";
import { mdxComponents } from "./components/mdx";
import { routes } from "./lib/routes";
import { getNavigationState } from "./utils/navigation";

export function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { rootItems, sectionItems, activeSection, currentFile, prev, next } =
    useMemo(
      () => getNavigationState(contents, navigation, pathname),
      [pathname],
    );

  // Reset scroll position to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

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
              items={rootItems}
              sidebarItems={sectionItems}
              currentPath={pathname}
              onSelect={handleSelect}
            />
            <Header
              title="NUI"
              items={rootItems}
              currentPath={pathname}
              onSelect={handleSelect}
            />
          </>
        }
        sidebar={
          isTsxPage ? undefined : (
            <Sidebar
              items={sectionItems}
              activeSection={activeSection}
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
    </MDXProvider>
  );
}
