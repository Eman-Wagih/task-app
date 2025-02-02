import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import AddEditTask from './AddEditTask';
import './App.css'


const deleteTask = async (id) => {
    const response = await fetch(`http://127.0.0.1:5000/api/v1/tasks/${id}`, {
      method: 'DELETE',
    })
};

const TaskControl = ({task}) => {
    const [action, setAction] = useState<'edit' | 'delete' | null>(null);
    if (action === 'delete') {
      deleteTask(task.id);
    }; 
  return (
    <>
    <div className="flex justify-between ">
      <div>
        <AddEditTask actionType={'Edit'} id={task.id} task={task}/>
      </div>
      <div>
      <AlertDialog>
      <AlertDialogTrigger asChild>
      <MdOutlineDeleteForever />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setAction(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteTask(task.id)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
    </div>
    </>
  );
};

export default TaskControl;
