import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BottomNav from '@/components/BottomNav';
import { TopBar } from '@/components/ui/top-bar';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getUpcomingEvents, getDaysInMonth, isJumuah, getEventsForDate, getEventColor, IslamicEvent } from '@/data/islamicDates';

const Dates = () => {
  const { t, i18n } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<(IslamicEvent & { gregorianDate: Date; daysUntil: number; hijriDateString: string }) | null>(null);
  
  const upcomingEvents = getUpcomingEvents();
  const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const dateLocale = i18n.language === 'fr' ? fr : enUS;
  const isFrench = i18n.language === 'fr';

  // Monday-first day names (MTWTFSS / LMMJVSD)
  const dayNames = isFrench 
    ? ['L', 'M', 'M', 'J', 'V', 'S', 'D']
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Format date as DD Month YYYY
  const formatEventDate = (date: Date) => {
    return format(date, 'd MMMM yyyy', { locale: dateLocale });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background pb-28">
      <TopBar title={t('dates.title')} />
      
      <div className="px-4 space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between py-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}</h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-muted">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <Card className="p-3">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {dayNames.map((d, i) => (
              <div key={i} className={`text-xs font-medium py-1 ${i === 4 ? 'text-primary' : 'text-muted-foreground'}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.slice(0, 35).map((day, i) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isFriday = isJumuah(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              const dayEvents = getEventsForDate(day);
              const hasEvent = dayEvents.length > 0;
              
              return (
                <div
                  key={i}
                  className={`aspect-square flex flex-col items-center justify-center text-sm rounded-lg relative
                    ${!isCurrentMonth ? 'text-muted-foreground/40' : ''}
                    ${isFriday && isCurrentMonth ? 'bg-primary/10 text-primary font-medium' : ''}
                    ${isToday ? 'ring-2 ring-primary' : ''}`}
                >
                  {day.getDate()}
                  {/* Event dots */}
                  {hasEvent && isCurrentMonth && (
                    <div className="flex gap-0.5 mt-0.5 absolute bottom-1">
                      {dayEvents.slice(0, 2).map((event, idx) => (
                        <div
                          key={idx}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: getEventColor(event.id) }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming Events */}
        <div>
          <h3 className="text-sm font-semibold mb-3">{t('dates.upcomingEvents')}</h3>
          <div className="space-y-3">
            {upcomingEvents.slice(0, 6).map((event) => (
              <motion.div key={event.id} whileTap={{ scale: 0.98 }}>
                <Card className="p-4 cursor-pointer hover:bg-muted/50" onClick={() => setSelectedEvent(event)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Color indicator */}
                      <div 
                        className="w-2 h-12 rounded-full mt-0.5 flex-shrink-0"
                        style={{ backgroundColor: getEventColor(event.id) }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {t(`dates.events.${event.id.replace(/-/g, '')}`, { defaultValue: event.name })}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{event.hijriDateString}</p>
                        <p className="text-xs text-muted-foreground">{formatEventDate(event.gregorianDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {event.daysUntil === 0 
                          ? t('common.today') 
                          : event.daysUntil === 1 
                            ? (isFrench ? 'Demain' : 'Tomorrow')
                            : t('dates.inDays', { days: event.daysUntil })}
                      </span>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Detail Sheet */}
      <Sheet open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[80vh] overflow-auto">
          {selectedEvent && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-8 rounded-full"
                    style={{ backgroundColor: getEventColor(selectedEvent.id) }}
                  />
                  <SheetTitle>
                    {t(`dates.events.${selectedEvent.id.replace(/-/g, '')}`, { defaultValue: selectedEvent.name })}
                  </SheetTitle>
                </div>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{selectedEvent.hijriDateString}</span>
                  <span>•</span>
                  <span>{formatEventDate(selectedEvent.gregorianDate)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t(`dates.events.${selectedEvent.id.replace(/-/g, '')}Meaning`, { defaultValue: selectedEvent.meaning })}
                </p>
                <div>
                  <h4 className="font-medium text-sm mb-2">{t('dates.recommendedActions')}</h4>
                  <ul className="space-y-2">
                    {selectedEvent.recommendedActions.map((action, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {t(`dates.events.${selectedEvent.id.replace(/-/g, '')}Action${i + 1}`, { defaultValue: action })}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <BottomNav />
    </motion.div>
  );
};

export default Dates;