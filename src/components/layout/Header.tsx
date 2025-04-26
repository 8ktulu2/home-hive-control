
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationMenu } from './NotificationMenu';
import { HeaderActions } from './HeaderActions';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              toggleSidebar();
            }} 
            aria-label="Toggle menu" 
            className="flex items-center justify-center"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-primary font-bold text-xl">Res Gestum</span>
            </Link>
            <HeaderActions />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
