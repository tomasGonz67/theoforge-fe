import React, { useState, useEffect } from 'react';
import { EyeIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { cn } from '../lib/utils';

interface User {
  id: number;
  name: string | null;
  email: string;
  role: "ADMIN" | "USER";
  status: 'active' | 'inactive';
  lastLogin: string;
  nickname: string;
  hashed_password: string;
  first_name: string | null;
  last_name: string | null;
  email_verified: boolean;
  verification_token: string | null; 
  created_at: string;
  updated_at: string;
  failed_login_attempts: number;
  is_locked: boolean;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null; 
  card_number: string | null;
  ccv: string | null;
  security_code: string | null;
  subscription_plan: "PREMIUM" | "FREE";

}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<User | null>(null);
  const [createFormData, setCreateFormData] = useState<User | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/auth/users'); // URL as per backend configuration
      console.log(response.data)
      setUsers(response.data); // Assuming the API returns a list of users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };
  
  
  {/* The old Users List with the Dummy Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 3 === 0 ? 'Admin' : 'User',
        status: i % 4 === 0 ? 'inactive' : 'active',
        lastLogin: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      }));

      setUsers(dummyUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };
 */}


  const handleEdit = async(user: User) => {
    setSelectedUser(user);
    setEditFormData(user);
    setIsEditModalOpen(true);
    
  };

  const handleCreate = () => {
    setCreateFormData(createFormData ? createFormData : {} as User);
    setIsCreateModalOpen(true);
  };

  const viewField = (field: string | boolean, value: string | null) => {
      return (
        <div className="inline-flex flex-row gap-2 w-full">
          <Typography variant="small" color="blue-gray" className="font-normal w-24">
            {field}
          </Typography>
          <Card className={value ? value.length > 0 ? "overscroll-x-contain overflow-auto border-black border-2 h-min w-full" :
          "overscroll-x-contain overflow-auto border-black border-2 w-full" :
          "overscroll-x-contain overflow-auto w-full"}>
            <Typography variant="small" color="blue-gray" className="font-normal overscroll-x-contain overflow-auto p-2">
              {value}
            </Typography>
          </Card>
        </div>
      )
    }

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  }

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJVU0VSIiwiZXhwIjoxNzQyODAzMzY3fQ.fCDSFSb_mc8GOIbcDhrSUyIBrPYz9Qoayawc-bhFew0'

  const Authorize = async() => {
    try {
      await axios.get('http://localhost:8000/auth/auth', {
      headers: { 'Authorization' : `Bearer ${token}` },
     }).then(result => {
      console.log(result.data)
     }).catch(err => {
      console.log(err)
     });
   } catch(err) {
    console.log(err)
   };
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  
  const handleEditSubmit = async () => {
    if (!editFormData) return;

    try { 
      Authorize()
      // In a real application, this would be an API call
      await axios.put('http://localhost:8000/auth/update', 
        {
          "first_name": "Johnny",
          "last_name": "Appleseed",
          "email": "johnny.appleseed@example.com",
          "nickname": "johnny_apple",
          "password": "Appleseed123!"
        },
        {
          headers: { 'Authorization' : `Bearer ${token}` }
        }).then(result => {
          console.log(result)
        }).catch(err => {
          console.log(err)
        }
      );
      
      // Update the local state
      setUsers(users.map(user => 
        user.id === editFormData.id ? editFormData : user
      ));
      
      setIsEditModalOpen(false);
      setEditFormData(null);
    } catch (error) {
      console.error('Error updating user:', error);
      // Handle error (show error message to user)
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      Authorize()
      // In a real application, this would be an API call
      await axios.delete('http://localhost:8000/auth/delete', {
        headers: {'Authorization' : `Bearer ${token}`},
      }).then(result => {
        console.log(result)
      }).catch(err => {
        console.log(err)
      });
      
      
      // Update the local state
      setUsers(users.filter(user => user.id !== selectedUser.id));
      
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      // Handle error (show error message to user)
    }
  };

  const handleCreateSubmit = async () => {
    if (!createFormData) return;

    try {
      const res = await axios.post('http://localhost:8000/auth/register', createFormData);

      // Update the local state
      setUsers(users.concat(res.data as User));
      
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error('Error updating guest:', error);
      // Handle error (show error message to user)
    }
  };

  const filteredUsers = users.filter(user =>
    (user.name ? user.name.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (user.email ? user.email.toLowerCase().includes(searchTerm.toLowerCase()) : false)
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  //This I think should be changed to the api call key's such as email, nickname, etc..
  const TABLE_HEAD = ["Nick Name", "Email", "First Name", "Last Name", "Role", "Actions"];

  return (
    <Card className="border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div>
          <Typography variant="h5" color="blue-gray">
            Users Management
          </Typography>
          <Typography variant="small" color="gray">
            View and manage user accounts in your system
          </Typography>
        </div>
        <Button 
          color="teal" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => handleCreate()}
        >
          <PencilIcon className="h-4 w-4" /> Add User
        </Button>
      </div> 
    

    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between gap-8 mb-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Users list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all users
            </Typography>
          </div>
          <div className="flex shrink-0 gap-2 sm:flex-row">
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  <Typography variant="small" color="blue-gray" className="animate-pulse">
                    Loading...
                  </Typography>
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user, index) => {
                const isLast = index === paginatedUsers.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={user.id}>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {user.nickname}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {user.email}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {user.first_name}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {user.last_name}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {user.role}
                      </Typography>
                    </td>

                  {/*
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={status}
                          color={status === 'active' ? 'green' : 'red'}
                        />
                      </div>
                    </td> */}

                    {/* <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </Typography>
                    </td> */}

                    <td className={classes}>
                      <div className="flex gap-2">
                        <IconButton
                          variant="text"
                          color="teal"
                          onClick={() => handleEdit( user )}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                        
                        <IconButton
                          variant="text"
                          color="teal"
                          onClick={() => handleView(user)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </IconButton>

                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() => handleDelete(user)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </CardBody>
      <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {currentPage} of {totalPages}
        </Typography>
        <div className="flex gap-2">
          <IconButton
            variant="outlined"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </IconButton>
          <IconButton
            variant="outlined"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </IconButton>
        </div>
      </div>


      {/* View Modal */}
            <Dialog
              size="lg"
              open={isViewModalOpen}
              handler={() => setIsViewModalOpen(false)}
            >
              <DialogHeader className="pb-0">View User</DialogHeader>
              <DialogBody>
                {selectedUser && (
                  <div className="grid grid-cols-3 grid-flow-row gap-2 overscroll-y-contain overflow-auto h-96 w-full">
                    {viewField('Id:', String(selectedUser.id))}
                    {viewField('Nickname:', selectedUser.nickname)}
                    {viewField('Email:', selectedUser.email)}
                    {viewField('Password:', selectedUser.hashed_password)}
                    {viewField('First Name:', selectedUser.first_name)}
                    {viewField('Last Name:', selectedUser.last_name)}
                    {viewField('Role:', selectedUser.role)}
                    {/*{viewField('Additional Notes:', selectedUser.email_verified)} */}
                    {viewField('Verification Token:', selectedUser.verification_token)}
                    {viewField('Created At:', selectedUser.created_at)}
                    {viewField('Updated At:', selectedUser.updated_at)}
                    {/*{viewField('First Visit Time:', selectedUser.failed_login_attempts)} */}
                    {/*{viewField('Status:', selectedUser.is_locked)} */} 
                    {viewField('Phone Number:', selectedUser.phone_number)}
                    {viewField('Address:', selectedUser.address)}
                    {viewField('City:', selectedUser.city)}
                    {viewField('State:', selectedUser.state)}
                    {viewField('Zip Code:', selectedUser.zip_code)}
                    {viewField('Card Numnber:', selectedUser.card_number)}
                    {viewField('CCV:', selectedUser.ccv)}
                    {viewField('Security Code:', selectedUser.security_code)}
                    {viewField('Subscription Plan:', selectedUser.subscription_plan)}
                    {/*{viewField('Interaction History:', selectedUser.interaction_history.map(obj => `${obj.event} at ${obj.timestamp}`).join(', '))}
                    {viewField('Interaction Events:', selectedUser.interaction_events ? selectedUser.interaction_events.join(', ') : null)}
                    {viewField('Project Types:', selectedUser.project_type ? selectedUser.project_type.join(', ') : null)}
                    {viewField('Pain Points:', selectedUser.pain_points? selectedUser.pain_points.join(', ') : null)}
                    {viewField('Current Tech:', selectedUser.current_tech ? selectedUser.current_tech.join(', ') : null)}
                    {viewField('Page Views:', selectedUser.page_views.join(', '))} */}
                  </div>
                )}
              </DialogBody>
              <DialogFooter className="space-x-2">
                <Button variant="outlined" color="blue-gray" onClick={() => setIsViewModalOpen(false)}>
                  Exit
                </Button>
              </DialogFooter>
            </Dialog>

      {/* Edit Modal */}
      <Dialog
        size="md"
        open={isEditModalOpen}
        handler={() => setIsEditModalOpen(false)}
      >
        <DialogHeader>Edit User</DialogHeader>
        <DialogBody>
          {editFormData && (
            <div className="grid gap-6">
              <Input
                label="Nick Name"
                value={editFormData.nickname ? editFormData.nickname : undefined}
                onChange={(e) => setEditFormData({ ...editFormData, nickname: e.target.value })}
              />
              <Input
                label="First Name"
                value={editFormData.first_name ? editFormData.first_name : undefined}
                onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
              />
              <Input
                label="Last Name"
                value={editFormData.last_name ? editFormData.last_name : undefined}
                onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
              />
              <Input
                label="Email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              />
              
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2">
                  Role
                </Typography>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as 'ADMIN' | 'USER' })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

            </div>
          )}
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" color="red" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>
          <Button color="teal" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        size="xs"
        open={isDeleteModalOpen}
        handler={() => setIsDeleteModalOpen(false)}
      >
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" color="blue-gray" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Create Modal */}
      <Dialog
        size="md"
        open={isCreateModalOpen}
        handler={() => setIsCreateModalOpen(false)}
      >
        <DialogHeader>Create User</DialogHeader>

        <DialogBody>
          {createFormData && (
            <div className="grid gap-6 overscroll-y-contain overflow-auto h-96">
              <div></div>
              <Input
                label="Nick Name"
                value={createFormData.nickname ? createFormData.nickname : undefined}
                onChange={(e) => setCreateFormData({ ...createFormData, nickname: e.target.value })}
              />
              <Input
                label="Email"
                value={createFormData.email ? createFormData.email : undefined}
                onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
              />
              <Input
                label="Password"
                value={createFormData.hashed_password ? createFormData.hashed_password : undefined}
                onChange={(e) => setCreateFormData({ ...createFormData, hashed_password: e.target.value })}
              />
              <Input
                label="First Name"
                value={createFormData.first_name ? createFormData.first_name : undefined}
                onChange={(e) => setCreateFormData({ ...createFormData, first_name: e.target.value })}
              />
              <Input
                label="Last Name"
                value={createFormData.last_name ? createFormData.last_name : undefined}
                onChange={(e) => setCreateFormData({ ...createFormData, last_name: e.target.value })}
              />
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2">
                  Role
                </Typography>
                <select
                  value={createFormData.role}
                  onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value as 'USER' | 'ADMIN' })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
             {/* <Input
                label="Additional Notes"
                value={createFormData.additional_notes ? createFormData.additional_notes : undefined}
                onChange={(e) => setCreateFormData({ ...createFormData, additional_notes: e.target.value })}
              /> */}
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2">
                  Subscription Plan
                </Typography>
                <select
                  value={createFormData.subscription_plan}
                  onChange={(e) => setCreateFormData({ ...createFormData, subscription_plan: e.target.value as 'FREE' | 'PREMIUM' })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="FREE">FREE</option>
                  <option value="PREMIUM">PREMIUM</option>
                </select>
              </div>

            </div>
          )}
        </DialogBody>

        <DialogFooter className="space-x-2">
          <Button variant="outlined" color="red" onClick={() => setIsCreateModalOpen(false)}>
            Cancel
          </Button>
          <Button color="teal" onClick={handleCreateSubmit}>
            Create
          </Button>
        </DialogFooter>

      </Dialog> 



      </Card>
    
     </Card>



  );
}