import { Link } from 'react-router-dom';
import { Bell, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface HeaderProps {
  toggleSidebar: () => void;
}
const Header = ({
  toggleSidebar
}: HeaderProps) => {
  return <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-primary font-bold text-xl">HomeHive</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          
          
        </div>
      </div>
    </header>;
};
export default Header;