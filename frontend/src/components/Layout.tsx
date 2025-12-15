import React from "react";
import { Link } from "react-router-dom";
import { Home, BarChart, Settings, BookOpen, Lightbulb, CalendarDays, Newspaper, Menu, Target, Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavLinksProps {
  onLinkClick?: () => void; // Optional prop to close the sheet
}

const NavLinks: React.FC<NavLinksProps> = ({ onLinkClick }) => (
  <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
    <Link
      to="/dashboard"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent"
      onClick={onLinkClick}
    >
      <Home className="h-4 w-4" />
      Dashboard
    </Link>
    <Link
      to="/assessment"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent"
      onClick={onLinkClick}
    >
      <BarChart className="h-4 w-4" />
      Assessment
    </Link>
    <Link
      to="/engagement"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent"
      onClick={onLinkClick}
    >
      <Lightbulb className="h-4 w-4" />
      Engagement
    </Link>
    <Link
      to="/reflection"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent"
      onClick={onLinkClick}
    >
      <CalendarDays className="h-4 w-4" />
      Weekly Reflection
    </Link>
    <Link
      to="/challenges"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent"
      onClick={onLinkClick}
    >
      <Target className="h-4 w-4" />
      Challenges
    </Link>
    <Link
      to="/exercises"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent"
      onClick={onLinkClick}
    >
      <Puzzle className="h-4 w-4" />
      Exercises
    </Link>
    <Link
      to="/news"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent"
      onClick={onLinkClick}
    >
      <Newspaper className="h-4 w-4" />
      News
    </Link>
    <Link
      to="/settings"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent"
      onClick={onLinkClick}
    >
      <Settings className="h-4 w-4" />
      Settings
    </Link>
  </nav>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
              <BookOpen className="h-6 w-6" />
              <span className="text-lg">Innovation Character</span>
            </Link>
          </div>
          <div className="flex-1 py-2">
            <NavLinks />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 shadow-sm">
          {/* Mobile Sheet Trigger (Hamburger Menu) */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-primary mb-4" onClick={() => setIsSheetOpen(false)}>
                <BookOpen className="h-6 w-6" />
                <span>Innovation Character</span>
              </Link>
              <NavLinks onLinkClick={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold text-primary md:hidden">Innovation Character</h1>
          <div className="flex-1"></div> {/* Spacer to push content to the right if needed */}
        </header>
        <main className="flex flex-1 flex-col gap-6 p-4 lg:p-8 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;