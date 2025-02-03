import { user } from './interfaces/user'
import Task from './Task'
import { task } from './interfaces/task';
import AddEditTask from './AddEditTask';



const UserData = ({user}: {user: user}) => {
  console.log(user)
  const calculateDuration = (start_date: string, end_date: string) => {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const durationInMillis = end.getTime() - start.getTime(); 
    return durationInMillis / (1000 * 60); 
  };
  
  const getTotalDuration = (tasks: task[]) => {
    return tasks.reduce((totalDuration, task) => {
      return totalDuration + calculateDuration(task.start_date, task.end_date);
    }, 0);
  };
    const totalDuration = getTotalDuration(user.tasks);
    const allocatedTime = 480 - totalDuration;


  function getHoursAndMinutes (time: number) {
      return time >= 60
      ? ` ${Math.floor(time / 60)} hours ${time % 60} minutes`
      : `${time} minutes`
  }
  return (
    <>  
        <div className='font-bold text-gray-500 flex flex-col items-center' key={user.id}> 
          <ul className='list-none'>
            <li> Employee name: <strong>{user.name}</strong> </li>
            <li> Email: <strong>{user.email} </strong></li>
            <a>Send Reminder?</a> 
            <li> Position: <strong>{user.job_title} </strong></li>
            <li>
              Total tasks duration: <strong>{getHoursAndMinutes(totalDuration)} </strong>
            </li>
            <li> Remaining: <strong>{getHoursAndMinutes(allocatedTime)} </strong></li>
          </ul>
            {allocatedTime > 0 &&  <AddEditTask actionType={'Add'} id={user.id}/>}
            {allocatedTime <= 0 && <p> {user.name} has reached their daily limit </p>}
         </div>
        <Task userId={user.id}/>
    </>
  )
}

export default UserData