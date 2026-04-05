import TerminalHero from '../sections/TerminalHero';
import FeaturedTool from '../sections/FeaturedTool';

// Reusing the Tool logic just for passing to FeaturedTool, but Home won't need the modals to live directly in App anymore.
// Wait, we still need Modals for FeaturedTool. We can render them locally.
import { useState } from 'react';
import { tools, type Tool } from '../data/kaliTools';
import ToolDetailModal from '../components/ToolDetailModal';

import KaliHub from '../sections/KaliHub';

const Home = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);

  const handleToolSelect = (toolId: string) => {
    const tool = tools.find((t) => t.id === toolId);
    if (tool) {
      setSelectedTool(tool);
      setIsToolModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-12 lg:gap-24">
      {/* Introduction Hero Section */}
      <TerminalHero />
      
      {/* Kali Hub Snapshot */}
      <KaliHub onToolSelect={handleToolSelect} />

      {/* Featured / Recommended sections */}
      <FeaturedTool onToolSelect={handleToolSelect} />

      {/* Tool Modal purely for the FeaturedTool component clicks */}
      <ToolDetailModal
        tool={selectedTool}
        isOpen={isToolModalOpen}
        onClose={() => setIsToolModalOpen(false)}
      />
    </div>
  );
};

export default Home;
