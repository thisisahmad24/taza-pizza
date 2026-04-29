import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex justify-between items-center mb-8 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">My Profile</h1>
          <p className="text-foreground/70">Welcome back, {user.name}!</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-6 py-2 border border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors font-medium"
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card p-6 rounded-2xl shadow-md border border-border/50">
            <h2 className="text-xl font-bold mb-4">Account Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-foreground/60">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold font-heading">Order History</h2>
          <div className="bg-card rounded-2xl shadow-md border border-border/50 p-8 text-center text-foreground/60">
            {/* TODO: Fetch orders from MongoDB */}
            <p>You haven't placed any orders yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
