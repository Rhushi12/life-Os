
import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './Navbar';
import { View, Plan } from '../types';
import { Plus, X, GripVertical, Calendar, ChevronRight, Layout, ArrowLeft, GripHorizontal, Clock, Move } from 'lucide-react';
import { cn } from '../lib/utils';

interface PlannerProps {
    onNavigate: (view: View) => void;
    plan: Plan | null;
}

interface PlannerTask {
    id: string;
    title: string;
    subtitle?: string;
    dayIndex: number; // 0 = Mon, 6 = Sun
    startHour: number; // e.g., 9.5 for 9:30 AM
    duration: number; // in hours
    type: 'deep-work' | 'meeting' | 'admin' | 'break';
}

interface BacklogItem {
    id: string;
    title: string;
    subtitle: string;
    durationMinutes: number;
    milestoneId: string;
}

// Helper to get color based on type
const getTypeStyles = (type: PlannerTask['type']) => {
    switch (type) {
        case 'deep-work': return 'bg-[#5100fd]/20 border-[#5100fd] text-white hover:bg-[#5100fd]/30';
        case 'meeting': return 'bg-emerald-500/20 border-emerald-500 text-emerald-100 hover:bg-emerald-500/30';
        case 'admin': return 'bg-orange-500/20 border-orange-500 text-orange-100 hover:bg-orange-500/30';
        case 'break': return 'bg-zinc-700/40 border-zinc-600 text-zinc-300 hover:bg-zinc-700/60';
        default: return 'bg-zinc-800 border-zinc-600 text-zinc-300';
    }
};

// Helper to format decimal hours to 12h time
const formatTime = (decimalHour: number) => {
    const h = Math.floor(decimalHour);
    const m = Math.round((decimalHour - h) * 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h === 12 || h === 24 ? 12 : h); // Handle noon/midnight correctly
    const displayM = m < 10 ? `0${m}` : m;
    return `${displayH}:${displayM} ${ampm}`;
};

