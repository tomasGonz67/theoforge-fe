import React, { useState, useEffect, useContext } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';
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
//import { cn } from '../lib/utils';

interface Guest {
  id: number;
  name: string;
  company: string;
  industry: string;
  contactInfo: string;
  projectType: string;
  lastInteraction: string;
  status: 'new' | 'contacted' | 'converted';
}

export function GuestsTable() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Guest | null>(null);
  const itemsPerPage = 10;
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchGuests = async () => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyGuests: Guest[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Guest ${i + 1}`,
        company: `Company ${i + 1}`,
        industry: ['Technology', 'Healthcare', 'Finance', 'Retail'][i % 4],
        contactInfo: `guest${i + 1}@example.com`,
        projectType: ['AI Training', 'ETL Solution', 'Knowledge Graph', 'Custom Development'][i % 4],
        lastInteraction: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        status: ['new', 'contacted', 'converted'][i % 3] as 'new' | 'contacted' | 'converted',
      }));

      setGuests(dummyGuests);
    } catch (error) {
      console.error('Error fetching guests:', error);
    }
    setLoading(false);
  };

  const handleEdit = (guest: Guest) => {
    setSelectedGuest(guest);
    setEditFormData(guest);
    setIsEditModalOpen(true);
  };

  const handleDelete = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editFormData) return;

    try {
      // In a real application, this would be an API call
      //await axios.put(`/api/guests/${editFormData.id}`, editFormData);
      
      // Update the local state
      setGuests(guests.map(guest => 
        guest.id === editFormData.id ? editFormData : guest
      ));
      
      setIsEditModalOpen(false);
      setEditFormData(null);
    } catch (error) {
      console.error('Error updating guest:', error);
      // Handle error (show error message to user)
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedGuest) return;

    try {
      // In a real application, this would be an API call
      //await axios.delete(`/api/guests/${selectedGuest.id}`);
      
      // Update the local state
      setGuests(guests.filter(guest => guest.id !== selectedGuest.id));
      
      setIsDeleteModalOpen(false);
      setSelectedGuest(null);
    } catch (error) {
      console.error('Error deleting guest:', error);
      // Handle error (show error message to user)
    }
  };

  const getStatusColor = (status: Guest['status']) => {
    switch (status) {
      case 'new':
        return 'blue';
      case 'contacted':
        return 'amber';
      case 'converted':
        return 'green';
      default:
        return 'gray';
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedGuests = filteredGuests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);

  const TABLE_HEAD = ["Name", "Company", "Industry", "Project Type", "Contact", "Status", "Last Interaction", "Actions"];

  if (role !== 'guest') return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between gap-8 mb-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Guests list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all guests
            </Typography>
          </div>
          <div className="flex shrink-0 gap-2 sm:flex-row">
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} crossOrigin={undefined}              />
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
                <td colSpan={8} className="p-4 text-center">
                  <Typography variant="small" color="blue-gray" className="animate-pulse">
                    Loading...
                  </Typography>
                </td>
              </tr>
            ) : (
              paginatedGuests.map(({ id, name, company, industry, projectType, contactInfo, status, lastInteraction }, index) => {
                const isLast = index === paginatedGuests.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={id}>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {company}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {industry}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {projectType}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {contactInfo}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={status}
                          color={getStatusColor(status)}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {new Date(lastInteraction).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="flex gap-2">
                        <IconButton
                          variant="text"
                          color="teal"
                          onClick={() => handleEdit({ id, name, company, industry, contactInfo, projectType, lastInteraction, status })}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() => handleDelete({ id, name, company, industry, contactInfo, projectType, lastInteraction, status })}
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
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog
        size="md"
        open={isEditModalOpen}
        handler={() => setIsEditModalOpen(false)}
      >
        <DialogHeader>Edit Guest</DialogHeader>
        <DialogBody>
          <div></div>
          {editFormData && (
            <div className="grid gap-6">
              <Input
                label="Name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} crossOrigin={undefined}              />
              <Input
                label="Company"
                value={editFormData.company}
                onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })} crossOrigin={undefined}              />
              <Input
                label="Industry"
                value={editFormData.industry}
                onChange={(e) => setEditFormData({ ...editFormData, industry: e.target.value })} crossOrigin={undefined}              />
              <Input
                label="Contact Info"
                value={editFormData.contactInfo}
                onChange={(e) => setEditFormData({ ...editFormData, contactInfo: e.target.value })} crossOrigin={undefined}              />
              <Input
                label="Project Type"
                value={editFormData.projectType}
                onChange={(e) => setEditFormData({ ...editFormData, projectType: e.target.value })} crossOrigin={undefined}              />
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2">
                  Status
                </Typography>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as 'new' | 'contacted' | 'converted' })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
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
          Are you sure you want to delete {selectedGuest?.name}? This action cannot be undone.
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
  else return (
    <Typography variant='h6'>
      You are a guest. Please&ensp;
      <a
        onClick={handleLogout}
        className="opacity-100 text-teal-500">sign in
      </a>
      &ensp;as a user to view the table.
    </Typography>
  );
}