import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import TableOfContents from './TableOfContents';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface DocLayoutProps {
  children: React.ReactNode;
}

const DocLayout: React.FC<DocLayoutProps> = ({ children }) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Extract headings from the page
    const headings = document.querySelectorAll('h2, h3');
    const items: TocItem[] = [];

    headings.forEach((heading) => {
      const id = heading.id;
      const text = heading.textContent || '';
      const level = parseInt(heading.tagName.substring(1));

      if (id && text) {
        items.push({ id, text, level });
      }
    });

    setTocItems(items);
  }, [children]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Layout>
      <div className="doc-layout">
        {/* Mobile menu button */}
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>

        {/* Sidebar with TOC */}
        <aside className={`doc-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="doc-sidebar-content">
            {tocItems.length > 0 && <TableOfContents items={tocItems} />}
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <div className="doc-content">
          {children}
        </div>
      </div>
    </Layout>
  );
};

export default DocLayout;
