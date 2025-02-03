import { useState } from 'react';
import { MdOutlineDeleteForever } from 'react-icons/md';
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
import { task } from './interfaces/task';
import { useMutation, useQueryClient } from '@tanstack/react-query';


// const deleteTask = async (id: number) => {
//      await fetch(`http://127.0.0.1:5000/api/v1/tasks/${id}`, {
//       method: 'DELETE',
//     })
// };

const TaskControl = ({task}: { task: task }) => {
  const queryClient = useQueryClient();

  // Mutation for deleting a task
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`http://127.0.0.1:5000/api/v1/tasks/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["task", task.id]); // Refetch tasks
    },
  });

    // const [action, setAction] = useState<'edit' | 'delete' | null>(null);
    // if (action === 'delete') {
    //   deleteTask(task?.id?? 0);
    //   onDelete(task?.id); 
    // }; 
  return (
    <>
    <div className="flex justify-between ">
      <div>
        <AddEditTask actionType={'Edit'} id={task?.id?? 0} task={task}/>
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteMutation.mutate(task?.id ?? 0)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
    </div>
    </>
  );
};

export default TaskControl;
