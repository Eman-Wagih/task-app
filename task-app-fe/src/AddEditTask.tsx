import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegEdit } from 'react-icons/fa';
import './App.css'
import { task } from './interfaces/task';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AddEditTaskProps {
  actionType: 'Add' | 'Edit';
  id: number;
  task?: task; 
}
const AddEditTask: React.FC<AddEditTaskProps> = ({ actionType, id, task }) => {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState('')
  const [formData, setFormData] = useState({
    description: task?.description ||  '',
    start_date: task?.start_date || '',
    end_date: task?.end_date || '',
  });

  const queryClient = useQueryClient();

  const addTaskMutation = useMutation({
    mutationFn: async (data: task) => {
      const response = await fetch(`http://127.0.0.1:5000/api/v1/tasks`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      console.log(response.json())
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", id]); 
      setOpen(false);
    },
    onError: (error: Error) => {
      setOpen(true);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (data: task) => {
      const response = await fetch(`http://127.0.0.1:5000/api/v1/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", id]); 
      setOpen(false);
    },
    onError: (error: Error) => {
      setOpen(true);
    },
  });
  
  
  function isMoreThanHours(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
      const differenceInMillis = Math.abs(startDate - endDate);
      const differenceInHours = differenceInMillis / (1000 * 60 * 60);
      return differenceInHours > 8;
  }
  

 async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault()
    const { description, start_date, end_date } = formData;
    if (start_date > end_date) {
      setErr('Start Date cant be before end Date');
      setOpen(true);
      return;

    } else if (isMoreThanHours(start_date, end_date)) {
      console.log(isMoreThanHours(start_date, end_date))
      setErr('task cannot exceed 8 hours');
      setOpen(true);
      return;
    }
    if (actionType === 'Add') {
      const newTask = { ...formData, userId: id }; 
      addTaskMutation.mutate(newTask); 
    } else {
      updateTaskMutation.mutate({
        id: task?.id ?? 0, 
        description,
        start_date,
        end_date,
        userId: task?.userId ?? 0
      });
    }
}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChange(e: any) {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }


  return (
    <div className='bg-red-500'> 
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={()=> setOpen(true)}>
      <span className="flex items-center gap-2">
        {actionType === "Add" && (
        <p className="flex items-center gap-1">
          <IoIosAddCircleOutline /> {actionType} Task
        </p>
      )}
      {actionType === "Edit" && <FaRegEdit />}
    </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> {err ? err: `${actionType} Task`}  </DialogTitle>
          <DialogDescription>
            Make changes to the task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-center inline-block mb-2">
              Task Description
            </Label>
            <Input
              id="description"
              name="description"
              className="col-span-2"
              value={formData.description}
              onChange={handleChange}
              required
            />
           <br></br>
           <br></br>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start_date" className="text-center inline-block mb-2">
              Start Date
            </Label>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              className="col-span-2"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
           <br></br>
           <br></br>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end_date" className="text-center inline-block mb-2">
              End Date
            </Label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              className="col-span-2"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
             <br></br>
             <br></br>
             <br></br>
          </div>
          <DialogFooter>
            <Button type="submit">{actionType} Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default AddEditTask;
