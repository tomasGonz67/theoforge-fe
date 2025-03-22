import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<User | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/auth/users'); // Need to Update the URL as per backend configuration
      console.log(response.data)
      setUsers(response.data); // Assuming the API returns a list of users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };
  
  
  {/* 
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

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditFormData(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editFormData) return;

    try {
      // In a real application, this would be an API call
      await axios.put(`/api/users/${editFormData.id}`, editFormData);
      
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
      // In a real application, this would be an API call
      await axios.delete(`/api/users/${selectedUser.id}`);
      
      // Update the local state
      setUsers(users.filter(user => user.id !== selectedUser.id));
      
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
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
  const TABLE_HEAD = ["Name", "Email", "Role", "Status", "Last Login", "Actions"];

  return (
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
                        {user.name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {user.email}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {user.role}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={status}
                          color={status === 'active' ? 'green' : 'red'}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </Typography>
                    </td>
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
                label="Name"
                value={editFormData.name ? editFormData.name : undefined}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
              <Input
                label="Email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              />
              <Input
                label="Role"
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as "ADMIN" | "USER" })}
              />
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2">
                  Status
                </Typography>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
    </Card>
  );
}