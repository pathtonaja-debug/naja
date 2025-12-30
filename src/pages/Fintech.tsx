import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { FintechEducationModule } from '@/components/game/FintechEducationModule';

const Fintech = () => {
  const navigate = useNavigate();

  const handleXPGained = (amount: number) => {
    // Points are awarded locally via addBarakahPoints in the module
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-24"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Ethical Finance</h1>
          <p className="text-xs text-muted-foreground">Learn Islamic finance basics</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <FintechEducationModule onXPGained={handleXPGained} />
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default Fintech;