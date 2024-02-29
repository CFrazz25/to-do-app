import { ToDo } from '@/app/lib/definitions';
import { Dispatch, SetStateAction, forwardRef, useEffect, useRef, useState } from 'react';
import { Modal, Button, Form, Input, DatePicker, Schema, Checkbox } from 'rsuite';

const Textarea = forwardRef<HTMLInputElement, any>((props, ref) => <Input {...props} as="textarea" ref={ref} />);
Textarea.displayName = 'Textarea';

export default function ActionModal({ action, open, setOpen, data, onAddTask, onUpdateTask }: { action: 'create' | 'update', open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, data?: Partial<ToDo>, onAddTask?: (todo: ToDo) => Promise<void>, onUpdateTask?: (todo: ToDo) => Promise<void> }) {
  const formRef = useRef(null);
  const [formValue, setFormValue] = useState<Partial<ToDo>>(data || {
    task: '',
    deadlineDate: new Date(),
    isComplete: false,
    moreDetails: '',

  });

  useEffect(() => {
    setFormValue(data || {
      task: '',
      deadlineDate: new Date(),
      isComplete: false,
      moreDetails: '',

    }); // Update form data when the data prop changes
  }, [data]);

  const model = Schema.Model({
    task: Schema.Types.StringType().isRequired('This field is required.'),
    deadlineDate: Schema.Types.DateType().isRequired('This field is required.'),
    isComplete: Schema.Types.BooleanType(),
    moreDetails: Schema.Types.StringType(),
  });

  async function handleSubmit() {
    if (formRef.current && !formRef.current.check()) {
      console.error('Validation failed');
      return;
    }

    if (action === 'create') {
      await onAddTask(formValue as ToDo);
    } else {
      await onUpdateTask(formValue as ToDo);
    }
    setOpen(false);
    setFormValue({
      task: '',
      deadlineDate: new Date(),
      isComplete: false,
      moreDetails: '',
    });
  }

  const handleClose = () => {
    setOpen(false);
    setFormValue({
      task: '',
      deadlineDate: new Date(),
      isComplete: false,
      moreDetails: '',
    });
  };

  const title = action === 'create' ? 'New Task' : 'Update Task';

  return (
    <Modal open={open} onClose={handleClose} size="xs">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid ref={formRef} model={model} onSubmit={handleSubmit} formValue={formValue} onChange={setFormValue} >
          <Form.Group controlId="task">
            <Form.ControlLabel>Task</Form.ControlLabel>
            <Form.Control name="task" />
            <Form.HelpText>Required</Form.HelpText>
          </Form.Group>
          <Form.Group controlId="datePicker">
            <Form.ControlLabel>Deadline Date:</Form.ControlLabel>
            <Form.Control name="deadlineDate"
              accepter={DatePicker}
              value={formValue.deadlineDate}
              onChange={(value) => {
                setFormValue(prev => ({ ...prev, deadlineDate: value }));
              }}
            />
            <Form.HelpText>Required</Form.HelpText>
          </Form.Group>

          {action === 'update' && (
            <Form.Group controlId="isComplete">
              <Checkbox
                name="isComplete"
                checked={formValue.isComplete}
                onChange={(_, checked) => {
                  setFormValue(prev => ({ ...prev, isComplete: checked }));
                }}
              ></Checkbox>
              <Form.HelpText>Check if task completed.</Form.HelpText>
            </Form.Group>
          )}
          <Form.Group controlId="moreDetails">
            <Form.ControlLabel>More Details</Form.ControlLabel>
            <Form.Control rows={5} name="moreDetails" accepter={Textarea} />
          </Form.Group>
          <Button appearance="primary" type='submit'
            className='bg-blue-500 text-white'
          >
            Confirm
          </Button>
          <Button onClick={handleClose} appearance="subtle"
            className='bg-gray-500 text-white'
          >

            Cancel
          </Button>
        </Form>
      </Modal.Body>
    </Modal >
  )
}
