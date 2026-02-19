import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BottomNav from '@/components/BottomNav';
import { FintechEducationModule } from '@/components/game/FintechEducationModule';

const Fintech = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleXPGained = (amount: number) => {
    // Points are awarded locally via addBarakahPoints in the module
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t('fintech.title')}</h1>
          <p className="text-xs text-muted-foreground">{t('fintech.learnBasics')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <FintechEducationModule onXPGained={handleXPGained} />
      </div>

      <BottomNav />
    </div>
  );
};

export default Fintech;