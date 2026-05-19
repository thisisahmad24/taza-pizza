import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState<{_id?: string, name: string, email: string} | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditName(parsedUser.name);
      setEditEmail(parsedUser.email);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) {
      setError("User ID missing. Please log in again.");
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          name: editName,
          email: editEmail,
          newPassword: editPassword || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update local storage and state
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setEditPassword(''); // clear password field
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-border/50 pb-6 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-black mb-2">My <span className="text-primary">Profile</span></h1>
          <p className="text-foreground/70 text-lg">Welcome back, {user.name}!</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-6 py-2.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl transition-all font-bold shadow-sm"
        >
          Secure Logout
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive font-medium p-4 rounded-xl mb-6 border border-destructive/20 animate-in fade-in">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 text-green-600 dark:text-green-400 font-medium p-4 rounded-xl mb-6 border border-green-500/20 animate-in fade-in">
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card p-8 rounded-3xl shadow-xl border border-border/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-heading">Account Details</h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4 animate-in fade-in slide-in-from-left-2">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground/80">Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground/80">Email</label>
                  <input 
                    type="email" 
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground/80">New Password <span className="text-xs font-normal opacity-70">(Leave blank to keep current)</span></label>
                  <input 
                    type="password" 
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(user.name);
                      setEditEmail(user.email);
                      setEditPassword('');
                      setError('');
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-70 flex justify-center items-center"
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <p className="text-sm text-foreground/50 uppercase tracking-wider font-bold mb-1">Full Name</p>
                  <p className="font-medium text-lg">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/50 uppercase tracking-wider font-bold mb-1">Email Address</p>
                  <p className="font-medium text-lg">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/50 uppercase tracking-wider font-bold mb-1">Password</p>
                  <p className="font-medium text-lg tracking-widest text-foreground/50">••••••••</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold font-heading">Order History</h2>
          <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-12 text-center text-foreground/60 flex flex-col items-center justify-center min-h-[300px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag opacity-20 mb-4"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <p className="text-xl font-medium mb-2">No orders found</p>
            <p className="max-w-md mx-auto">You haven't placed any orders yet. Visit the Pizza Lab to craft your first custom artisanal pie!</p>
            <button 
              onClick={() => navigate('/lab')}
              className="mt-6 px-6 py-2 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all"
            >
              Go to Pizza Lab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
