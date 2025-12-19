import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { TopBar } from '@/components/ui/top-bar';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getUpcomingEvents, getDaysInMonth, isJumuah, IslamicEvent } from '@/data/islamicDates';

const Dates = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<(IslamicEvent & { gregorianDate: Date; daysUntil: number; hijriDateString: string }) | null>(null);
  
  const upcomingEvents = getUpcomingEvents();
  const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background pb-28">
      <TopBar title="Islamic Dates" />
      
      <div className="px-4 space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between py-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-muted">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <Card className="p-3">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className={`text-xs font-medium py-1 ${i === 5 ? 'text-primary' : 'text-muted-foreground'}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.slice(0, 35).map((day, i) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isFriday = isJumuah(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center text-sm rounded-lg
                    ${!isCurrentMonth ? 'text-muted-foreground/40' : ''}
                    ${isFriday && isCurrentMonth ? 'bg-primary/10 text-primary font-medium' : ''}
                    ${isToday ? 'ring-2 ring-primary' : ''}`}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming Events */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Upcoming Islamic Events</h3>
          <div className="space-y-3">
            {upcomingEvents.slice(0, 6).map((event) => (
              <motion.div key={event.id} whileTap={{ scale: 0.98 }}>
                <Card className="p-4 cursor-pointer hover:bg-muted/50" onClick={() => setSelectedEvent(event)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{event.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.hijriDateString}</p>
                      <p className="text-xs text-muted-foreground">{format(event.gregorianDate, 'MMMM d, yyyy')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        In {event.daysUntil} days
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
                <SheetTitle>{selectedEvent.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">{selectedEvent.meaning}</p>
                <div>
                  <h4 className="font-medium text-sm mb-2">Recommended Actions</h4>
                  <ul className="space-y-2">
                    {selectedEvent.recommendedActions.map((action, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {action}
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
