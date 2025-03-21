import { useState, useRef, useEffect } from 'react';
import {
  DocumentTextIcon,
  DocumentIcon,
  TableCellsIcon,
  DocumentChartBarIcon,
  CheckIcon,
  CloudArrowUpIcon,
  ExclamationCircleIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  TrashIcon,
  FolderIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  IconButton,
  Input,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
  Spinner,
  Alert,
  Progress
} from "@material-tailwind/react";

// Simple utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Define types for resources
interface Resource {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: string;
  url: string;
  shared: boolean;
  favorite: boolean;
}

export function Resources() {
  // Basic state
  const [activeTab, setActiveTab] = useState("all");
  const [resources, setResources] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState({ show: false, message: "", type: "success" });
  
  const fileInputRef = useRef(null);

  // Load sample data on component mount
  useEffect(() => {
    loadInitialResources();
  }, []);

  // Simulated API call to load resources
  const loadInitialResources = () => {
    const mockResources = [
      {
        id: "1",
        name: "Annual Report.pdf",
        type: "pdf",
        size: 2500000,
        lastModified: new Date(Date.now() - 86400000 * 2).toISOString(),
        url: "#",
        shared: true,
        favorite: true
      },
      {
        id: "2",
        name: "Sales Data.csv",
        type: "csv",
        size: 1200000,
        lastModified: new Date(Date.now() - 86400000 * 5).toISOString(),
        url: "#",
        shared: false,
        favorite: true
      },
      {
        id: "3",
        name: "Project Documentation.docx",
        type: "doc",
        size: 1800000,
        lastModified: new Date(Date.now() - 86400000 * 10).toISOString(),
        url: "#",
        shared: true,
        favorite: false
      },
      {
        id: "4",
        name: "Meeting Notes.txt",
        type: "txt",
        size: 50000,
        lastModified: new Date(Date.now() - 86400000 * 1).toISOString(),
        url: "#",
        shared: false,
        favorite: false
      },
      {
        id: "5",
        name: "Product Roadmap.pdf",
        type: "pdf",
        size: 3200000,
        lastModified: new Date(Date.now() - 86400000 * 7).toISOString(),
        url: "#",
        shared: true,
        favorite: false
      }
    ];

    setResources(mockResources);
  };

  // Filter resources based on active tab and search query
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "documents") return ["pdf", "doc", "txt"].includes(resource.type) && matchesSearch;
    if (activeTab === "spreadsheets") return resource.type === "csv" && matchesSearch;
    if (activeTab === "favorites") return resource.favorite && matchesSearch;
    if (activeTab === "shared") return resource.shared && matchesSearch;
    
    return matchesSearch;
  });

  // Format file size from bytes to readable format
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Handle file upload
  const handleFileUpload = (files) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate API upload with delay
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Process each file
      Array.from(files).forEach(file => {
        // Get file extension
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || "";
        let fileType = "other";
        
        if (["pdf"].includes(fileExtension)) fileType = "pdf";
        else if (["doc", "docx"].includes(fileExtension)) fileType = "doc";
        else if (["xls", "xlsx", "csv"].includes(fileExtension)) fileType = "csv";
        else if (["txt"].includes(fileExtension)) fileType = "txt";
        
        // Create new resource
        const newResource = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          name: file.name,
          type: fileType,
          size: file.size,
          lastModified: new Date().toISOString(),
          url: URL.createObjectURL(file),
          shared: false,
          favorite: false
        };
        
        // Add to resources
        setResources(prev => [newResource, ...prev]);
      });
      
      // Reset states
      setIsUploading(false);
      setIsUploadModalOpen(false);
      
      // Show success alert
      setShowAlert({
        show: true,
        message: files.length > 1 
          ? `${files.length} files uploaded successfully!` 
          : "File uploaded successfully!",
        type: "success"
      });
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowAlert(prev => ({ ...prev, show: false }));
      }, 3000);
    }, 2000);
  };

  // Handle file input change
  const handleFileInputChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFileUpload(event.target.files);
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Toggle favorite status
  const toggleFavorite = (resourceId) => {
    setResources(resources.map(resource => 
      resource.id === resourceId 
        ? { ...resource, favorite: !resource.favorite } 
        : resource
    ));
  };

  // Toggle shared status
  const toggleShared = (resourceId) => {
    setResources(resources.map(resource => 
      resource.id === resourceId 
        ? { ...resource, shared: !resource.shared } 
        : resource
    ));
  };

  // Delete resource
  const deleteResource = () => {
    if (selectedResource) {
      setResources(resources.filter(resource => resource.id !== selectedResource.id));
      setIsDeleteModalOpen(false);
      setSelectedResource(null);
      
      // Show success alert
      setShowAlert({
        show: true,
        message: "File deleted successfully!",
        type: "success"
      });
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowAlert(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  // Get icon based on file type
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <DocumentTextIcon className="h-6 w-6 text-red-500" />;
      case 'doc':
        return <DocumentIcon className="h-6 w-6 text-blue-500" />;
      case 'csv':
        return <TableCellsIcon className="h-6 w-6 text-green-500" />;
      case 'txt':
        return <DocumentChartBarIcon className="h-6 w-6 text-gray-500" />;
      default:
        return <DocumentIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  // Get color based on file type
  const getTypeColor = (type) => {
    switch (type) {
      case 'pdf':
        return 'red';
      case 'doc':
        return 'blue';
      case 'csv':
        return 'green';
      case 'txt':
        return 'gray';
      default:
        return 'blue-gray';
    }
  };

  return (
    <div className="w-full">
      {/* Success/Error Alert */}
      {showAlert.show && (
        <Alert
          open={showAlert.show}
          onClose={() => setShowAlert(prev => ({ ...prev, show: false }))}
          animate={{
            mount: { y: 0 },
            unmount: { y: -100 },
          }}
          className="fixed top-4 right-4 z-50 max-w-md"
          color={showAlert.type === "success" ? "green" : "red"}
          icon={
            showAlert.type === "success" ? (
              <CheckIcon className="h-6 w-6" />
            ) : (
              <ExclamationCircleIcon className="h-6 w-6" />
            )
          }
        >
          {showAlert.message}
        </Alert>
      )}

      {/* Resources Header */}
      <Card className="w-full shadow-sm border border-gray-100 mb-6">
        <CardBody>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Typography variant="h4" color="blue-gray" className="mb-1">
                Resources
              </Typography>
              <Typography color="gray" className="font-normal">
                Manage your files and documents
              </Typography>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-full md:w-auto">
                <Input
                  label="Search files"
                  icon={<DocumentIcon className="h-5 w-5 text-blue-gray-300" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-w-[250px]"
                />
              </div>
              <Button
                className="flex items-center gap-2"
                color="teal"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <CloudArrowUpIcon className="h-4 w-4" /> Upload File
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Resources Content */}
      <Card className="w-full shadow-sm border border-gray-100">
        <CardHeader floated={false} shadow={false} className="rounded-none pt-4 pb-0">
          <Tabs value={activeTab}>
            <TabsHeader className="bg-gray-100 rounded-lg p-1">
              <Tab 
                value="all" 
                onClick={() => setActiveTab("all")}
                className={activeTab === "all" ? "font-medium" : ""}
              >
                All Files
              </Tab>
              <Tab 
                value="documents" 
                onClick={() => setActiveTab("documents")}
                className={activeTab === "documents" ? "font-medium" : ""}
              >
                Documents
              </Tab>
              <Tab 
                value="spreadsheets" 
                onClick={() => setActiveTab("spreadsheets")}
                className={activeTab === "spreadsheets" ? "font-medium" : ""}
              >
                Spreadsheets
              </Tab>
              <Tab 
                value="favorites" 
                onClick={() => setActiveTab("favorites")}
                className={activeTab === "favorites" ? "font-medium" : ""}
              >
                Favorites
              </Tab>
              <Tab 
                value="shared" 
                onClick={() => setActiveTab("shared")}
                className={activeTab === "shared" ? "font-medium" : ""}
              >
                Shared
              </Tab>
            </TabsHeader>
            <TabsBody animate={{ initial: { y: 250 }, mount: { y: 0 }, unmount: { y: 250 } }}>
              {["all", "documents", "spreadsheets", "favorites", "shared"].map((value) => (
                <TabPanel key={value} value={value} className="p-0">
                  {filteredResources.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-max table-auto text-left">
                        <thead>
                          <tr>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                              >
                                Name
                              </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                              >
                                Type
                              </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                              >
                                Size
                              </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                              >
                                Last Modified
                              </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70"
                              >
                                Actions
                              </Typography>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredResources.map((resource, index) => {
                            const isLast = index === filteredResources.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                              <tr key={resource.id} className="hover:bg-blue-gray-50/30">
                                <td className={classes}>
                                  <div className="flex items-center gap-3">
                                    {getFileIcon(resource.type)}
                                    <div>
                                      <Typography variant="small" color="blue-gray" className="font-medium">
                                        {resource.name}
                                      </Typography>
                                      {resource.favorite && (
                                        <Chip
                                          size="sm"
                                          variant="ghost"
                                          value="Favorite"
                                          color="amber"
                                          className="text-xs px-1 py-0.5 rounded"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className={classes}>
                                  <Chip
                                    size="sm"
                                    variant="ghost"
                                    value={resource.type.toUpperCase()}
                                    color={getTypeColor(resource.type)}
                                  />
                                </td>
                                <td className={classes}>
                                  <Typography variant="small" color="blue-gray">
                                    {formatFileSize(resource.size)}
                                  </Typography>
                                </td>
                                <td className={classes}>
                                  <Typography variant="small" color="blue-gray">
                                    {formatDate(resource.lastModified)}
                                  </Typography>
                                </td>
                                <td className={classes}>
                                  <div className="flex items-center gap-2">
                                    {/* Download button */}
                                    <IconButton variant="text" color="blue-gray">
                                      <ArrowDownTrayIcon className="h-4 w-4" />
                                    </IconButton>
                                    
                                    {/* Favorite toggle */}
                                    <IconButton
                                      variant="text"
                                      color={resource.favorite ? "amber" : "blue-gray"}
                                      onClick={() => toggleFavorite(resource.id)}
                                    >
                                      {resource.favorite ? 
                                        <StarSolid className="h-4 w-4" /> : 
                                        <StarIcon className="h-4 w-4" />
                                      }
                                    </IconButton>
                                    
                                    {/* Share toggle */}
                                    <IconButton
                                      variant="text"
                                      color={resource.shared ? "blue" : "blue-gray"}
                                      onClick={() => toggleShared(resource.id)}
                                    >
                                      <ShareIcon className="h-4 w-4" />
                                    </IconButton>
                                    
                                    {/* Delete button */}
                                    <IconButton
                                      variant="text"
                                      color="red"
                                      onClick={() => {
                                        setSelectedResource(resource);
                                        setIsDeleteModalOpen(true);
                                      }}
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </IconButton>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FolderIcon className="h-16 w-16 text-blue-gray-200 mb-4" />
                      <Typography color="blue-gray" className="mb-2 font-medium">
                        No files found
                      </Typography>
                      <Typography color="gray" className="text-center max-w-xs">
                        {searchQuery
                          ? `No files matching "${searchQuery}" were found. Try a different search term.`
                          : activeTab === "all"
                          ? "You haven't uploaded any files yet. Click the 'Upload File' button to get started."
                          : `You don't have any ${activeTab === "favorites" ? "favorite" : activeTab} files yet.`}
                      </Typography>
                      <Button
                        variant="text"
                        color="teal"
                        className="mt-4 flex items-center gap-2"
                        onClick={() => setIsUploadModalOpen(true)}
                      >
                        <CloudArrowUpIcon className="h-4 w-4" /> Upload File
                      </Button>
                    </div>
                  )}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Upload Modal */}
      <Dialog
        open={isUploadModalOpen}
        handler={() => !isUploading && setIsUploadModalOpen(false)}
        size="md"
      >
        <DialogHeader>Upload Files</DialogHeader>
        <DialogBody divider>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer text-center",
              isDragging
                ? "border-teal-500 bg-teal-50"
                : "border-blue-gray-200 hover:border-teal-500 hover:bg-teal-50/30"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <Spinner className="h-12 w-12 text-teal-500" />
                <Typography color="teal" className="font-medium">
                  Uploading...
                </Typography>
                <div className="w-full max-w-xs">
                  <Progress value={uploadProgress} label=" " color="teal" />
                  <Typography variant="small" className="text-center mt-1">
                    {uploadProgress}%
                  </Typography>
                </div>
              </div>
            ) : (
              <>
                <CloudArrowUpIcon className="h-12 w-12 text-blue-gray-300 mx-auto mb-4" />
                <Typography color="blue-gray" className="font-medium mb-1">
                  Drag and drop files here
                </Typography>
                <Typography color="gray" className="text-sm">
                  or <span className="text-teal-500 font-medium">browse</span> to upload
                </Typography>
                <Typography color="gray" className="text-xs mt-4">
                  Supported formats: PDF, DOC, CSV, TXT
                </Typography>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileInputChange}
              accept=".pdf,.doc,.docx,.csv,.txt,.xls,.xlsx"
              disabled={isUploading}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => !isUploading && setIsUploadModalOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      {/* DeleteConfirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        handler={() => setIsDeleteModalOpen(false)}
        size="xs"
      >
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody divider>
          Are you sure you want to delete{" "}
          <span className="font-medium">{selectedResource?.name}</span>? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button color="red" onClick={deleteResource}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Resources;