import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useData } from '@/context/DataContext';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-6 border border-gray-200 rounded-lg bg-white shadow-sm relative z-0", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-2 border border-gray-200 rounded-lg",
        head_row: "flex bg-gray-50 border-b border-gray-200",
        head_cell:
          "text-muted-foreground rounded-md w-16 font-normal text-[0.8rem] py-2 border-r border-gray-200 last:border-r-0",
        row: "flex w-full border-b border-gray-200 last:border-b-0 relative z-1",
        cell: "h-16 w-16 text-center text-sm p-0 relative border border-gray-200 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-1",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export function TaskDeadlineCalendar({ onDateClick }: { onDateClick?: (date: Date) => void }) {
  const { tasks } = useData();

  // Agrupar tareas por fecha
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    
    const dateKey = new Date(task.dueDate).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = { 
        pending: 0, 
        'in-progress': 0, 
        completed: 0,
        tasks: [] as Array<{title: string, status: string}>
      };
    }
    const status = task.status || 'pending';
    acc[dateKey][status]++;
    acc[dateKey].tasks.push({ title: task.title, status: status });
    return acc;
  }, {} as Record<string, { 
    pending: number; 
    'in-progress': number; 
    completed: number;
    tasks: Array<{title: string, status: string}>;
  }>);

  // Componente Day personalizado
  const CustomDay = ({ date, ...props }: any) => {
    const dateKey = date.toDateString();
    const dayTasks = tasksByDate[dateKey];
    const totalTasks = dayTasks ? dayTasks.pending + dayTasks['in-progress'] + dayTasks.completed : 0;
    
    return (
      <div 
        className="h-16 w-16 flex flex-col items-center justify-center text-xs cursor-pointer hover:bg-blue-50 hover:shadow-md rounded-md relative group border-2 border-transparent hover:border-blue-300 transition-all duration-200 ease-in-out transform hover:scale-105 z-20"
        onClick={() => onDateClick?.(date)}
      >
        {/* Número del día */}
        <span className="text-base font-medium text-gray-900 group-hover:text-blue-700 transition-colors relative z-1">
          {date.getDate()}
        </span>
        
        {/* Contador de tareas */}
        {totalTasks > 0 && (
          <div className="flex items-center justify-center mt-1 relative z-1">
            <span className={`text-sm font-bold text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow ${
              totalTasks > 5 ? 'bg-red-500 group-hover:bg-red-600' : 
              totalTasks > 3 ? 'bg-orange-500 group-hover:bg-orange-600' : 
              'bg-blue-500 group-hover:bg-blue-600'
            }`}>
              {totalTasks}
            </span>
          </div>
        )}
        
        {/* Indicadores de estado */}
        {dayTasks && totalTasks > 0 && (
          <div className="flex gap-0.5 mt-1 relative z-1">
            {dayTasks.pending > 0 && (
              <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:bg-orange-600 transition-colors" title={`${dayTasks.pending} pendientes`}></div>
            )}
            {dayTasks['in-progress'] > 0 && (
              <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors" title={`${dayTasks['in-progress']} en progreso`}></div>
            )}
            {dayTasks.completed > 0 && (
              <div className="w-2 h-2 bg-green-500 rounded-full group-hover:bg-green-600 transition-colors" title={`${dayTasks.completed} completadas`}></div>
            )}
          </div>
        )}
        
        {/* Indicador de alta carga */}
        {totalTasks > 5 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white group-hover:animate-bounce"></div>
        )}
        
        {/* Indicador de clickeable cuando no hay tareas */}
        {totalTasks === 0 && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-blue-400 transition-colors"></div>
          </div>
        )}
        
        {/* Tooltip con detalles */}
        {dayTasks && totalTasks > 0 && (
          <div className="absolute left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[999999999] shadow-lg max-w-xs bottom-full mb-2">
            <div className="text-center">
              <div className="font-bold text-sm mb-1">{totalTasks} tareas</div>
              {dayTasks.pending > 0 && <div className="text-orange-300">• {dayTasks.pending} pendientes</div>}
              {dayTasks['in-progress'] > 0 && <div className="text-blue-300">• {dayTasks['in-progress']} en progreso</div>}
              {dayTasks.completed > 0 && <div className="text-green-300">• {dayTasks.completed} completadas</div>}
              
              {/* Mostrar nombres de tareas si hay pocas (hasta 5) */}
              {totalTasks <= 5 && dayTasks.tasks.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="text-xs text-gray-300 mb-1">Tareas:</div>
                  {/* Agrupar tareas por estado */}
                  {dayTasks.pending > 0 && (
                    <div className="mb-1">
                      <div className="text-xs text-orange-300 font-medium">Pendientes:</div>
                      {dayTasks.tasks
                        .filter(task => task.status === 'pending')
                        .map((task, index) => (
                          <div key={`pending-${index}`} className="text-left text-xs truncate ml-2">
                            • {task.title}
                          </div>
                        ))}
                    </div>
                  )}
                  {dayTasks['in-progress'] > 0 && (
                    <div className="mb-1">
                      <div className="text-xs text-blue-300 font-medium">En Progreso:</div>
                      {dayTasks.tasks
                        .filter(task => task.status === 'in-progress')
                        .map((task, index) => (
                          <div key={`in-progress-${index}`} className="text-left text-xs truncate ml-2">
                            • {task.title}
                          </div>
                        ))}
                    </div>
                  )}
                  {dayTasks.completed > 0 && (
                    <div className="mb-1">
                      <div className="text-xs text-green-300 font-medium">Completadas:</div>
                      {dayTasks.tasks
                        .filter(task => task.status === 'completed')
                        .map((task, index) => (
                          <div key={`completed-${index}`} className="text-left text-xs truncate ml-2">
                            • {task.title}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Calendario de Tareas</h3>
          <p className="text-xs text-gray-500 mt-1">Haz clic en cualquier día para ver las tareas</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
            <span>Pocas tareas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
            <span>Muchas tareas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">6</div>
            <span>Alta carga</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Pendientes</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>En Progreso</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Completadas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
            <span>Alta carga</span>
          </div>
        </div>
      </div>
      
      <Calendar
        className="rounded-lg border"
        components={{
          Day: CustomDay,
        }}
        showOutsideDays={true}
      />
    </div>
  );
}

export { Calendar };
