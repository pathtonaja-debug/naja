import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, Plus, Heart, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: Home, path: "/dashboard", label: "Dashboard" },
    { icon: BookOpen, path: "/habits", label: "Habits" },
    { icon: null, path: "/add", label: "Add" }, // FAB placeholder
    { icon: Heart, path: "/journal", label: "Journal" },
    { icon: UserCircle, path: "/profile", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="relative flex justify-center px-6 pb-6">
        {/* Bottom bar with notch */}
        <div className="relative w-full max-w-2xl">
          {/* Main nav bar */}
          <div className="bg-blackPill rounded-t-[14px] shadow-fab pt-3 pb-6 px-6 pointer-events-auto">
            <div className="flex justify-around items-center relative">
              {tabs.map((tab, idx) => {
                // FAB in center
                if (tab.icon === null && idx === 2) {
                  return (
                    <div key="fab" className="relative -mt-12">
                      <button
                        onClick={() => navigate("/duas")}
                        className="w-[60px] h-[60px] rounded-full bg-pink shadow-fab flex items-center justify-center active:scale-95 transition-transform duration-300"
                      >
                        <Plus className="w-7 h-7 text-ink900" />
                      </button>
                    </div>
                  );
                }

                const isActive = location.pathname === tab.path;
                const Icon = tab.icon;
                
                return Icon ? (
                  <button
                    key={tab.path}
                    onClick={() => navigate(tab.path)}
                    className={cn(
                      "flex flex-col items-center gap-1 transition-all duration-300 min-w-[44px] min-h-[44px] justify-center",
                      isActive ? "opacity-100" : "opacity-65"
                    )}
                  >
                    <Icon 
                      className={cn(
                        "w-6 h-6 transition-colors",
                        isActive ? "text-white" : "text-white/65"
                      )} 
                    />
                  </button>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
