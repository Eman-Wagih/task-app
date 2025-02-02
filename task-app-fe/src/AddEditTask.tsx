import React, { useState } from 'react';
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

const addTask = async (data) => {
    const response = await fetch(`http://127.0.0.1:5000/api/v1/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to edit task');
    }
    return response.json();
}


const updateTask = async (id, data) => {
    const response = await fetch(`http://127.0.0.1:5000/api/v1/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to edit task');
    }
    return response.json();
}

const AddEditTask = ({ actionType, id, task }) => {
  const [formData, setFormData] = useState({
    description: task?.description ||  '',
    start_date: task?.start_date || '',
    end_date: task?.end_date || '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (actionType === 'Add') {
        const data = Object.assign(formData, {userId: id})
        addTask(data)
    } else {
        updateTask(id, formData)
    }
    
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  return (
    <div className='bg-red-500'> 
    <Dialog>
      <DialogTrigger asChild>
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
          <DialogTitle>{actionType} Task</DialogTitle>
          <DialogDescription>
            Make changes to the task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Task Description
            </Label>
            <Input
              id="description"
              name="description"
              className="col-span-3"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start_date" className="text-right">
              Start Date
            </Label>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              className="col-span-3"
              value={formData.start_date}
              defaultValue={task.start_date || null}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end_date" className="text-right">
              End Date
            </Label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              className="col-span-3"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
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
