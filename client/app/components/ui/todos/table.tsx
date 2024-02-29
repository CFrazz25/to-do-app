import { useState } from 'react';
import { Table, Button } from 'rsuite';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import { formatDateToLocal } from '@/app/lib/utils';
import { ToDo } from '@/app/lib/definitions';
import ActionModal from '@/app/components/ui/todos/action-modal';

const { Column, HeaderCell, Cell } = Table;

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isPastDue(todo: ToDo): boolean {
  const today = normalizeDate(new Date());
  const deadlineDate = normalizeDate(new Date(todo.deadlineDate));
  return deadlineDate < today && !todo.isComplete;
}

export default function ToDosTable({ todos, onDelete, onUpdateTask, onAddTask, loading }: { todos: ToDo[], onDelete: (id: string) => Promise<void>, onUpdateTask: (todo: ToDo) => Promise<void>, onAddTask: (todo: ToDo, subTaskParentId?: string) => Promise<void>, loading: boolean }) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<'create' | 'update'>('update');
  const [editableDataRow, setEditableDataRow] = useState<Partial<ToDo>>(null);


  const handleRowClassName = (rowData: ToDo) => {
    // if deadline date is past today, highlight row
    if (!rowData?.deadlineDate) return;
    if (isPastDue(rowData)) {
      return 'highlight-row';
    }
  };

  const handleCellClassName = (rowData: ToDo) => {
    if (rowData.isComplete) {
      return 'line-through';
    }
  }

  const canAddSubtask = (todo: ToDo) => {
    return !todo.parentToDoId && (!todo.children || todo.children.length < 2);
  }

  return (
    <div>
      {!loading && (
        <Table
          isTree
          defaultExpandAllRows
          bordered
          cellBordered
          rowKey="id"
          autoHeight
          rowHeight={60}
          // height={400}
          data={todos}
          /** shouldUpdateScroll: whether to update the scroll bar after data update **/
          shouldUpdateScroll={false}
          renderTreeToggle={(icon, rowData) => {
            if (rowData?.children && rowData.children.length === 0) {
              return <SpinnerIcon spin />;
            }
            return icon;
          }}
          rowClassName={handleRowClassName}
        >
          <Column flexGrow={1}>
            <HeaderCell>Task</HeaderCell>
            <Cell dataKey="task" fullText >
              {(rowData: ToDo) => {
                return (
                  <div className={handleCellClassName(rowData)}>
                    {rowData.task}
                  </div>
                )
              }}
            </Cell>
          </Column>
          <Column flexGrow={1}>
            <HeaderCell >More Details</HeaderCell>
            <Cell dataKey="moreDetails" fullText >
              {(rowData: ToDo) => {
                return (
                  <div className={handleCellClassName(rowData)}>
                    {rowData.moreDetails}
                  </div>
                )
              }}
            </Cell>
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Deadline Date</HeaderCell>
            <Cell dataKey="deadlineDate" >
              {(rowData: ToDo) => {
                return (
                  <div>
                    {rowData.deadlineDate ? formatDateToLocal(rowData.deadlineDate.toString()) : ''}
                    {isPastDue(rowData) && <span className='pl-8 text-sky-400 font-bold text-base'>PAST DUE!</span>}
                  </div>
                )
              }}
            </Cell>
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Is Complete</HeaderCell>
            <Cell dataKey="isComplete">
              {(rowData: ToDo) => {
                return rowData.isComplete ? '✅' : '❌';
              }}
            </Cell>
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>...</HeaderCell>
            <Cell dataKey="id" wordWrap>
              {(rowData: ToDo) => {
                return (
                  <div>
                    <Button
                      appearance="link"
                      onClick={(event) => {
                        event.preventDefault();
                        const deadlineDate = rowData.deadlineDate ? new Date(rowData.deadlineDate) : null;
                        const updatedData = { ...rowData, deadlineDate };
                        setEditableDataRow(updatedData);
                        setAction('update')
                        setOpen(true);
                      }}
                    >
                      <PencilIcon className="w-5" />
                    </Button>
                    <button className="rounded-md border p-2 hover:bg-gray-100"
                      onClick={async (event) => {
                        event.preventDefault();
                        await onDelete(rowData.id);
                      }}
                    >
                      <span className="sr-only">Delete</span>
                      <TrashIcon className="w-5" />
                    </button>
                    {canAddSubtask(rowData) && (
                      <Button
                        appearance="link"
                        onClick={(event) => {
                          event.preventDefault();
                          setEditableDataRow({ parentToDoId: rowData.id, deadlineDate: new Date() });
                          setAction('create');
                          setOpen(true);
                        }}
                      >
                        <PlusIcon className="w-5" />
                      </Button>
                    )}
                  </div>
                );
              }}
            </Cell>
          </Column>
        </Table>
      )}
      <ActionModal action={action} open={open} setOpen={setOpen} onUpdateTask={onUpdateTask} onAddTask={onAddTask} data={editableDataRow} />
    </div>
  );
};
