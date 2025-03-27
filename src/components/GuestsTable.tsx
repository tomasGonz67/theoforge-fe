import React, { useState, useEffect } from 'react';
import { EyeIcon, HomeIcon, MagnifyingGlassIcon, MinusIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
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

const API_URL = 'http://localhost:8000';

interface Interaction {
  event: string,
  timestamp: string,
}
interface Guest {
  additional_notes: string | null;
  budget: string | null;
  company: string | null;
  contact_info: string | null;
  created_at: string;
  current_tech: string[] | null;
  first_visit_timestamp: string;
  id: number;
  industry: string | null;
  interaction_events: string[];
  interaction_history: Interaction[];
  name: string | null;
  page_views: string[];
  pain_points: string[] | null;
  project_type: string[] | null;
  session_id: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED';
  timeline: string;
  updated_at: string;
}

export function GuestsTable() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState<Guest | null>(null);
  const [numProjectTypeFields, setNumProjectTypeFields] = useState(1);
  const [numPainPointFields, setNumPainPointFields] = useState(1);
  const [numCurrentTechFields, setNumCurrentTechFields] = useState(1);
  const [editFormData, setEditFormData] = useState<Guest | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/guests`);
      setGuests(res.data);
    } catch (error) {
      console.error('Error fetching guests:', error);
    }
    setLoading(false);
  };

  const handleView = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsViewModalOpen(true);
  }

  const handleCreate = () => {
    setNumProjectTypeFields(1);
    setNumPainPointFields(1);
    setNumCurrentTechFields(1);
    setCreateFormData(createFormData ? createFormData : {} as Guest);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (guest: Guest) => {
    setSelectedGuest(guest);
    setNumProjectTypeFields(guest.project_type ? guest.project_type.length : 0);
    setNumPainPointFields(guest.pain_points ? guest.pain_points.length : 0);
    setNumCurrentTechFields(guest.current_tech ? guest.current_tech.length: 0);
    setEditFormData(guest);
    setIsEditModalOpen(true);
  };

  const handleDelete = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = async () => {
    if (!createFormData) return;

    try {
      createFormData.session_id = 'test';
      const res = await axios.post(`${API_URL}/guests/`, createFormData);

      // Update the local state
      setGuests(guests.concat(res.data as Guest));
      
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error('Error updating guest:', error);
      // Handle error (show error message to user)
    }
  };

  const handleEditSubmit = async () => {
    if (!editFormData) return;

    try {
      await axios.put(`${API_URL}/guests/${editFormData.id}`, editFormData);

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
      await axios.delete(`${API_URL}/guests/${selectedGuest.id}`);
      
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
      case 'NEW':
        return 'blue';
      case 'CONTACTED':
        return 'amber';
      case 'CONVERTED':
        return 'green';
      default:
        return 'gray';
    }
  };

  const filteredGuests = guests.filter(guest =>
    (guest.name ? guest.name.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (guest.company ? guest.company.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (guest.industry ? guest.industry.toLowerCase().includes(searchTerm.toLowerCase()) : false)
  );

  const paginatedGuests = filteredGuests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);

  const TABLE_HEAD = ["Name", "Company", "Industry", "Budget", "Contact", "Status", "Last Interaction", "Actions"];

  const viewField = (field: string, value: string | null) => {
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
  return (
    <Card className="border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div>
          <Typography variant="h5" color="blue-gray">
            Guest Management
          </Typography>
          <Typography variant="small" color="gray">
            View and manage guest accounts in your system
          </Typography>
        </div>
        <Button 
          color="teal" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => handleCreate()}
        >
          <HomeIcon className="h-4 w-4" /> Add Guest
        </Button>
      </div>
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
                <td colSpan={8} className="p-4 text-center">
                  <Typography variant="small" color="blue-gray" className="animate-pulse">
                    Loading...
                  </Typography>
                </td>
              </tr>
            ) : (
              paginatedGuests.map((guest, index) => {
                const isLast = index === paginatedGuests.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={guest.id}>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal overscroll-x-contain overflow-auto w-32">
                        {guest.name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal overscroll-x-contain overflow-auto w-32">
                        {guest.company}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal overscroll-x-contain overflow-auto w-32">
                        {guest.industry}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal overscroll-x-contain overflow-auto w-32">
                        {guest.budget}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal overscroll-x-contain overflow-auto w-32">
                        {guest.contact_info}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={guest.status}
                          color={getStatusColor(guest.status)}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {guest.interaction_history.length > 0 ? guest.interaction_history[guest.interaction_history.length-1].timestamp  : 'None'}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="flex gap-2">

                        <IconButton
                          variant="text"
                          color="teal"
                          onClick={() => handleView(guest)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </IconButton>

                        <IconButton
                          variant="text"
                          color="teal"
                          onClick={() => handleEdit(guest)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                        
                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() => handleDelete(guest)}
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

      {/* Create Modal */}
      <Dialog
        size="md"
        open={isCreateModalOpen}
        handler={() => setIsCreateModalOpen(false)}
      >
        <DialogHeader>Create Guest</DialogHeader>
        <DialogBody>
          {createFormData && (
            <div className="grid gap-6 overscroll-y-contain overflow-auto h-96">
              <div></div>
              <Input
                label="Name"
                value={createFormData.name ? createFormData.name : undefined}
                onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
              />
              <Input
                label="Company"
                value={createFormData.company ? createFormData.company : undefined}
                onChange={(e) => setCreateFormData({ ...createFormData, company: e.target.value })}
              />
              <Input
                label="Industry"
                value={createFormData.industry ? createFormData.industry : undefined}
                onChange={(e) => setCreateFormData({ ...createFormData, industry: e.target.value })}
              />
              <Input
                label="Budget"
                value={createFormData.budget ? createFormData.budget : undefined}
                onChange={(e) => setCreateFormData({ ...createFormData, budget: e.target.value })}
              />
              <Input
                label="Timeline"
                value={createFormData.timeline ? createFormData.timeline : undefined}
                onChange={(e) => setCreateFormData({ ...createFormData, timeline: e.target.value })}
              />
              <Input
                label="Contact Info"
                value={createFormData.contact_info ? createFormData.contact_info : undefined}
                onChange={(e) => setCreateFormData({ ...createFormData, contact_info: e.target.value })}
              />
              <Input
                label="Additional Notes"
                value={createFormData.additional_notes ? createFormData.additional_notes : undefined}
                onChange={(e) => setCreateFormData({ ...createFormData, additional_notes: e.target.value })}
              />
              {
                // Create project type fields based on numProjectTypeFields
                Array.from({length: numProjectTypeFields}, (_, num) => num+1 && 
                <Input
                  label={"Project Type "+(num+1)}
                  value={createFormData.project_type ? createFormData.project_type[num] : undefined}
                  onChange={(e) => setCreateFormData({ ...createFormData, project_type: createFormData.project_type ? createFormData.project_type.map((value, i) => (i === num ? e.target.value : value)) : [e.target.value] })}
                />)
              }
              <div className="inline-flex flex-row gap-6">
                <Button
                  color="green"
                  size="sm"
                  className="w-max h-max flex items-center gap-1"
                  onClick={() => {
                    setNumProjectTypeFields((x)=> x+1);
                    // Add empty project type to form data
                    setCreateFormData({ ...createFormData, project_type: createFormData.project_type ? createFormData.project_type.concat(['']) : ['']})
                  }}>
                  Add Project Type<PlusIcon className="h-4 w-4" />
                </Button>
                <Button
                  color="red"
                  size="sm"
                  className="w-max h-max flex items-center gap-1"
                  disabled={numProjectTypeFields === 0 ? true : false}
                  onClick={() => {
                    // Remove last project type from form data
                    setCreateFormData({ ...createFormData, project_type: createFormData.project_type ? (numProjectTypeFields === 1 ? null : createFormData.project_type.slice(0, -1)) : null})
                    // There can be 0 fields, meaning project type is null
                    setNumProjectTypeFields((x)=> Math.max(x-1, 0));
                  }}>
                  Remove Project Type<MinusIcon className="h-4 w-4" />
                </Button>
              </div>
              {
                // Create pain point fields based on numPainPointFields
                Array.from({length: numPainPointFields}, (_, num) => num+1 && 
                <Input
                  label={"Pain Point "+(num+1)}
                  value={createFormData.pain_points ? createFormData.pain_points[num] : undefined}
                  onChange={(e) => setCreateFormData({ ...createFormData, pain_points: createFormData.pain_points ? createFormData.pain_points.map((value, i) => (i === num ? e.target.value : value)) : [e.target.value] })}
                />)
              }
              <div className="inline-flex flex-row gap-6">
                <Button
                  color="green"
                  size="sm"
                  className="w-max h-max flex items-center gap-1"
                  onClick={() => {
                    setNumPainPointFields((x)=> x+1);
                    // Add empty pain point to form data
                    setCreateFormData({ ...createFormData, pain_points: createFormData.pain_points? createFormData.pain_points.concat(['']) : ['']})
                  }}>
                  Add Pain Point<PlusIcon className="h-4 w-4" />
                </Button>
                <Button
                  color="red"
                  size="sm"
                  className="w-max h-max flex items-center gap-1"
                  disabled={numPainPointFields === 0 ? true : false}
                  onClick={() => {
                    // Remove last pain point from form data
                    setCreateFormData({ ...createFormData, pain_points: createFormData.pain_points ? (numPainPointFields === 1 ? null : createFormData.pain_points.slice(0, -1)) : null})
                    // There can be 0 fields, meaning pain point is null
                    setNumPainPointFields((x)=> Math.max(x-1, 0));
                  }}>
                  Remove Pain Point<MinusIcon className="h-4 w-4" />
                </Button>
              </div>
              {
                // Create current tech fields based on numCurrentTechFields
                Array.from({length: numCurrentTechFields}, (_, num) => num+1 && 
                <Input
                  label={"Current Tech "+(num+1)}
                  value={createFormData.current_tech? createFormData.current_tech[num] : undefined}
                  onChange={(e) => setCreateFormData({ ...createFormData, current_tech: createFormData.current_tech ? createFormData.current_tech.map((value, i) => (i === num ? e.target.value : value)) : [e.target.value] })}
                />)
              }
              <div className="inline-flex flex-row gap-6">
                <Button
                  color="green"
                  size="sm"
                  className="w-max h-max flex items-center gap-1"
                  onClick={() => {
                    setNumCurrentTechFields((x)=> x+1);
                    // Add empty current tech to form data
                    setCreateFormData({ ...createFormData, current_tech: createFormData.current_tech ? createFormData.current_tech.concat(['']) : ['']})
                  }}>
                  Add Current Tech<PlusIcon className="h-4 w-4" />
                </Button>
                <Button
                  color="red"
                  size="sm"
                  className="w-max h-max flex items-center gap-1"
                  disabled={numCurrentTechFields === 0 ? true : false}
                  onClick={() => {
                    // Remove last current tech from form data
                    setCreateFormData({ ...createFormData, current_tech: createFormData.current_tech ? (numCurrentTechFields === 1 ? null : createFormData.current_tech.slice(0, -1)) : null})
                    // There can be 0 fields, meaning current tech is null
                    setNumCurrentTechFields((x)=> Math.max(x-1, 0));
                  }}>
                  Remove Current Tech<MinusIcon className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2">
                  Status
                </Typography>
                <select
                  value={createFormData.status}
                  onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.value as 'NEW' | 'CONTACTED' | 'CONVERTED' })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CONVERTED">Converted</option>
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

      {/* View Modal */}
      <Dialog
        size="lg"
        open={isViewModalOpen}
        handler={() => setIsViewModalOpen(false)}
      >
        <DialogHeader className="pb-0">View Guest</DialogHeader>
        <DialogBody>
          {selectedGuest && (
            <div className="grid grid-cols-3 grid-flow-row gap-2 overscroll-y-contain overflow-auto h-96 w-full">
              {viewField('Name:', selectedGuest.name)}
              {viewField('Id:', String(selectedGuest.id))}
              {viewField('Session Id:', selectedGuest.session_id)}
              {viewField('Company:', selectedGuest.company)}
              {viewField('Industry:', selectedGuest.industry)}
              {viewField('Budget:', selectedGuest.budget)}
              {viewField('Contact:', selectedGuest.contact_info)}
              {viewField('Timeline:', selectedGuest.timeline)}
              {viewField('Additional Notes:', selectedGuest.additional_notes)}
              {viewField('Status:', selectedGuest.status)}
              {viewField('Created At:', selectedGuest.created_at)}
              {viewField('Updated At:', selectedGuest.updated_at)}
              {viewField('First Visit Time:', selectedGuest.first_visit_timestamp)}
              {viewField('Interaction History:', selectedGuest.interaction_history.map(obj => `${obj.event} at ${obj.timestamp}`).join(', '))}
              {viewField('Interaction Events:', selectedGuest.interaction_events ? selectedGuest.interaction_events.join(', ') : null)}
              {viewField('Project Types:', selectedGuest.project_type ? selectedGuest.project_type.join(', ') : null)}
              {viewField('Pain Points:', selectedGuest.pain_points? selectedGuest.pain_points.join(', ') : null)}
              {viewField('Current Tech:', selectedGuest.current_tech ? selectedGuest.current_tech.join(', ') : null)}
              {viewField('Page Views:', selectedGuest.page_views.join(', '))}
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
        <DialogHeader>Edit Guest</DialogHeader>
        <DialogBody>
          {editFormData && (
            <div className="grid gap-6 overscroll-y-contain overflow-auto h-96">
              <div></div>
              <Input
                label="Name"
                value={editFormData.name ? editFormData.name : undefined}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
              <Input
                label="Company"
                value={editFormData.company ? editFormData.company : undefined}
                onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
              />
              <Input
                label="Industry"
                value={editFormData.industry ? editFormData.industry : undefined}
                onChange={(e) => setEditFormData({ ...editFormData, industry: e.target.value })}
              />
              <Input
                label="Budget"
                value={editFormData.budget ? editFormData.budget : undefined}
                onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
              />
              <Input
                label="Timeline"
                value={editFormData.timeline ? editFormData.timeline : undefined}
                onChange={(e) => setEditFormData({ ...editFormData, timeline: e.target.value })}
              />
              <Input
                label="Contact Info"
                value={editFormData.contact_info ? editFormData.contact_info : undefined}
                onChange={(e) => setEditFormData({ ...editFormData, contact_info: e.target.value })}
              />
              <Input
                label="Additional Notes"
                value={editFormData.additional_notes ? editFormData.additional_notes : undefined}
                onChange={(e) => setEditFormData({ ...editFormData, additional_notes: e.target.value })}
              />
              {
                // Create project type fields based on numProjectTypeFields
                Array.from({length: numProjectTypeFields}, (_, num) => num+1 && 
                <Input
                  label={"Project Type "+(num+1)}
                  value={editFormData.project_type ? editFormData.project_type[num] : undefined}
                  onChange={(e) => setEditFormData({ ...editFormData, project_type: editFormData.project_type ? editFormData.project_type.map((value, i) => (i === num ? e.target.value : value)) : [e.target.value] })}
                />)
              }
              <div className="inline-flex flex-row gap-6">
                <Button
                  color="green"
                  size="sm"
                  className="w-max h-max flex items-center gap-1"
                  onClick={() => {
                    setNumProjectTypeFields((x)=> x+1);
                    // Add empty project type to form data
                    setEditFormData({ ...editFormData, project_type: editFormData.project_type ? editFormData.project_type.concat(['']) : ['']})
                  }}>
                  Add Project Type<PlusIcon className="h-4 w-4" />
                </Button>
                <Button
                  color="red"
                  size="sm"
                  className="w-max h-max flex items-center gap-1"
                  disabled={numProjectTypeFields === 0 ? true : false}
                  onClick={() => {
                    // Remove last project type from form data
                    setEditFormData({ ...editFormData, project_type: editFormData.project_type ? (numProjectTypeFields === 1 ? null : editFormData.project_type.slice(0, -1)) : null})
                    // There can be 0 fields, meaning project type is null
                    setNumProjectTypeFields((x)=> Math.max(x-1, 0));
                  }}>
                  Remove Project Type<MinusIcon className="h-4 w-4" />
                </Button>
              </div>
              {
                // Create pain point fields based on numPainPointFields
                Array.from({length: numPainPointFields}, (_, num) => num+1 && 
                <Input
                  label={"Pain Point "+(num+1)}
                  value={editFormData.pain_points ? editFormData.pain_points[num] : undefined}
                  onChange={(e) => setEditFormData({ ...editFormData, pain_points: editFormData.pain_points ? editFormData.pain_points.map((value, i) => (i === num ? e.target.value : value)) : [e.target.value] })}
                />)
              }
              <div className="inline-flex flex-row gap-6">
                <Button
                  color="green"
                  size="sm"
                  className="w-max h-max flex items-center gap-1"
                  onClick={() => {
                    setNumPainPointFields((x)=> x+1);
                    // Add empty pain point to form data
                    setEditFormData({ ...editFormData, pain_points: editFormData.pain_points? editFormData.pain_points.concat(['']) : ['']})
                  }}>
                  Add Pain Point<PlusIcon className="h-4 w-4" />
                </Button>
                <Button
                  color="red"
                  size="sm"
                  className="w-max h-max flex items-center gap-1"
                  disabled={numPainPointFields === 0 ? true : false}
                  onClick={() => {
                    // Remove last pain point from form data
                    setEditFormData({ ...editFormData, pain_points: editFormData.pain_points ? (numPainPointFields === 1 ? null : editFormData.pain_points.slice(0, -1)) : null})
                    // There can be 0 fields, meaning pain point is null
                    setNumPainPointFields((x)=> Math.max(x-1, 0));
                  }}>
                  Remove Pain Point<MinusIcon className="h-4 w-4" />
                </Button>
              </div>
              {
                // Create current tech fields based on numCurrentTechFields
                Array.from({length: numCurrentTechFields}, (_, num) => num+1 && 
                <Input
                  label={"Current Tech "+(num+1)}
                  value={editFormData.current_tech? editFormData.current_tech[num] : undefined}
                  onChange={(e) => setEditFormData({ ...editFormData, current_tech: editFormData.current_tech ? editFormData.current_tech.map((value, i) => (i === num ? e.target.value : value)) : [e.target.value] })}
                />)
              }
              <div className="inline-flex flex-row gap-6">
                <Button
                  color="green"
                  size="sm"
                  className="w-max h-max flex items-center gap-1"
                  onClick={() => {
                    setNumCurrentTechFields((x)=> x+1);
                    // Add empty current tech to form data
                    setEditFormData({ ...editFormData, current_tech: editFormData.current_tech ? editFormData.current_tech.concat(['']) : ['']})
                  }}>
                  Add Current Tech<PlusIcon className="h-4 w-4" />
                </Button>
                <Button
                  color="red"
                  size="sm"
                  className="w-max h-max flex items-center gap-1"
                  disabled={numCurrentTechFields === 0 ? true : false}
                  onClick={() => {
                    // Remove last current tech from form data
                    setEditFormData({ ...editFormData, current_tech: editFormData.current_tech ? (numCurrentTechFields === 1 ? null : editFormData.current_tech.slice(0, -1)) : null})
                    // There can be 0 fields, meaning current tech is null
                    setNumCurrentTechFields((x)=> Math.max(x-1, 0));
                  }}>
                  Remove Current Tech<MinusIcon className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2">
                  Status
                </Typography>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as 'NEW' | 'CONTACTED' | 'CONVERTED' })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CONVERTED">Converted</option>
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
    </Card>
  );
}