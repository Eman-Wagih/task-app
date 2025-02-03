import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

let errMsg = null;
const addUser = async (data) => {
    const response = await fetch(`http://127.0.0.1:5000/api/v1/users`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const res = await response.json();
      console.log(res)
      errMsg = res.message
      throw new Error('Failed to add user');
    }
    return response.json();
}

const AddUser = () => {
  const [open, setOpen] = useState(false);
  
  const [err, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email:  '',
        job_title:  '',
      });
    
    async function handleSubmit(e) {
        e.preventDefault();
        console.log(formData)
          await addUser(formData).then(()=> setOpen(false)).catch(()=> setError(err)); 
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild onClick={()=> setOpen(true)}>
      <Button variant="outline">Add New User</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{!err ? 'Add User' : <p className='danger'>{err}</p>} </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-center inline-block mb-2">
              Name 
            </Label>
            <Input 
              id="name" 
              className="col-span-2 inline-block mb-2"  
              value={formData.name}
              onChange={handleChange}
              required
              name="name"
            />
             <br></br>
             <br></br>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-center inline-block mb-2">
              Email
            </Label>
            <Input 
              type='email' 
              id="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="col-span-2" 
              name="email"
            />
             <br></br>
             <br></br>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="job_title" className="text-center inline-block mb-2">
              Job Title
            </Label>
            <Input  
              id="job_title" 
              value={formData.job_title} 
              onChange={handleChange} 
              required 
              className="col-span-2" 
              name="job_title"
            />
             <br></br>
             <br></br>
             <br></br>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Add</Button>
        
        </DialogFooter>
        </form>
    </DialogContent>
  </Dialog>
  )
}
export default AddUser
