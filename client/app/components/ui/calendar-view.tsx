"use client"

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import '@/app/styles/calendar.css';
import useToDo from '@/app/hooks/useToDo';
import { ToDo } from '@/app/lib/definitions';
import { toast } from 'sonner';
import { TaskFormModal } from './task-form-modal';

export function CalendarPage() {

  const { todos, loading, error, updateToDo, refreshToDos, addToDo, deleteToDo, stats } = useToDo({});

  const convertToDosToFullCalendarEvents = (todos: ToDo[]) => {
    return todos.map((todo) => ({
      id: todo.id,
      title: todo.task,
      start: todo.deadlineDate, // FullCalendar uses the start field for the event's date
      allDay: true, // Assuming the deadlines are all-day events; adjust as needed
      extendedProps: {
        isComplete: todo.isComplete,
        moreDetails: todo.moreDetails,
        parentToDoId: todo.parentToDoId,
        children: todo.children,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
        editMode: todo.editMode,
      }
    }));
  };

  // const [convertedToDos, setConvertedToDos] = useState(convertToDosToFullCalendarEvents(todos));



  const handleDateClick = (arg) => {
    // handle date click
    alert(arg.dateStr);
  };

  const handleEventDrop = (info) => {
    // Here, you can handle the event drop, for example, update the event in your backend
    // alert(`Event moved to ${info.event.start.toISOString()}`);
    console.log("EVENT", info)
    const todoId = info.event.id;
    const newDeadlineDate = info.event.start.toISOString();
    const todo = todos.find((todo) => todo.id === todoId);
    if (todo) {
      const updatedTodo = { ...todo, deadlineDate: newDeadlineDate };
      updateToDo(updatedTodo);
    }
    const toastTitle = "Task has been updated"
    const toastDescription = "task has been moved to a new date."
    toast.success(toastTitle, {
      description: toastDescription,
    })

  };
  const handleEventClick = (info) => {
    // handle event click
    alert(info.event.title);
  }

  function injectCurrentDayIcon(info) {
    if (info.isToday) {
      // const iconSpan = document.createElement('span');
      // iconSpan.textContent = ' ⭐'; // Your icon here
      // info.el.querySelector('.fc-daygrid-day-top').appendChild(iconSpan);
    }
  }

  // const { handleDelete, error } = useContext(TableActionsContext);
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<"create" | "update" | "add subtask" | null>(null)
  const handleClose = () => setOpen(false)

  return (
    <div className="p-5">
      <TaskFormModal props={{ action, open, handleClose }} />
      <FullCalendar
        dayCellDidMount={injectCurrentDayIcon}
        customButtons={
          {
            myCustomButton: {
              text: 'Add Task',
              click: function () {
                // alert('clicked the custom button!');
                setOpen(true)
              }

            }
          }
        }
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today myCustomButton',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        // height={650}
        contentHeight={650}
        // aspectRatio={1.5}
        expandRows={true}
        handleWindowResize={true}
        windowResizeDelay={0}
        initialView="dayGridMonth"
        editable={true} // Allows events to be dragged and dropped
        eventDrop={handleEventDrop}
        weekends={true}
        events={convertToDosToFullCalendarEvents(todos)}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        stickyHeaderDates={true}
      />
    </div>
  );
};

export default CalendarPage;