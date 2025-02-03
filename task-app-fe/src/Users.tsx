import {useState} from 'react'
import { useQuery } from '@tanstack/react-query'
import { user } from './interfaces/user';
import UserData from './UserData';
import './App.css'
import AddUser from './AddUser';
const fetchUsers = async () => {
    const response = await fetch("http://127.0.0.1:5000/api/v1/users");
    if (!response.ok) {
      throw new Error("something went wrong");
    }
    return response.json();
};

const Users = () => {
    const [chosenUser, setChosenUser] = useState<string | null>(null)

    const { data, error, isLoading } = useQuery({
        queryKey: ["users"], 
        queryFn: fetchUsers,     
    });
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>An error has occurred: {error.message}</p>;
    console.log(data)
   
    const selectedUser = data?.users?.find((user: user) => user.id.toString() === chosenUser);
    console.log(selectedUser)
    return (
        <>
            <aside className='flex flex-col aside'>
            <label htmlFor="users" className="inline-block m-8 ">Choose a user or: </label>
            <AddUser/>
            <select className="rounded-full border my-12"  name="users" id="users" onChange={(e)=> setChosenUser(e.target.value)}>
                {data.users.map((user: user) => {
                    return (
                        <option className='font-bold text-gray-900 px-4 text-center' key={user.id} value={user.id}>{user.name}</option>
                    )
                })}
            </select>
            </aside>
            <UserData user={selectedUser || data.users[0]} />
            {/* <Task userId={selectedUser.id}/> */}
        </>
    )
    }

export default Users