export default function Planner({ onNavigate, plan }: PlannerProps) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const startHour = 6;
    const endHour = 24; // Allow full day
    const hours = Array.from({ length: endHour - startHour }, (_, i) => i + startHour);
    const PIXELS_PER_HOUR = 80; // Increased for better visibility

    // Initial Mock Tasks
    const [tasks, setTasks] = useState<PlannerTask[]>([
        { id: '1', title: 'Morning Routine', subtitle: 'Health', dayIndex: 0, startHour: 7, duration: 1, type: 'break' },
        { id: '2', title: 'Deep Work', subtitle: 'Strategy Doc', dayIndex: 0, startHour: 9, duration: 2, type: 'deep-work' },
        { id: '3', title: 'Team Sync', subtitle: 'Weekly Standup', dayIndex: 1, startHour: 11, duration: 1, type: 'meeting' },
    ]);

    const [backlog, setBacklog] = useState<BacklogItem[]>([]);
    const [draggedTask, setDraggedTask] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Selection State for Click & Hold
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionBlock, setSelectionBlock] = useState<{
        startDayIndex: number;
        startHour: number;
        endDayIndex: number;
        endHour: number;
    } | null>(null);

    // Resizing State
    const [resizingTaskId, setResizingTaskId] = useState<string | null>(null);
    const [initialResizeY, setInitialResizeY] = useState(0);
    const [initialResizeDuration, setInitialResizeDuration] = useState(0);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [newTaskParams, setNewTaskParams] = useState<{ startDayIndex: number, endDayIndex: number, startHour: number } | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskType, setNewTaskType] = useState<PlannerTask['type']>('deep-work');
    const [newTaskDuration, setNewTaskDuration] = useState(1);

    // Time Indicator
    const [currentTime, setCurrentTime] = useState(new Date());
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);

        // Initial scroll to current time
        if (scrollContainerRef.current) {
            const currentH = new Date().getHours();
            const scrollY = Math.max
                (0, (currentH - startHour - 1) * PIXELS_PER_HOUR);
            scrollContainerRef.current.scrollTop = scrollY;
        }

        return () => clearInterval(timer);
    }, []);

    // Load Plan into Backlog
    useEffect(() => {
        if (plan) {
            const items: BacklogItem[] = [];
            plan.milestones.forEach(m => {
                m.tasks.forEach(t => {
                    const onBoard = tasks.some(pt => pt.id === t.id);
                    if (!onBoard) {
                        items.push({
                            id: t.id,
                            title: t.title,
                            subtitle: m.title,
                            durationMinutes: t.durationMinutes,
                            milestoneId: m.id
                        });
                    }
                });
            });
            setBacklog(items);
        }
    }, [plan]);

    // --- Drag Handlers (Moving) ---
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTask(taskId);
        e.dataTransfer.effectAllowed = "move";
        // Use a cleaner drag image if possible, or default
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, dayIndex: number) => {
        e.preventDefault();
        if (!draggedTask) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        // Calculate hour with snapping to 15 mins (0.25h)
        const rawHour = startHour + (offsetY / PIXELS_PER_HOUR);
        const snappedHour = Math.round(rawHour * 4) / 4;

        // Prevent dropping before startHour
        const finalHour = Math.max(startHour, snappedHour);

        const existingTaskIndex = tasks.findIndex(t => t.id === draggedTask);

        if (existingTaskIndex !== -1) {
            // Moving existing task
            setTasks(prev => {
                const newTasks = [...prev];
                newTasks[existingTaskIndex] = {
                    ...newTasks[existingTaskIndex],
                    dayIndex,
                    startHour: finalHour
                };
                return newTasks;
            });
        } else {
            // Dropping from sidebar
            const backlogItem = backlog.find(t => t.id === draggedTask);
            if (backlogItem) {
                const newTask: PlannerTask = {
                    id: backlogItem.id,
                    title: backlogItem.title,
                    subtitle: backlogItem.subtitle,
                    dayIndex,
                    startHour: finalHour,
                    duration: backlogItem.durationMinutes ? backlogItem.durationMinutes / 60 : 1,
                    type: 'deep-work'
                };
                setTasks(prev => [...prev, newTask]);
                setBacklog(prev => prev.filter(t => t.id !== draggedTask));
            }
        }
        setDraggedTask(null);
    };

    // --- Click & Drag to Create Handlers ---
    const handleMouseDown = (e: React.MouseEvent, dayIndex: number) => {
        if (e.button !== 0) return; // Only left click
        if ((e.target as HTMLElement).closest('.planner-task')) return; // Ignore clicks on tasks

        const rect = e.currentTarget.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        const rawHour = startHour + (offsetY / PIXELS_PER_HOUR);
        const snappedHour = Math.round(rawHour * 4) / 4;

        setIsSelecting(true);
        setSelectionBlock({
            startDayIndex: dayIndex,
            startHour: snappedHour,
            endDayIndex: dayIndex,
            endHour: snappedHour + 0.5 // Default start duration
        });
    };

    const handleMouseMove = (e: React.MouseEvent, dayIndex: number) => {
        if (!isSelecting || !selectionBlock) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        const rawHour = startHour + (offsetY / PIXELS_PER_HOUR);

        // Snap end time
        let potentialEnd = Math.round(rawHour * 4) / 4;

        // Update end day index based on current column
        const newEndDayIndex = dayIndex;

        // Logic for dragging backwards in time or days could go here
        // For now, simple forward/backward logic

        setSelectionBlock(prev => prev ? ({
            ...prev,
            endDayIndex: newEndDayIndex,
            endHour: potentialEnd
        }) : null);
    };

    const handleMouseUp = () => {
        if (isSelecting && selectionBlock) {
            // Normalize start/end for creation
            const minDay = Math.min(selectionBlock.startDayIndex, selectionBlock.endDayIndex);
            const maxDay = Math.max(selectionBlock.startDayIndex, selectionBlock.endDayIndex);

            // For duration, we use the time difference. 
            // If spanning days, we might want to set a standard duration or calculate per day.
            // Current logic: If same day, calculate diff. If multi-day, use the time range for EACH day?
            // Or just use the end hour of the last day?
            // Let's assume the user wants the SAME time block across days, OR a continuous block?
            // "Click and drag across multiple days" usually implies a continuous block or repeating block.
            // Given the grid, a continuous block wrapping overnight is complex.
            // Let's implement: Create a task for EACH day in the range, with the specified start/end times.
            // Wait, if I drag from Mon 10am to Tue 12pm, what does that mean?
            // Option A: Mon 10am -> Tue 12pm (26 hours).
            // Option B: Mon 10am-End, Tue Start-12pm.
            // Option C: Mon 10am-12pm AND Tue 10am-12pm (Repeating).

            // Let's go with Option C (Repeating) if the times are similar, or Option A if it looks like a span.
            // Actually, the simplest and most intuitive for this grid is:
            // The selection defines the Start Time (from first click) and End Time (from release).
            // And it applies to ALL days in the range.
            // BUT, if I drag diagonally, I might want Mon 10am to Tue 2pm.
            // Let's stick to the implementation plan: "Split into separate tasks for each day".
            // But what are the times for each day?
            // If I drag Mon 9am -> Tue 11am.
            // Does it mean Mon 9am-11am AND Tue 9am-11am? Or Mon 9am-Midnight, Tue 0am-11am?
            // The "Ghost Block" visual will tell us.
            // If I update the ghost block to show on ALL days between start/end, it implies repeating.
            // If I update it to show a continuous flow, it implies spanning.
            // Let's implement "Repeating Time Block" for now as it's easier to control with a mouse.
            // i.e. Start Hour and End Hour apply to ALL selected days.

            // Wait, `handleMouseMove` calculates `potentialEnd` based on the current mouse Y.
            // So if I start Mon 9am and drag to Tue 11am, `startHour` is 9, `endHour` is 11.
            // So tasks will be Mon 9-11, Tue 9-11.
            // This feels intuitive for "I want to block this time for these days".

            let startH = selectionBlock.startHour;
            let endH = selectionBlock.endHour;

            // Handle reverse time drag
            if (endH < startH) {
                [startH, endH] = [endH, startH];
            }

            // Ensure min duration
            if (endH - startH < 0.25) endH = startH + 0.25;

            setNewTaskParams({
                startDayIndex: minDay,
                endDayIndex: maxDay,
                startHour: startH
            });
            setNewTaskDuration(endH - startH);
            setNewTaskTitle('');
            setNewTaskType('deep-work');
            setShowModal(true);
        }
        setIsSelecting(false);
        setSelectionBlock(null);
    };

    // --- Resize Handlers ---
    const handleResizeStart = (e: React.MouseEvent, taskId: string, currentDuration: number) => {
        e.stopPropagation();
        e.preventDefault();
        setResizingTaskId(taskId);
        setInitialResizeY(e.clientY);
        setInitialResizeDuration(currentDuration);
    };

    // Global Mouse Listeners for Resizing & Finishing Select
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (resizingTaskId) {
                const deltaY = e.clientY - initialResizeY;
                const deltaHours = deltaY / PIXELS_PER_HOUR;
                const newDuration = Math.max(0.25, initialResizeDuration + deltaHours);

                // Snap to 15 mins
                const snappedDuration = Math.round(newDuration * 4) / 4;

                setTasks(prev => prev.map(t =>
                    t.id === resizingTaskId ? { ...t, duration: snappedDuration } : t
                ));
            }
        };

        const handleGlobalMouseUp = () => {
            if (resizingTaskId) {
                setResizingTaskId(null);
            }
            if (isSelecting) {
                handleMouseUp();
            }
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [resizingTaskId, initialResizeY, initialResizeDuration, isSelecting, selectionBlock]);

    const saveNewTask = () => {
        if (!newTaskParams || !newTaskTitle.trim()) return;

        const newTasks: PlannerTask[] = [];
        const { startDayIndex, endDayIndex, startHour } = newTaskParams;

        for (let i = startDayIndex; i <= endDayIndex; i++) {
            newTasks.push({
                id: Math.random().toString(36).substr(2, 9),
                title: newTaskTitle,
                subtitle: 'Custom Block',
                dayIndex: i,
                startHour: startHour,
                duration: newTaskDuration,
                type: newTaskType,
            });
        }

        setTasks([...tasks, ...newTasks]);
        setShowModal(false);
    };

    const deleteTask = (id: string) => {
        const taskToDelete = tasks.find(t => t.id === id);
        if (taskToDelete && taskToDelete.id.startsWith('t-') && plan) {
            const originalMilestone = plan.milestones.find(m => m.tasks.some(t => t.id === id));
            if (originalMilestone) {
                setBacklog(prev => [...prev, {
                    id: taskToDelete.id,
                    title: taskToDelete.title,
                    subtitle: originalMilestone.title,
                    durationMinutes: taskToDelete.duration * 60,
                    milestoneId: originalMilestone.id
                }]);
            }
        }
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    // Calculate current time line position
    const currentDayIndex = (currentTime.getDay() + 6) % 7; // Shift so Mon=0
    const currentHourDecimal = currentTime.getHours() + currentTime.getMinutes() / 60;
    const showTimeLine = currentHourDecimal >= startHour && currentHourDecimal <= endHour;
    const timeLineTop = (currentHourDecimal - startHour) * PIXELS_PER_HOUR;

    return (
        <div className="min-h-screen w-full bg-black pt-24 pb-20 relative select-none flex flex-col overflow-hidden">
            <Navbar onNavigate={onNavigate} currentView="planner" />

            <div className="flex flex-1 container mx-auto px-4 max-w-[1600px] gap-10 animate-fade-in h-[calc(100vh-120px)]">

                {/* Sidebar (Backlog) */}
                <div className={`transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isSidebarOpen ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-10'} flex-shrink-0 relative h-full overflow-hidden`}>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl h-full flex flex-col shadow-xl w-80">
                        <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 backdrop-blur-sm">
                            <div>
                                <h2 className="text-white font-medium flex items-center gap-2">
                                    <Layout className="w-4 h-4 text-[#5100fd]" />
                                    Backlog
                                </h2>
                                <p className="text-xs text-zinc-500 mt-1">Drag to schedule</p>
                            </div>
                            <span className="text-xs font-bold text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">{backlog.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {backlog.length === 0 && (
                                <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
                                        <Calendar className="w-5 h-5 text-zinc-600" />
                                    </div>
                                    <p className="text-zinc-500 text-sm">All tasks scheduled.</p>
                                </div>
                            )}
                            {backlog.map(item => (
                                <div
                                    key={item.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, item.id)}
                                    className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl cursor-move hover:border-[#5100fd]/50 hover:bg-zinc-900 hover:shadow-lg transition-all group relative"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-zinc-200 text-sm font-medium leading-snug pr-6">{item.title}</h4>
                                        <GripVertical className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 absolute right-3 top-4" />
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider truncate max-w-[140px] bg-black px-1.5 py-0.5 rounded border border-zinc-800">{item.subtitle}</span>
                                        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {item.durationMinutes}m
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Calendar Grid */}
                <div className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-2xl h-full overflow-hidden flex flex-col relative backdrop-blur-sm shadow-2xl">

                    {/* Header Row */}
                    <div className="flex border-b border-zinc-800 bg-zinc-900/80 backdrop-blur z-20 sticky top-0">
                        <div className="w-16 border-r border-zinc-800/50 flex-shrink-0 bg-zinc-900/50 flex items-center justify-center">
                            {/* Toggle Sidebar Button - Moved Inside Header */}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className={cn(
                                    "p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300",
                                    isSidebarOpen ? "bg-[#5100fd]/10 text-[#5100fd]" : ""
                                )}
                                title={isSidebarOpen ? "Hide Backlog" : "Show Backlog"}
                            >
                                <Layout className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 grid grid-cols-7">
                            {days.map((day, i) => {
                                const isToday = currentDayIndex === i;
                                return (
                                    <div key={day} className={cn(
                                        "py-4 text-center border-r border-zinc-800/50 last:border-r-0 relative overflow-hidden",
                                        isToday && "bg-[#5100fd]/5"
                                    )}>
                                        <div className={cn(
                                            "text-sm font-medium uppercase tracking-wider",
                                            isToday ? "text-[#5100fd]" : "text-zinc-400"
                                        )}>{day}</div>
                                        {isToday && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5100fd] shadow-[0_0_10px_#5100fd]" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Scrollable Grid Area */}
                    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative custom-scrollbar" style={{ scrollBehavior: 'auto' }}>
                        <div className="flex relative min-h-full" style={{ height: hours.length * PIXELS_PER_HOUR }}>

                            {/* Time Labels Column */}
                            <div className="w-16 border-r border-zinc-800/50 flex-shrink-0 sticky left-0 bg-zinc-950 z-10 select-none">
                                {hours.map(h => (
                                    <div key={h} className="relative border-b border-zinc-800/30 box-border" style={{ height: PIXELS_PER_HOUR }}>
                                        <span className="absolute -top-3 right-2 text-[11px] text-zinc-500 font-mono font-medium">
                                            {h > 12 ? h - 12 : (h === 12 ? 12 : h)} {h >= 12 ? 'PM' : 'AM'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Day Columns */}
                            <div className="flex-1 grid grid-cols-7 relative">
                                {/* Horizontal Grid Lines Background */}
                                <div className="absolute inset-0 pointer-events-none z-0">
                                    {hours.map(h => (
                                        <div key={h} className="border-b border-zinc-800/30 w-full" style={{ height: PIXELS_PER_HOUR }}>
                                            {/* Half hour dashed line */}
                                            <div className="w-full h-[1px] border-t border-dashed border-zinc-800/20 relative" style={{ top: '50%' }}></div>
                                        </div>
                                    ))}
                                </div>

                                {days.map((_, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={cn(
                                            "relative border-r border-zinc-800/30 h-full z-10 group",
                                            // Hover effect on column to encourage interaction
                                            "hover:bg-white/[0.02] transition-colors"
                                        )}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, dayIndex)}
                                        onMouseDown={(e) => handleMouseDown(e, dayIndex)}
                                        onMouseMove={(e) => handleMouseMove(e, dayIndex)}
                                    >
                                        {/* Current Time Line */}
                                        {showTimeLine && currentDayIndex === dayIndex && (
                                            <div
                                                className="absolute left-0 right-0 border-t-2 border-red-500 z-50 pointer-events-none flex items-center"
                                                style={{ top: timeLineTop }}
                                            >
                                                <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 shadow-[0_0_5px_red]"></div>
                                            </div>
                                        )}

                                        {/* Tasks */}
                                        {tasks.filter(t => t.dayIndex === dayIndex).map(task => {
                                            const top = (task.startHour - startHour) * PIXELS_PER_HOUR;
                                            const height = task.duration * PIXELS_PER_HOUR;
                                            const isSmall = height < 40;

                                            return (
                                                <div
                                                    key={task.id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                                    className={cn(
                                                        "absolute left-1 right-1 rounded-lg border shadow-sm transition-all overflow-hidden planner-task group/task",
                                                        getTypeStyles(task.type),
                                                        resizingTaskId === task.id ? "z-50 opacity-90 ring-2 ring-white/20" : "z-20 hover:z-30"
                                                    )}
                                                    style={{ top: `${top}px`, height: `${height}px` }}
                                                >
                                                    {/* Resize Handle */}
                                                    <div
                                                        className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize z-40 hover:bg-white/10 flex items-center justify-center opacity-0 group-hover/task:opacity-100 transition-opacity"
                                                        onMouseDown={(e) => handleResizeStart(e, task.id, task.duration)}
                                                    >
                                                        <div className="w-8 h-1 rounded-full bg-white/20"></div>
                                                    </div>

                                                    <div className={cn("p-2 h-full flex flex-col", isSmall ? "justify-center" : "")}>
                                                        <div className="flex justify-between items-start gap-2">
                                                            <span className="font-semibold text-xs leading-tight truncate">{task.title}</span>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                                                className="opacity-0 group-hover/task:opacity-100 hover:text-red-400 transition-opacity flex-shrink-0"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>

                                                        {!isSmall && (
                                                            <>
                                                                <div className="text-[10px] opacity-70 truncate mt-0.5">{task.subtitle}</div>
                                                                <div className="mt-auto pt-1 flex items-center gap-1 text-[10px] font-mono opacity-60">
                                                                    <Clock className="w-2.5 h-2.5" />
                                                                    {formatTime(task.startHour)} - {formatTime(task.startHour + task.duration)}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Selection Highlight (Ghost Block) */}
                                        {isSelecting && selectionBlock &&
                                            dayIndex >= Math.min(selectionBlock.startDayIndex, selectionBlock.endDayIndex) &&
                                            dayIndex <= Math.max(selectionBlock.startDayIndex, selectionBlock.endDayIndex) && (
                                                <div
                                                    className="absolute left-1 right-1 bg-[#5100fd]/20 border-2 border-dashed border-[#5100fd] rounded-lg z-30 pointer-events-none flex flex-col justify-center items-center text-white animate-pulse"
                                                    style={{
                                                        top: (Math.min(selectionBlock.startHour, selectionBlock.endHour) - startHour) * PIXELS_PER_HOUR,
                                                        height: Math.abs(selectionBlock.endHour - selectionBlock.startHour) * PIXELS_PER_HOUR
                                                    }}
                                                >
                                                    <span className="text-xs font-bold text-[#5100fd]">New Block</span>
                                                    <span className="text-[10px] font-mono bg-black/50 px-1 rounded mt-1">
                                                        {formatTime(Math.min(selectionBlock.startHour, selectionBlock.endHour))} - {formatTime(Math.max(selectionBlock.startHour, selectionBlock.endHour))}
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Task Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl text-white font-light">Schedule Block</h3>
                            <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-medium">Activity Title</label>
                                <input
                                    autoFocus
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="e.g. Deep Work Session"
                                    className="w-full bg-black border border-zinc-800 rounded-xl p-3.5 text-white focus:border-[#5100fd] focus:ring-1 focus:ring-[#5100fd] outline-none transition-all placeholder:text-zinc-700"
                                    onKeyDown={(e) => e.key === 'Enter' && saveNewTask()}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-medium">Category</label>
                                    <div className="relative">
                                        <select
                                            value={newTaskType}
                                            onChange={(e) => setNewTaskType(e.target.value as PlannerTask['type'])}
                                            className="w-full bg-black border border-zinc-800 rounded-xl p-3.5 text-white outline-none appearance-none cursor-pointer hover:border-zinc-700 transition-colors"
                                        >
                                            <option value="deep-work">Deep Work</option>
                                            <option value="meeting">Meeting</option>
                                            <option value="admin">Admin</option>
                                            <option value="break">Break</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                            <ChevronRight className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-medium">Duration (h)</label>
                                    <input
                                        type="number"
                                        step="0.25"
                                        min="0.25"
                                        value={newTaskDuration}
                                        onChange={(e) => setNewTaskDuration(parseFloat(e.target.value))}
                                        className="w-full bg-black border border-zinc-800 rounded-xl p-3.5 text-white outline-none hover:border-zinc-700 focus:border-[#5100fd] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8 pt-4 border-t border-zinc-900">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveNewTask}
                                className="flex-1 py-3 bg-[#5100fd] hover:bg-[#6610ff] text-white rounded-xl font-medium shadow-[0_0_20px_-5px_rgba(81,0,253,0.5)] transition-all hover:scale-[1.02]"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
