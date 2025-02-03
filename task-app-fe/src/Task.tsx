import { task } from './interfaces/task';
import TaskControl from './TaskControl';
import './App.css'


const Task = ({tasks}) => {
    function converDate (date:string): Date  {
      const dateConverted = new Date(date); 
      return dateConverted
    }
  if (tasks) {
  return (
    <div className='allTasks flex items-center '>
    {tasks.map((tasky: task) => (
    <div key={tasky.id} className='task flex flex-col items-center px-2 bg-indigo-500'> 
      {/* <ul  className='list-none'> */}
        <p>Task Description: <strong>{tasky.description} </strong></p>
        <p> From: <strong>{converDate(tasky.start_date).getHours()}:{converDate(tasky.start_date).getMinutes()}</strong></p>
        <p> To: <strong>{converDate(tasky.end_date).getHours()}:{converDate(tasky.end_date).getMinutes()}</strong></p>
        <p>
        Duration: <strong>{Math.floor((converDate(tasky.end_date).getTime() - converDate(tasky.start_date).getTime()) / (1000 * 60 ))} Minutes
        </strong></p>
      {/* </ul> */}
      <TaskControl task={tasky}/>
    </div>
    ))}
  </div>
  )
}}

export default Task