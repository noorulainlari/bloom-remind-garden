
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Leaf, LogOut, Settings, User, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HeaderProps {
  onAdminToggle: (isAdmin: boolean) => void;
  onAuthToggle: (showAuth: boolean) => void;
}

export const Header = ({ onAdminToggle, onAuthToggle }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (data && data.role === 'admin') {
      setIsAdmin(true);
    }
  };

  const toggleAdminView = () => {
    onAdminToggle(!isAdmin);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-xl font-bold text-green-700">Plant Care Tracker</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.email}
                </span>
                
                {isAdmin && (
                  <Button
                    onClick={toggleAdminView}
                    variant="outline"
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                )}
                
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-600">
                  Sign up to get email reminders
                </span>
                <Button
                  onClick={() => onAuthToggle(true)}
                  variant="outline"
                  size="sm"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={() => onAuthToggle(true)}
                  size="sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
