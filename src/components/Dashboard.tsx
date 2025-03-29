/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import {
  UsersIcon,
  HomeIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon as MenuIcon,
  CreditCardIcon,
  ChartBarIcon,
  BellIcon,
  CheckCircleIcon,
  SparklesIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  XMarkIcon,
  CpuChipIcon,
  FolderIcon,
  CalendarIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  BookOpenIcon,
  ArrowRightStartOnRectangleIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Drawer,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Navbar,
  Breadcrumbs,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Input,
  Button,
  Progress,
  Avatar,
  Chip,
  Switch,
  Badge,
  Textarea,
  Tooltip,
  Alert,
  CardHeader
} from "@material-tailwind/react";
import { UsersTable } from './UsersTable';
import { GuestsTable } from './GuestsTable';
import { Resources } from './Resources';
import { ProfileSettings } from './ProfileSettings';
import { LogoutModal } from './LogoutModal';
import { ChatBox } from './ChatBox';
import { cn } from '../lib/utils';
import { RealTimeDashboard } from './RealTimeDashboard';
import { KnowledgeGraphPage } from './KnowledgeGraphPage';
import { colors } from '@material-tailwind/react/types/generic';

// User navigation - restricted options (no Analytics)
const userNavigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: ChartBarIcon,
    description: 'Overview of your activity'
  },
  { 
    name: 'Projects', 
    href: '/dashboard/projects', 
    icon: DocumentTextIcon,
    description: 'Manage your projects'
  },
  { 
    name: 'Resources', 
    href: '/dashboard/resources', 
    icon: FolderIcon,
    description: 'Manage files and documents'
  },
  { 
    name: 'Marketplace', 
    href: '/dashboard/marketplace', 
    icon: ShoppingBagIcon,
    description: 'Browse available services'
  },
  { 
    name: 'Knowledge Graph', 
    href: '/dashboard/knowledge', 
    icon: BookOpenIcon,
    description: 'Explore data relationships'
  },
  { 
    name: 'Real-Time Analytics', 
    href: '/dashboard/realtime', 
    icon: CpuChipIcon,
    description: 'Live system metrics'
  }
];

// Admin navigation- full options (includes Analytics)
const adminNavigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: ChartBarIcon,
    description: 'Overview of your activity'
  },
  { 
    name: 'Analytics', 
    href: '/dashboard/analytics', 
    icon: ChartBarIcon,
    description: 'View performance metrics'
  },
  { 
    name: 'Projects', 
    href: '/dashboard/projects', 
    icon: DocumentTextIcon,
    description: 'Manage your projects'
  },
  { 
    name: 'Users', 
    href: '/dashboard/users', 
    icon: UsersIcon,
    description: 'Manage system users'
  },
  { 
    name: 'Guests', 
    href: '/dashboard/guests', 
    icon: HomeIcon,
    description: 'View guest accounts'
  },
  { 
    name: 'Resources', 
    href: '/dashboard/resources', 
    icon: FolderIcon,
    description: 'Manage files and documents'
  },
  { 
    name: 'Marketplace', 
    href: '/dashboard/marketplace', 
    icon: ShoppingBagIcon,
    description: 'Browse available services'
  },
  { 
    name: 'Knowledge Graph', 
    href: '/dashboard/knowledge', 
    icon: BookOpenIcon,
    description: 'Explore data relationships'
  },
  { 
    name: 'Real-Time Analytics', 
    href: '/dashboard/realtime', 
    icon: CpuChipIcon,
    description: 'Live system metrics'
  }
];

// Notification structure
interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}
// Analytics Dashboard component for data visualization
const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  
  // Sample data for analytics
  const dailyData = [
    { date: 'Mon', users: 120, revenue: 1250, tasks: 45 },
    { date: 'Tue', users: 132, revenue: 1480, tasks: 52 },
    { date: 'Wed', users: 101, revenue: 1120, tasks: 38 },
    { date: 'Thu', users: 134, revenue: 1460, tasks: 57 },
    { date: 'Fri', users: 150, revenue: 1700, tasks: 62 },
    { date: 'Sat', users: 120, revenue: 1380, tasks: 48 },
    { date: 'Sun', users: 95, revenue: 990, tasks: 36 }
  ];
  
  const weeklyData = [
    { date: 'Week 1', users: 820, revenue: 8450, tasks: 312 },
    { date: 'Week 2', users: 932, revenue: 9280, tasks: 352 },
    { date: 'Week 3', users: 901, revenue: 9020, tasks: 338 },
    { date: 'Week 4', users: 934, revenue: 9660, tasks: 357 }
  ];
  
  const monthlyData = [
    { date: 'Jan', users: 3220, revenue: 34250, tasks: 1245 },
    { date: 'Feb', users: 3932, revenue: 42280, tasks: 1352 },
    { date: 'Mar', users: 3901, revenue: 41020, tasks: 1338 },
    { date: 'Apr', users: 4134, revenue: 43660, tasks: 1457 },
    { date: 'May', users: 4432, revenue: 46280, tasks: 1542 },
    { date: 'Jun', users: 4401, revenue: 45020, tasks: 1498 }
  ];
  
  const showSuccessAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };
  
  const openModal = (type: string) => {
    setModalType(type);
    setShowModal(true);
  };
  
  return (
    <div className="space-y-6">
      {showAlert && (
        <Alert
          open={showAlert}
          color="green"
          className="fixed top-20 right-4 z-50 max-w-md"
          icon={<CheckCircleIcon className="h-6 w-6" />}
          onClose={() => setShowAlert(false)}
        >
          Report generated successfully! Check your email inbox.
        </Alert>
      )}
      
      {/* Header Card */}
      <Card className="p-6 border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-500 mb-4">
                <ChartBarIcon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Analytics Dashboard</span>
              </div>
              <Typography variant="h3" color="blue-gray" className="mb-2">
                Performance Metrics
              </Typography>
              <Typography color="gray">
                Track your business performance with real-time analytics
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button 
                color="blue" 
                className="flex items-center gap-2"
                size="sm"
                onClick={() => openModal('export')}
              >
                <DocumentDuplicateIcon className="h-4 w-4" /> 
                Export Data
              </Button>
              <Button 
                color="purple" 
                className="flex items-center gap-2"
                size="sm"
                onClick={() => {
                  showSuccessAlert();
                }}
              >
                <DocumentTextIcon className="h-4 w-4" /> 
                Generate Report
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      </Card>
      
      {/* Analytics Time Period Tabs */}
      <Card className="p-4 border border-gray-100">
        <Tabs value={activeTab} className="w-full">
          <TabsHeader>
            <Tab value="daily" onClick={() => setActiveTab("daily")}>
              Daily
            </Tab>
            <Tab value="weekly" onClick={() => setActiveTab("weekly")}>
              Weekly
            </Tab>
            <Tab value="monthly" onClick={() => setActiveTab("monthly")}>
              Monthly
            </Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel value="daily">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <Card className="p-4 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-3 bg-blue-50">
                      <UsersIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <Typography variant="small" color="gray">Daily Users</Typography>
                      <Typography variant="h4">{dailyData.reduce((sum, item) => sum + item.users, 0) / dailyData.length}</Typography>
                      <Typography variant="small" color="green">+5.2% vs last week</Typography>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-3 bg-green-50">
                      <CreditCardIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <Typography variant="small" color="gray">Daily Revenue</Typography>
                      <Typography variant="h4">${dailyData.reduce((sum, item) => sum + item.revenue, 0) / dailyData.length}</Typography>
                      <Typography variant="small" color="green">+8.4% vs last week</Typography>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-3 bg-amber-50">
                      <ClipboardDocumentCheckIcon className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <Typography variant="small" color="gray">Tasks Completed</Typography>
                      <Typography variant="h4">{dailyData.reduce((sum, item) => sum + item.tasks, 0) / dailyData.length}</Typography>
                      <Typography variant="small" color="green">+3.8% vs last week</Typography>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Chart Placeholder */}
              <Card className="border border-gray-100 p-4 h-80 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <Typography variant="h6" color="gray">Daily Performance Chart</Typography>
                  <Typography variant="small" color="gray">
                    Shows user activity, revenue, and task completion for the past 7 days
                  </Typography>
                  <Button 
                    variant="text" 
                    color="blue" 
                    className="mt-3"
                    onClick={() => openModal('chart')}
                  >
                    View Detailed Chart
                  </Button>
                </div>
              </Card>
            </TabPanel>
            
            <TabPanel value="weekly">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <Card className="p-4 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-3 bg-blue-50">
                      <UsersIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <Typography variant="small" color="gray">Weekly Users</Typography>
                      <Typography variant="h4">{weeklyData.reduce((sum, item) => sum + item.users, 0) / weeklyData.length}</Typography>
                      <Typography variant="small" color="green">+12.1% vs last month</Typography>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-3 bg-green-50">
                      <CreditCardIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <Typography variant="small" color="gray">Weekly Revenue</Typography>
                      <Typography variant="h4">${weeklyData.reduce((sum, item) => sum + item.revenue, 0) / weeklyData.length}</Typography>
                      <Typography variant="small" color="green">+15.4% vs last month</Typography>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-3 bg-amber-50">
                      <ClipboardDocumentCheckIcon className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <Typography variant="small" color="gray">Tasks Completed</Typography>
                      <Typography variant="h4">{weeklyData.reduce((sum, item) => sum + item.tasks, 0) / weeklyData.length}</Typography>
                      <Typography variant="small" color="green">+9.7% vs last month</Typography>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Chart Placeholder */}
              <Card className="border border-gray-100 p-4 h-80 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <Typography variant="h6" color="gray">Weekly Performance Chart</Typography>
                  <Typography variant="small" color="gray">
                    Shows user activity, revenue, and task completion for the past 4 weeks
                  </Typography>
                  <Button 
                    variant="text" 
                    color="blue" 
                    className="mt-3"
                    onClick={() => openModal('chart')}
                  >
                    View Detailed Chart
                  </Button>
                </div>
              </Card>
            </TabPanel>
            <TabPanel value="monthly">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <Card className="p-4 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-3 bg-blue-50">
                      <UsersIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <Typography variant="small" color="gray">Monthly Users</Typography>
                      <Typography variant="h4">{monthlyData.reduce((sum, item) => sum + item.users, 0) / monthlyData.length}</Typography>
                      <Typography variant="small" color="green">+18.3% vs last quarter</Typography>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-3 bg-green-50">
                      <CreditCardIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <Typography variant="small" color="gray">Monthly Revenue</Typography>
                      <Typography variant="h4">${monthlyData.reduce((sum, item) => sum + item.revenue, 0) / monthlyData.length}</Typography>
                      <Typography variant="small" color="green">+21.7% vs last quarter</Typography>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-3 bg-amber-50">
                      <ClipboardDocumentCheckIcon className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <Typography variant="small" color="gray">Tasks Completed</Typography>
                      <Typography variant="h4">{monthlyData.reduce((sum, item) => sum + item.tasks, 0) / monthlyData.length}</Typography>
                      <Typography variant="small" color="green">+14.2% vs last quarter</Typography>
                    </div>
                  </div>
                </Card>
              </div>
{/* Chart Placeholder */}
<Card className="border border-gray-100 p-4 h-80 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <Typography variant="h6" color="gray">Monthly Performance Chart</Typography>
                  <Typography variant="small" color="gray">
                    Shows user activity, revenue, and task completion for the past 6 months
                  </Typography>
                  <Button 
                    variant="text" 
                    color="blue" 
                    className="mt-3"
                    onClick={() => openModal('chart')}
                  >
                    View Detailed Chart
                  </Button>
                </div>
              </Card>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </Card>
      
      {/* Recent Activity */}
      <Card className="p-6 border border-gray-100">
        <Typography variant="h5" color="blue-gray" className="mb-4">
          Recent Activity
        </Typography>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-3 border border-gray-100 rounded-lg">
            <div className="rounded-full p-2 bg-purple-50">
              <UsersIcon className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <Typography variant="small" className="font-medium">New user registration</Typography>
              <Typography variant="small" color="gray">User "john.smith@example.com" has registered</Typography>
              <Typography variant="small" color="gray">2 hours ago</Typography>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-3 border border-gray-100 rounded-lg">
            <div className="rounded-full p-2 bg-green-50">
              <CreditCardIcon className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <Typography variant="small" className="font-medium">New subscription</Typography>
              <Typography variant="small" color="gray">User "acme-corp" purchased Enterprise plan</Typography>
              <Typography variant="small" color="gray">4 hours ago</Typography>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-3 border border-gray-100 rounded-lg">
            <div className="rounded-full p-2 bg-blue-50">
              <ChartBarIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <Typography variant="small" className="font-medium">Analytics report generated</Typography>
              <Typography variant="small" color="gray">Monthly report for February 2025 is ready</Typography>
              <Typography variant="small" color="gray">8 hours ago</Typography>
            </div>
          </div>
        </div>
        
        <Button 
          variant="text" 
          color="blue" 
          className="mt-4 flex items-center gap-1"
          onClick={() => openModal('activity')}
        >
          View All Activity <ArrowRightIcon className="h-3 w-3" />
        </Button>
      </Card>
      
      {/* Modals */}
      <Dialog
        open={showModal}
        handler={() => setShowModal(false)}
        size="md"
      >
        <DialogHeader>
          {modalType === 'export' && 'Export Data'}
          {modalType === 'chart' && 'Detailed Analytics Chart'}
          {modalType === 'activity' && 'All Activity Log'}
        </DialogHeader>
        <DialogBody divider>
          {modalType === 'export' && (
            <div className="space-y-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Select Data Range
                </Typography>
                <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                  <option value="daily">Daily (Last 7 Days)</option>
                  <option value="weekly">Weekly (Last 4 Weeks)</option>
                  <option value="monthly">Monthly (Last 6 Months)</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Data Format
                </Typography>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" value="csv" defaultChecked className="h-4 w-4" />
                    <span>CSV</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" value="excel" className="h-4 w-4" />
                    <span>Excel</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" value="pdf" className="h-4 w-4" />
                    <span>PDF</span>
                  </label>
                </div>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Include Metrics
                </Typography>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                    <span>User Statistics</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                    <span>Revenue Data</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                    <span>Task Completion</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                    <span>Activity Log</span>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {modalType === 'chart' && (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                  <Typography variant="h6" color="gray">Interactive Chart Visualization</Typography>
                  <Typography variant="small" color="gray" className="max-w-sm mx-auto">
                    In a production environment, this would display an interactive chart showing detailed analytics data based on the selected time period
                  </Typography>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <Typography variant="small" color="gray">Total Users</Typography>
                  <Typography variant="h6" className="font-bold">24,892</Typography>
                  <Typography variant="small" color="green">+12.3%</Typography>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg">
                  <Typography variant="small" color="gray">Revenue</Typography>
                  <Typography variant="h6" className="font-bold">$198,453</Typography>
                  <Typography variant="small" color="green">+15.7%</Typography>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg">
                  <Typography variant="small" color="gray">Avg. Conversion</Typography>
                  <Typography variant="h6" className="font-bold">3.8%</Typography>
                  <Typography variant="small" color="green">+0.5%</Typography>
                </div>
              </div>
            </div>
          )}
          
          {modalType === 'activity' && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex items-start gap-4 p-3 border border-gray-100 rounded-lg">
                  <div className="rounded-full p-2 bg-blue-50">
                    {index % 3 === 0 && <UsersIcon className="h-5 w-5 text-blue-500" />}
                    {index % 3 === 1 && <CreditCardIcon className="h-5 w-5 text-green-500" />}
                    {index % 3 === 2 && <ChartBarIcon className="h-5 w-5 text-purple-500" />}
                  </div>
                  <div>
                    <Typography variant="small" className="font-medium">
                      {index % 3 === 0 && 'User Activity'}
                      {index % 3 === 1 && 'Billing Event'}
                      {index % 3 === 2 && 'System Event'}
                    </Typography>
                    <Typography variant="small" color="gray">
                      {index % 3 === 0 && `User "${['john', 'mary', 'alex', 'sarah', 'mike'][index % 5]}@example.com" performed an action`}
                      {index % 3 === 1 && 'Subscription plan change or payment processed'}
                      {index % 3 === 2 && 'System maintenance or report generation'}
                    </Typography>
                    <Typography variant="small" color="gray">{index + 1} hour{index !== 0 ? 's' : ''} ago</Typography>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowModal(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            color={modalType === 'export' ? 'blue' : 'gray'}
            onClick={() => {
              setShowModal(false);
              if (modalType === 'export') {
                showSuccessAlert();
              }
            }}
          >
            {modalType === 'export' ? 'Export Data' : 'Close'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

interface project {
  id: number,
  name: string,
  description: string,
  progress?: number,
  deadline: string,
  status: string,
  team: string[],
  priority: string
}

// Project Management Component
const ProjectManagement = () => {
  const [projects, setProjects] = useState<project[]>([
    {
      id: 1,
      name: 'AI Customer Service Bot',
      description: 'Implementing conversational AI for customer support',
      progress: 75,
      deadline: '2025-04-15',
      status: 'active',
      team: ['John D.', 'Sarah M.', 'Mike R.'],
      priority: 'high'
    },
    {
      id: 2,
      name: 'Data Warehouse Migration',
      description: 'Moving from legacy system to cloud data warehouse',
      progress: 45,
      deadline: '2025-05-20',
      status: 'active',
      team: ['Lisa K.', 'Tom B.'],
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Mobile App Redesign',
      description: 'UX/UI overhaul of the mobile application',
      progress: 90,
      deadline: '2025-03-30',
      status: 'active',
      team: ['Alex J.', 'Maria S.', 'David L.', 'Emma W.'],
      priority: 'high'
    },
    {
      id: 4,
      name: 'CRM Integration',
      description: 'Connect sales platform with customer database',
      progress: 15,
      deadline: '2025-06-10',
      status: 'planned',
      team: ['Robert C.', 'Nina P.'],
      priority: 'medium'
    },
    {
      id: 5,
      name: 'Security Audit',
      description: 'Annual security review and compliance check',
      progress: 60,
      deadline: '2025-04-30',
      status: 'active',
      team: ['Daniel F.', 'Olivia M.'],
      priority: 'high'
    }
  ]);
    
  const [showModal, setShowModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<project | null>(null);
  const [modalType, setModalType] = useState('');
  const [showAlert, setShowAlert] = useState({ show: false, message: '', color: 'green' });
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    deadline: '',
    status: 'planned',
    priority: 'medium',
    team: ''
  });
    
  const openModal = (type: string, project: project | null = null) => {
    setModalType(type);
    setCurrentProject(project);
    
    if (type === 'new') {
      setProjectForm({
        name: '',
        description: '',
        deadline: new Date().toISOString().split('T')[0],
        status: 'planned',
        priority: 'medium',
        team: ''
      });
    } else if (type === 'edit' && project) {
      setProjectForm({
        name: project.name,
        description: project.description,
        deadline: project.deadline,
        status: project.status,
        priority: project.priority,
        team: project.team.join(', ')
      });
    }
    
    setShowModal(true);
  };
    
  const handleStatusChange = (projectId: number, newStatus: string) => {
    const updatedProjects = projects.map(project => 
      project.id === projectId ? { ...project, status: newStatus } : project
    );
    setProjects(updatedProjects);
    
    showStatusAlert('Project status updated successfully!');
  };
    
  const handleFormChange = (field: string, value: string) => {
    setProjectForm({
      ...projectForm,
      [field]: value
    });
  };
    
  const handleSubmitProject = () => {
    if (modalType === 'new') {
      // Create new project
      const newProject = {
        id: projects.length + 1,
        name: projectForm.name,
        description: projectForm.description,
        progress: 0,
        deadline: projectForm.deadline,
        status: projectForm.status,
        team: typeof projectForm.team === 'string' ? projectForm.team.split(',').map(t => t.trim()) : projectForm.team,
        priority: projectForm.priority
      };
      
      setProjects([...projects, newProject]);
      showStatusAlert('New project created successfully!');
    } else if (modalType === 'edit' && currentProject) {
      // Update existing project
      const updatedProjects = projects.map(project => 
        project.id === currentProject.id 
          ? { 
              ...project,
              name: projectForm.name,
              description: projectForm.description,
              deadline: projectForm.deadline,
              status: projectForm.status,
              team: typeof projectForm.team === 'string' ? projectForm.team.split(',').map(t => t.trim()) : projectForm.team,
              priority: projectForm.priority
            } 
          : project
      );
      
      setProjects(updatedProjects);
      showStatusAlert('Project updated successfully!');
    }
    
    setShowModal(false);
  };
    
  const deleteProject = () => {
    if (currentProject) {
      const updatedProjects = projects.filter(project => project.id !== currentProject.id);
      setProjects(updatedProjects);
      setShowModal(false);
      showStatusAlert('Project deleted successfully!', 'red');
    }
  };
    
  const showStatusAlert = (message: string, color = 'green') => {
    setShowAlert({ show: true, message, color });
    setTimeout(() => setShowAlert({ ...showAlert, show: false }), 3000);
  };
    
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'planned':
        return 'blue';
      case 'completed':
        return 'purple';
      case 'paused':
        return 'amber';
      default:
        return 'gray';
    }
  };
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'amber';
      case 'low':
        return 'blue';
      default:
        return 'gray';
    }
  };
  
  // Format deadline date
  const formatDeadline = (deadline: string | number | Date) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Is deadline close or overdue
  const isDeadlineClose = (deadline: string | number | Date) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    
    return diffDays <= 7;
  };
  
  const isDeadlinePassed = (deadline: string | number | Date) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate < today;
  };
  
  return (
    <div className="space-y-6">
      {/* Success/Error Alert */}
      {showAlert.show && (
        <Alert
          open={showAlert.show}
          color={showAlert.color as colors}
          className="fixed top-20 right-4 z-50 max-w-md"
          icon={<CheckCircleIcon className="h-6 w-6" />}
          onClose={() => setShowAlert({...showAlert, show: false})}
        >
          {showAlert.message}
        </Alert>
      )}
      
      {/* Header Card */}
      <Card className="p-6 border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-500 mb-4">
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Project Management</span>
              </div>
              <Typography variant="h3" color="blue-gray" className="mb-2">
                Your Projects
              </Typography>
              <Typography color="gray">
                Track and manage your active and upcoming projects
              </Typography>
            </div>
            <Button 
              color="blue" 
              className="flex items-center gap-2"
              size="sm"
              onClick={() => openModal('new')}
            >
              <DocumentTextIcon className="h-4 w-4" /> 
              New Project
            </Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      </Card>
      
      {/* Projects Container */}
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-full bg-${getStatusColor(project.status)}-50`}>
                      <DocumentTextIcon className={`h-5 w-5 text-${getStatusColor(project.status)}-500`} />
                    </div>
                    <div>
                      <Typography variant="h6">{project.name}</Typography>
                      <div className="flex items-center gap-2">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={project.status}
                          color={getStatusColor(project.status)}
                          className="capitalize"
                        />
                        <Chip
                          size="sm"
                          variant="outlined"
                          value={project.priority}
                          color={getPriorityColor(project.priority)}
                          className="capitalize"
                        />
                        <Typography variant="small" color={isDeadlinePassed(project.deadline) ? "red" : isDeadlineClose(project.deadline) ? "amber" : "gray"} className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {formatDeadline(project.deadline)}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <Typography variant="small" color="gray" className="mb-3">
                    {project.description}
                  </Typography>
                  <Progress value={project.progress} color={getStatusColor(project.status)} className="h-1" />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.team.map((member, index) => (
                      <Chip
                        key={index}
                        value={member}
                        variant="outlined"
                        size="sm"
                        className="bg-gray-50"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 justify-start md:justify-end">
                  <Menu placement="bottom-end">
                    <MenuHandler>
                      <Button color="gray" variant="outlined" size="sm">
                        Change Status
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      <MenuItem onClick={() => handleStatusChange(project.id, 'planned')}>Planned</MenuItem>
                      <MenuItem onClick={() => handleStatusChange(project.id, 'active')}>Active</MenuItem>
                      <MenuItem onClick={() => handleStatusChange(project.id, 'paused')}>Paused</MenuItem>
                      <MenuItem onClick={() => handleStatusChange(project.id, 'completed')}>Completed</MenuItem>
                    </MenuList>
                  </Menu>
                  <Button color="blue" variant="outlined" size="sm" onClick={() => openModal('view', project)}>
                    View
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Modals */}
      <Dialog
        open={showModal}
        handler={() => setShowModal(false)}
        size="md"
      >
        <DialogHeader>
          {modalType === 'new' && 'Create New Project'}
          {modalType === 'edit' && 'Edit Project'}
          {modalType === 'view' && 'Project Details'}
          {modalType === 'delete' && 'Confirm Delete'}
        </DialogHeader>
        <DialogBody divider>
          {(modalType === 'new' || modalType === 'edit') && (
            <div className="space-y-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Project Name
                </Typography>
                <Input
                  value={projectForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  label="Enter project name" crossOrigin={undefined}                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Description
                </Typography>
                <Textarea
                  value={projectForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  label="Project description"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Deadline
                  </Typography>
                  <Input
                    type="date"
                    value={projectForm.deadline}
                    onChange={(e) => handleFormChange('deadline', e.target.value)} crossOrigin={undefined}                  />
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Status
                  </Typography>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    value={projectForm.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                  >
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Priority
                  </Typography>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    value={projectForm.priority}
                    onChange={(e) => handleFormChange('priority', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Team Members
                  </Typography>
                  <Input
                    value={projectForm.team}
                    onChange={(e) => handleFormChange('team', e.target.value)}
                    label="Comma-separated list of members" crossOrigin={undefined}                  />
                </div>
              </div>
            </div>
          )}
          
          {modalType === 'view' && currentProject && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Chip
                  value={currentProject.status}
                  color={getStatusColor(currentProject.status)}
                  className="capitalize"
                />
                <Chip
                  variant="outlined"
                  value={currentProject.priority}
                  color={getPriorityColor(currentProject.priority)}
                  className="capitalize"
                />
                <Typography variant="small" color={isDeadlinePassed(currentProject.deadline) ? "red" : isDeadlineClose(currentProject.deadline) ? "amber" : "gray"} className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {formatDeadline(currentProject.deadline)}
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Description
                </Typography>
                <Typography className="mt-1">
                  {currentProject.description}
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Progress
                </Typography>
                <div className="mt-1">
                  <Progress value={currentProject.progress} color={getStatusColor(currentProject.status)} className="h-2" />
                  <Typography variant="small" className="mt-1 text-right">
                    {currentProject.progress}%
                  </Typography>
                </div>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Team
                </Typography>
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentProject.team.map((member, index) => (
                    <Chip
                      key={index}
                      value={member}
                      className="bg-gray-50"
                    />
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Project Tasks
                </Typography>
                <div className="mt-2 space-y-2">
                  <div className="p-3 border border-gray-100 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-green-500"></div>
                      <Typography variant="small">Initial requirements gathering</Typography>
                    </div>
                    <Chip value="Completed" color="green" size="sm" />
                  </div>
                  
                  <div className="p-3 border border-gray-100 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                      <Typography variant="small">Design system architecture</Typography>
                    </div>
                    <Chip value="In Progress" color="blue" size="sm" />
                  </div>
                  
                  <div className="p-3 border border-gray-100 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                      <Typography variant="small">Develop core functionality</Typography>
                    </div>
                    <Chip value="Pending" color="gray" size="sm" />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {modalType === 'delete' && currentProject && (
            <div>
              <Typography color="red" className="font-medium mb-2">
                Are you sure you want to delete this project?
              </Typography>
              <Typography variant="small" color="gray">
                This action cannot be undone. This will permanently delete the project "{currentProject.name}" and all associated data.
              </Typography>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <div>
              {modalType === 'view' && (
                <Button
                  variant="text"
                  color="red"
                  onClick={() => {
                    openModal('delete', currentProject);
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="text"
                color="gray"
                onClick={() => setShowModal(false)}
              >
                {modalType === 'view' ? 'Close' : 'Cancel'}
              </Button>
              
              {modalType === 'view' && (
                <Button
                  color="blue"
                  onClick={() => {
                    setShowModal(false);
                    openModal('edit', currentProject);
                  }}
                >
                  Edit Project
                </Button>
              )}
              
              {(modalType === 'new' || modalType === 'edit') && (
                <Button
                  color="blue"
                  onClick={handleSubmitProject}
                >
                  {modalType === 'new' ? 'Create Project' : 'Save Changes'}
                </Button>
              )}
              
              {modalType === 'delete' && (
                <Button
                  color="red"
                  onClick={deleteProject}
                >
                  Delete Project
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
// User Dashboard Content Component
const UserDashboard = () => {
  const navigate = useNavigate();
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    color: "green"
  });

  const handleExploreServices = () => {
    navigate('/dashboard/marketplace');
  };

  const handleNavigateToProjects = () => {
    navigate('/dashboard/projects');
  };

  const handleNavigateToAnalytics = () => {
    navigate('/dashboard/analytics');
  };

  const handleServiceClick = (service: string) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const showSuccessAlert = (message: string) => {
    setShowAlert({
      show: true,
      message: message,
      color: "green"
    });
    
    setTimeout(() => {
      setShowAlert({...showAlert, show: false});
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {showAlert.show && (
        <Alert
          open={showAlert.show}
          color={showAlert.color as colors}
          className="fixed top-20 right-4 z-50 max-w-md"
          icon={<CheckCircleIcon className="h-6 w-6" />}
          onClose={() => setShowAlert({...showAlert, show: false})}
        >
          {showAlert.message}
        </Alert>
      )}

      {/* Welcome Card */}
      <Card className="p-6 border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-500 mb-4">
                <SparklesIcon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">User Dashboard</span>
              </div>
              <Typography variant="h3" color="blue-gray" className="mb-2">
                Welcome to Theoforge
              </Typography>
              <Typography color="gray">
                Access your AI services and explore new capabilities for your business
              </Typography>
            </div>
            <div className="flex gap-2">
              <Button 
                color="teal" 
                className="flex items-center gap-2"
                size="sm"
                onClick={handleExploreServices}
              >
                <SparklesIcon className="h-4 w-4" /> 
                Explore Services
              </Button>
              <Button 
                color="blue" 
                className="flex items-center gap-2"
                size="sm"
                onClick={() => setIsChatOpen(true)}
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" /> 
                Chat with AI
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      </Card>
      
      {/* User Services */}
      <Card className="p-6 border border-gray-100">
        <Typography variant="h5" color="blue-gray" className="mb-4">
          Your Services
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-teal-50">
                  <SparklesIcon className="h-5 w-5 text-teal-500" />
                </div>
                <Typography variant="h6">AI Assistants</Typography>
              </div>
              <Typography variant="small" color="gray">
                Leverage our AI assistants to automate tasks and enhance productivity.
              </Typography>
              <Button 
                variant="text" 
                color="teal" 
                className="mt-4 flex items-center gap-1"
                onClick={() => handleServiceClick("AI Assistants")}
              >
                Explore <ArrowRightIcon className="h-3 w-3" />
              </Button>
            </div>
          </Card>
          <Card className="border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-blue-50">
                  <ChartBarIcon className="h-5 w-5 text-blue-500" />
                </div>
                <Typography variant="h6">Data Analytics</Typography>
              </div>
              <Typography variant="small" color="gray">
                Access powerful analytics tools to derive insights from your data.
              </Typography>
              <Button 
                variant="text" 
                color="blue" 
                className="mt-4 flex items-center gap-1"
                onClick={() => handleServiceClick("Data Analytics")}
              >
                Explore <ArrowRightIcon className="h-3 w-3" />
              </Button>
            </div>
          </Card>
          <Card className="border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-purple-50">
                  <CpuChipIcon className="h-5 w-5 text-purple-500" />
                </div>
                <Typography variant="h6">Machine Learning</Typography>
              </div>
              <Typography variant="small" color="gray">
                Implement custom ML models tailored to your business needs.
              </Typography>
              <Button 
                variant="text" 
                color="purple" 
                className="mt-4 flex items-center gap-1"
                onClick={() => handleServiceClick("Machine Learning")}
              >
                Explore <ArrowRightIcon className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        </div>
      </Card>

      {/* Recent Projects */}
      <Card className="p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" color="blue-gray">
            Recent Projects
          </Typography>
          <Button 
            variant="text" 
            color="blue" 
            className="flex items-center gap-1"
            onClick={handleNavigateToProjects}
          >
            View All <ArrowRightIcon className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-4">
          <Card className="border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-teal-50">
                  <SparklesIcon className="h-5 w-5 text-teal-500" />
                </div>
                <div>
                  <Typography variant="h6">Sales Forecasting</Typography>
                  <Typography variant="small" color="gray">Last updated: 2 days ago</Typography>
                </div>
              </div>
              <Tooltip content="Active project">
                <Button 
                  size="sm" 
                  color="teal" 
                  className="rounded-full cursor-pointer"
                  onClick={() => showSuccessAlert("Opened Sales Forecasting project")}
                >Active</Button>
              </Tooltip>
            </div>
            <Typography variant="small" className="mt-3 text-gray-600">
              AI-powered sales forecasting model for quarterly projections.
            </Typography>
            <Progress value={75} color="teal" className="h-1 mt-3" />
          </Card>
          
          <Card className="border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-50">
                  <ChartBarIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <Typography variant="h6">Customer Segmentation</Typography>
                  <Typography variant="small" color="gray">Last updated: 1 week ago</Typography>
                </div>
              </div>
              <Tooltip content="In progress">
                <Button 
                  size="sm"
                  color="blue" 
                  className="rounded-full cursor-pointer"
                  onClick={() => showSuccessAlert("Opened Customer Segmentation project")}
                >In Progress</Button>
              </Tooltip>
            </div>
            <Typography variant="small" className="mt-3 text-gray-600">
              Analyzing customer data to identify key market segments.
            </Typography>
            <Progress value={45} color="blue" className="h-1 mt-3" />
          </Card>
        </div>
      </Card>
      
      {/* Quick Actions */}
      <Card className="p-6 border border-gray-100">
        <Typography variant="h5" color="blue-gray" className="mb-4">
          Quick Actions
        </Typography>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Button 
            color="teal" 
            variant="outlined" 
            className="flex flex-col items-center justify-center h-24 normal-case"
            onClick={() => setShowProjectModal(true)}
          >
            <SparklesIcon className="h-6 w-6 mb-2" />
            <span>New Project</span>
          </Button>
          <Button 
            color="blue" 
            variant="outlined" 
            className="flex flex-col items-center justify-center h-24 normal-case"
            onClick={() => setShowAnalysisModal(true)}
          >
            <ChartBarIcon className="h-6 w-6 mb-2" />
            <span>Run Analysis</span>
          </Button>
          <Button 
            color="purple" 
            variant="outlined" 
            className="flex flex-col items-center justify-center h-24 normal-case"
            onClick={() => setShowSupportModal(true)}
          >
            <ChatBubbleLeftRightIcon className="h-6 w-6 mb-2" />
            <span>Contact Support</span>
          </Button>
          <Button 
            color="amber" 
            variant="outlined" 
            className="flex flex-col items-center justify-center h-24 normal-case"
            onClick={() => setShowSettingsModal(true)}
          >
            <CpuChipIcon className="h-6 w-6 mb-2" />
            <span>AI Settings</span>
          </Button>
        </div>
      </Card>

      {/* Metrics at a Glance */}
      <Card className="p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" color="blue-gray">
            Metrics at a Glance
          </Typography>
          <Button 
            variant="text" 
            color="blue" 
            className="flex items-center gap-1"
            onClick={handleNavigateToAnalytics}
          >
            View Analytics <ArrowRightIcon className="h-3 w-3" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-blue-50">
                <UsersIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <Typography variant="small" color="gray">Active Users</Typography>
                <Typography variant="h4">1,234</Typography>
                <Typography variant="small" color="green">+12.3% vs last week</Typography>
              </div>
            </div>
          </Card>
          <Card className="p-4 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-green-50">
                <CreditCardIcon className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <Typography variant="small" color="gray">Revenue</Typography>
                <Typography variant="h4">$12,345</Typography>
                <Typography variant="small" color="green">+8.7% vs last week</Typography>
              </div>
            </div>
          </Card>
          <Card className="p-4 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-purple-50">
                <ChartBarIcon className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <Typography variant="small" color="gray">Conversion Rate</Typography>
                <Typography variant="h4">3.45%</Typography>
                <Typography variant="small" color="green">+0.8% vs last week</Typography>
              </div>
            </div>
          </Card>
        </div>
      </Card>
{/* Service Modal */}
<Dialog
        open={showServiceModal}
        handler={() => setShowServiceModal(false)}
        size="lg"
      >
        <DialogHeader className="flex items-center gap-2">
          {selectedService === "AI Assistants" && (
            <SparklesIcon className="h-6 w-6 text-teal-500" />
          )}
          {selectedService === "Data Analytics" && (
            <ChartBarIcon className="h-6 w-6 text-blue-500" />
          )}
          {selectedService === "Machine Learning" && (
            <CpuChipIcon className="h-6 w-6 text-purple-500" />
          )}
          {selectedService}
        </DialogHeader>
        <DialogBody divider>
          {selectedService === "AI Assistants" && (
            <div className="space-y-4">
              <Typography>
                Our AI Assistant service provides cutting-edge conversational AI solutions to automate customer interactions, support internal processes, and enhance productivity.
              </Typography>
              <Typography variant="h6">Key Features:</Typography>
              <ul className="list-disc pl-6 space-y-2">
                <li>Natural language processing for human-like conversations</li>
                <li>Customizable workflows and knowledge base</li>
                <li>Multi-platform integration (website, mobile, messaging apps)</li>
                <li>Analytics dashboard for performance tracking</li>
                <li>24/7 automated support capability</li>
              </ul>
            </div>
          )}
          {selectedService === "Data Analytics" && (
            <div className="space-y-4">
              <Typography>
                Our Data Analytics platform empowers your team to transform raw data into actionable insights with powerful visualization and analysis tools.
              </Typography>
              <Typography variant="h6">Key Features:</Typography>
              <ul className="list-disc pl-6 space-y-2">
                <li>Real-time data processing and visualization</li>
                <li>Interactive dashboards with customizable widgets</li>
                <li>Advanced statistical modeling and trend analysis</li>
                <li>Automated reporting and export capabilities</li>
                <li>Integration with major data sources and warehouses</li>
              </ul>
            </div>
          )}
          {selectedService === "Machine Learning" && (
            <div className="space-y-4">
              <Typography>
                Our Machine Learning solutions allow you to harness the power of AI for predictive modeling, pattern recognition, and automation of complex tasks.
              </Typography>
              <Typography variant="h6">Key Features:</Typography>
              <ul className="list-disc pl-6 space-y-2">
                <li>Custom model development for your specific business needs</li>
                <li>Automated model training and optimization</li>
                <li>Deployment options for cloud, edge, or on-premises</li>
                <li>Model monitoring and performance tuning</li>
                <li>Integration with existing systems and workflows</li>
              </ul>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowServiceModal(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            color="teal"
            onClick={() => {
              setShowServiceModal(false);
              showSuccessAlert(`${selectedService} service activated successfully!`);
            }}
          >
            Activate Service
          </Button>
        </DialogFooter>
      </Dialog>

      {/* New Project Modal */}
      <Dialog
        open={showProjectModal}
        handler={() => setShowProjectModal(false)}
        size="md"
      >
        <DialogHeader>Create New Project</DialogHeader>
        <DialogBody divider>
          <div className="space-y-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Project Name
              </Typography>
              <Input label="Enter project name" crossOrigin={undefined} />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Project Type
              </Typography>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500">
                <option value="">Select project type</option>
                <option value="ai_assistant">AI Assistant</option>
                <option value="data_analytics">Data Analytics</option>
                <option value="machine_learning">Machine Learning</option>
                <option value="custom">Custom Project</option>
              </select>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Description
              </Typography>
              <Textarea label="Project description" />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowProjectModal(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            color="teal"
            onClick={() => {
              setShowProjectModal(false);
              navigate('/dashboard/projects');
              showSuccessAlert("New project created successfully!");
            }}
          >
            Create Project
          </Button>
        </DialogFooter>
      </Dialog>
      
      {/* Run Analysis Modal */}
      <Dialog
        open={showAnalysisModal}
        handler={() => setShowAnalysisModal(false)}
        size="md"
      >
        <DialogHeader>Run Analysis</DialogHeader>
        <DialogBody divider>
          <div className="space-y-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Analysis Type
              </Typography>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500">
                <option value="">Select analysis type</option>
                <option value="predictive">Predictive Analysis</option>
                <option value="descriptive">Descriptive Statistics</option>
                <option value="sentiment">Sentiment Analysis</option>
                <option value="anomaly">Anomaly Detection</option>
              </select>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Data Source
              </Typography>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500">
                <option value="">Select data source</option>
                <option value="sales_data">Sales Data</option>
                <option value="customer_data">Customer Data</option>
                <option value="marketing_data">Marketing Data</option>
                <option value="custom">Custom Data Source</option>
              </select>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Parameters
              </Typography>
              <Textarea label="Analysis parameters" />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowAnalysisModal(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            color="blue"
            onClick={() => {
              setShowAnalysisModal(false);
              navigate('/dashboard/analytics');
              showSuccessAlert("Analysis started successfully!");
            }}
          >
            Run Analysis
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Contact Support Modal */}
      <Dialog
        open={showSupportModal}
        handler={() => setShowSupportModal(false)}
        size="md"
      >
        <DialogHeader>Contact Support</DialogHeader>
        <DialogBody divider>
          <div className="space-y-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Support Category
              </Typography>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500">
                <option value="">Select category</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Priority
              </Typography>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Description
              </Typography>
              <Textarea label="Describe your issue" rows={4} />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowSupportModal(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            color="purple"
            onClick={() => {
              setShowSupportModal(false);
              showSuccessAlert("Support ticket submitted successfully!");
            }}
          >
            Submit Ticket
          </Button>
        </DialogFooter>
      </Dialog>

      {/* AI Settings Modal */}
      <Dialog
        open={showSettingsModal}
        handler={() => setShowSettingsModal(false)}
        size="md"
      >
        <DialogHeader>AI Settings</DialogHeader>
        <DialogBody divider>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6">Enable AI Suggestions</Typography>
                <Typography variant="small" color="gray">
                  Receive AI-powered recommendations based on your activity
                </Typography>
              </div>
              <Switch color="amber" defaultChecked crossOrigin={undefined} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6">Automated Reporting</Typography>
                <Typography variant="small" color="gray">
                  Generate and send reports automatically on schedule
                </Typography>
              </div>
              <Switch color="amber" crossOrigin={undefined} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6">Data Collection</Typography>
                <Typography variant="small" color="gray">
                  Allow anonymous usage data to improve our services
                </Typography>
              </div>
              <Switch color="amber" defaultChecked crossOrigin={undefined} />
            </div>
            
            <div>
              <Typography variant="h6" className="mb-2">Model Preference</Typography>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-amber-500">
                <option value="balanced">Balanced (Default)</option>
                <option value="speed">Optimize for Speed</option>
                <option value="accuracy">Optimize for Accuracy</option>
                <option value="efficiency">Optimize for Efficiency</option>
              </select>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowSettingsModal(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            color="amber"
            onClick={() => {
              setShowSettingsModal(false);
              showSuccessAlert("AI settings updated successfully!");
            }}
          >
            Save Settings
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ChatBox */}
      {isChatOpen && (
        <ChatBox 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
};
// Main Dashboard Component
export function Dashboard() {
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isVisible, setIsVisible] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(role === "ADMIN"); // Default to admin view
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New User Registration",
      message: "A new user has registered on the platform.",
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: "System Update",
      message: "The system will undergo maintenance tonight at 2 AM EST.",
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      read: false,
      type: 'alert'
    },
    {
      id: 3,
      title: "Project Completed",
      message: "Sales Forecasting project has been completed successfully.",
      timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
      read: true,
      type: 'success'
    }
  ]);

  // Get count of unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Get current navigation based on view mode
  const navigation = isAdminView ? adminNavigation : userNavigation;
  useEffect(() => {
    setIsVisible(true);
    
    // Set current page based on location path
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment === 'dashboard' || lastSegment === '') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage(lastSegment);
    }
  }, [location.pathname]);

  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: "Theoforge",
    role: isAdminView ? "Administrator" : "Standard User",
    address: "123 Main St",
    city: "Newark",
    state: "NJ",
    zipCode: "07102",
    country: "United States",
    timezone: "America/New_York",
    language: "English",
    notifications: true
  });

  // States for support and report modals
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    color: "green"
  });
  // Update user role when admin view changes
  useEffect(() => {
    setUserData(prev => ({
      ...prev,
      role: isAdminView ? "Administrator" : "Standard User"
    }));
  }, [isAdminView]);
  
  // Function to show toast notifications
  const showNotification = (message: string, color = "green") => {
    setShowToast({
      show: true,
      message,
      color
    });
    
    setTimeout(() => {
      setShowToast({...showToast, show: false});
    }, 3000);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    // Check if the path is available in current view mode
    const isPathAvailable = navigation.some(item => item.href === path);
    if (!isPathAvailable) {
      // If trying to access a restricted page in user view, stay on dashboard
      if (!isAdminView) {
        path = '/dashboard';
      }
    }
    
    const page = path.split('/').pop() || 'dashboard';
    setCurrentPage(page);
    navigate(path);
    setIsDrawerOpen(false); // Close drawer on navigation
  };

  const handleToggleView = () => {
    setIsAdminView(!isAdminView);
    // If switching to user view while on an admin-only page, redirect to dashboard
    if (isAdminView) {
      const currentPath = location.pathname;
      const isPathAvailable = userNavigation.some(item => item.href === currentPath);
      if (!isPathAvailable) {
        navigate('/dashboard');
        setCurrentPage('dashboard');
      }
    }
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const formatNotificationTime = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <BellIcon className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const breadcrumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map((path, index, array) => ({
      name: path.charAt(0).toUpperCase() + path.slice(1),
      href: '/' + array.slice(0, index + 1).join('/'),
      current: index === array.length - 1,
    }));
    
  // Updated Sidebar with visible toggle button when collapsed
  const Sidebar = () => (
    <div>
      <div className={cn(isSidebarCollapsed ? "w-28" : "w-[20rem]")}>
        {/* Phantom element to take up space of fixed sidebar */}
      </div>
      <Card className={cn(
        "shadow-xl shadow-blue-gray-900/5 overflow-auto transition-all duration-300",
        isSidebarCollapsed ? "w-28" : "w-full max-w-[20rem]",
        isDrawerOpen ? "relative p-4 pr-16" : "fixed top-24 bottom-0 p-4 pr-16"
      )}>
        {/* Toggle button fixed position to always remain visible */}
        <div className={isSidebarCollapsed ? "fixed top-64 left-16" : 'fixed top-64 left-64'}>
          <IconButton
            variant="text"
            color="teal"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="mb-4"
          >
            {isSidebarCollapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
          </IconButton>
        </div>
        <div className="relative z-10">
          {/* Role identifier */}
          {!isSidebarCollapsed && (
            <div className="mb-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-3 border border-teal-100">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-3 w-3 rounded-full",
                  isAdminView ? "bg-red-500" : "bg-green-500"
                )}></div>
                <Typography variant="small" className="font-medium text-blue-gray-700">
                  {isAdminView ? "Admin View" : "User View"}
                </Typography>
              </div>
            </div>
          )}
          
          <div>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.href === '/dashboard' && location.pathname === '/dashboard') || 
                              (location.pathname.includes(item.href) && item.href !== '/dashboard');
              return (
                <ListItem
                  key={item.name}
                  className={cn(
                    "mb-2 hover:bg-teal-50/80 transition-all duration-200",
                    isActive ? "bg-teal-50/80 text-teal-500 font-medium" : "",
                    isSidebarCollapsed ? "w-12" : ""
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <ListItemPrefix>
                    <item.icon className={cn(
                      "h-5 w-5",
                      isActive ? "text-teal-500" : "text-blue-gray-500"
                    )} />
                  </ListItemPrefix>
                  {!isSidebarCollapsed && (
                    <div>
                      <Typography variant="small" className={isActive ? "font-medium" : ""}>
                        {item.name}
                      </Typography>
                      {!isActive && (
                        <Typography variant="small" className="text-xs text-gray-500">
                          {item.description}
                        </Typography>
                      )}
                    </div>
                  )}
                </ListItem>
              );
            })}
          </div>
          
          {!isSidebarCollapsed && (
            <div className="mt-auto pt-8">
              <Card className="mt-6 bg-gradient-to-br from-teal-500 to-teal-700 text-white p-4 rounded-xl">
                <Typography variant="h6" className="mb-2">Need Help?</Typography>
                <Typography variant="small" className="mb-4 opacity-80">
                  Contact our support team for assistance with any issues.
                </Typography>
                <Button 
                  size="sm" 
                  className="bg-white text-teal-800 flex items-center gap-2 shadow-md hover:shadow-lg"
                  fullWidth
                  onClick={() => setIsSupportModalOpen(true)}
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  Contact Support
                </Button>
              </Card>
              
              <Button 
                size="sm"
                color="red"
                variant="text"
                className="flex items-center gap-2 mt-4 w-full justify-center"
                onClick={handleLogout} 
              >
                <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
    
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Add blur overlay when logout modal is open */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"></div>
      )}
  
      <Navbar className="sticky top-0 z-10 max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between text-blue-gray-900">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Theoforge Logo" className="h-12 w-12" />
            <Typography variant="h5" color="blue-gray">
              Theoforge
            </Typography>
            <IconButton
              variant="text"
              color="teal"
              className="lg:hidden"
              hidden={isDrawerOpen}
              onClick={() => setIsDrawerOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </IconButton>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Admin/User View Toggle */}
            <div className="flex items-center gap-2">
              <Typography variant="small" color={isAdminView ? "teal" : "gray"} className="font-medium">
                Admin
              </Typography>
              <Switch 
                color="teal"
                checked={!isAdminView}
                onChange={handleToggleView}
                label=""
                className="h-full" crossOrigin={undefined}              />
              <Typography variant="small" color={!isAdminView ? "teal" : "gray"} className="font-medium">
                User
              </Typography>
            </div>
            
            {/* Notifications dropdown */}
            <Menu
              placement="bottom-end"
              open={isNotificationsOpen}
              handler={setIsNotificationsOpen}
            >
              <MenuHandler>
                <div className="relative">
                  <IconButton variant="text" color="blue-gray" className="">
                    <BellIcon className="h-5 w-5" />
                  </IconButton>
                  {unreadCount > 0 && (
                    <Badge
                      content={unreadCount}
                      color="teal"
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                    >{' '}</Badge>
                  )}
                </div>
              </MenuHandler>
              <MenuList className="p-2 max-h-[400px] min-w-[300px] overflow-y-auto">
                <div className="flex items-center justify-between p-2 border-b border-gray-100">
                  <Typography variant="small" className="font-bold">
                    Notifications
                  </Typography>
                  {unreadCount > 0 ? (
                    <Button variant="text" size="sm" onClick={markAllNotificationsAsRead} className="text-xs py-1">
                      Mark all as read
                    </Button>
                  ) : (
                    <Typography variant="small" className="text-gray-500 text-xs">
                      No new notifications
                    </Typography>
                  )}
                </div>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <MenuItem key={notification.id} className={cn(
                      "flex flex-col items-start gap-1 border-b border-gray-50 hover:bg-gray-50 transition-colors",
                      !notification.read ? "bg-teal-50/50" : ""
                    )}>
                      <div className="flex items-start justify-between w-full">
                        <div className="flex gap-2">
                          <div className="p-1.5 rounded-full bg-gray-100">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Typography variant="small" className="font-medium">
                                {notification.title}
                              </Typography>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                              )}
                            </div>
                            <Typography variant="small" className="text-gray-600">
                              {notification.message}
                            </Typography>
                            <Typography variant="small" className="text-gray-500 text-xs">
                              {formatNotificationTime(notification.timestamp)}
                            </Typography>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          {!notification.read && (
                            <IconButton 
                              variant="text" 
                              size="sm" 
                              color="teal" 
                              className="h-6 w-6 min-w-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                markNotificationAsRead(notification.id);
                              }}
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </IconButton>
                          )}
                          <IconButton 
                            variant="text" 
                            size="sm" 
                            color="red" 
                            className="h-6 w-6 min-w-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </div>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem className="text-center text-gray-500 py-6">
                    No notifications
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
            
            <Menu>
              <MenuHandler>
                <Button 
                  variant="text" 
                  color="blue-gray" 
                  className="flex items-center gap-2 normal-case shadow-none px-2"
                >
                  <Avatar 
                    src="/api/placeholder/40/40" 
                    alt="User" 
                    size="sm" 
                    className="border border-gray-200" 
                  />
                  <div className="hidden sm:block text-left">
                    <Typography variant="small" className="font-medium">
                      {userData.firstName} {userData.lastName}
                    </Typography>
                    <Typography variant="small" className="text-xs text-gray-500">
                      {userData.role}
                    </Typography>
                  </div>
                </Button>
              </MenuHandler>
              <MenuList className="p-1">
                <MenuItem 
                  className="flex items-center gap-2 rounded hover:bg-teal-50/80"
                  onClick={() => navigate('/dashboard/profile')}
                >
                  <UserCircleIcon className="h-4 w-4 text-teal-500" />
                  <Typography variant="small" className="font-normal">
                    Profile Settings
                  </Typography>
                </MenuItem>
                <Link to="/learn-more">
                  <MenuItem 
                    className="flex items-center gap-2 rounded hover:bg-teal-50/80"
                  >
                    <InformationCircleIcon className="h-4 w-4 text-teal-500" />
                    <Typography variant="small" className="font-normal">
                      Learn More
                    </Typography>
                  </MenuItem>
                </Link>
                <MenuItem 
                  className="flex items-center gap-2 rounded hover:bg-red-50 text-red-500"
                  onClick={handleLogout}
                >
                  <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                  <Typography variant="small" className="font-normal">
                    Sign Out
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </Navbar>

      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <Drawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          className="lg:hidden w-auto"
        >
          <Navbar className="sticky top-0 z-10 max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between text-blue-gray-900">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Theoforge Logo" className="h-12 w-12" />
                {!isSidebarCollapsed ? (<Typography variant="h5" color="blue-gray">
                  Theoforge
                </Typography>) : <></>}
              </div>
              <div className="flex items-center">
                <IconButton
                  variant="text"
                  color="teal"
                  className="lg:hidden"
                  hidden={isSidebarCollapsed}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <MenuIcon className="h-6 w-6" />
                </IconButton>
              </div>
            </div>
          </Navbar>
          <Sidebar />
        </Drawer>

        <div className="flex-1 p-4 lg:p-6 max-w-full overflow-auto">
          <Breadcrumbs className="bg-white rounded-lg p-3 mb-4 border border-gray-100">
            {breadcrumbs.map((breadcrumb, /*index*/) => (
              <a
                key={breadcrumb.href}
                onClick={() => navigate(breadcrumb.href)}
                className={cn(
                  "opacity-60",
                 breadcrumb.current ? "opacity-100 text-teal-500 font-medium" : ""
                )}
              >
                <span>{breadcrumb.name}</span>
              </a>
            ))}   
          </Breadcrumbs>

          <div className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            {/* Dashboard page - conditionally render based on view mode */}
            {currentPage === 'dashboard' && (
              <>
                {isAdminView ? (
                  // Admin Dashboard Content
                  <div className="space-y-6">
                    {/* Welcome Header */}
                    <Card className="p-6 border border-gray-100 relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-500 mb-4">
                              <SparklesIcon className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">Admin Dashboard</span>
                            </div>
                            <Typography variant="h3" color="blue-gray" className="mb-2">
                              Welcome back, {userData.firstName}!
                            </Typography>
                            <Typography color="gray">
                              Here's what's happening with your projects today.
                            </Typography>
                          </div>
                          <Button 
                            color="teal" 
                            className="flex items-center gap-2"
                            size="sm"
                            onClick={() => setIsReportModalOpen(true)}
                          >
                            <SparklesIcon className="h-4 w-4" /> 
                            Generate Report
                          </Button>
                        </div>
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                    </Card>

                    {/* Admin Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="p-4 border border-gray-100 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div>
                            <Typography variant="small" color="gray" className="mb-2">
                              Total Users
                            </Typography>
                            <Typography variant="h4">
                              1,204
                            </Typography>
                            <div className="flex items-center mt-1">
                              <Typography variant="small" color="teal" className="font-medium">
                                +12%
                              </Typography>
                              <Typography variant="small" color="gray" className="ml-1">
                                vs. last month
                              </Typography>
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                            <UsersIcon className="h-6 w-6" />
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4 border border-gray-100 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div>
                            <Typography variant="small" color="gray" className="mb-2">
                              Active Guests
                            </Typography>
                            <Typography variant="h4">
                              423
                            </Typography>
                            <div className="flex items-center mt-1">
                              <Typography variant="small" color="teal" className="font-medium">
                                +5%
                              </Typography>
                              <Typography variant="small" color="gray" className="ml-1">
                                vs. last month
                              </Typography>
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-teal-50 text-teal-500">
                            <HomeIcon className="h-6 w-6" />
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4 border border-gray-100 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div>
                            <Typography variant="small" color="gray" className="mb-2">
                              New Sign-ups
                            </Typography>
                            <Typography variant="h4">
                              48
                            </Typography>
                            <div className="flex items-center mt-1">
                              <Typography variant="small" color="teal" className="font-medium">
                                +18%
                              </Typography>
                              <Typography variant="small" color="gray" className="ml-1">
                                vs. last month
                              </Typography>
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-purple-50 text-purple-500">
                            <UserCircleIcon className="h-6 w-6" />
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4 border border-gray-100 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div>
                            <Typography variant="small" color="gray" className="mb-2">
                              Marketplace Items
                            </Typography>
                            <Typography variant="h4">
                              152
                            </Typography>
                            <div className="flex items-center mt-1">
                              <Typography variant="small" color="teal" className="font-medium">
                                +7%
                              </Typography>
                              <Typography variant="small" color="gray" className="ml-1">
                                vs. last month
                              </Typography>
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
                            <ShoppingBagIcon className="h-6 w-6" />
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Quick Navigation Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="p-4 border border-gray-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate('/dashboard/users')}>
                        <div className="p-3 bg-blue-50 rounded-full mb-3">
                          <UsersIcon className="h-6 w-6 text-blue-500" />
                        </div>
                        <Typography variant="h6">User Management</Typography>
                        <Typography variant="small" color="gray" className="mt-1">
                          Manage user access and permissions
                        </Typography>
                      </Card>
                      <Card className="p-4 border border-gray-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate('/dashboard/projects')}>
                        <div className="p-3 bg-teal-50 rounded-full mb-3">
                          <DocumentTextIcon className="h-6 w-6 text-teal-500" />
                        </div>
                        <Typography variant="h6">Projects</Typography>
                        <Typography variant="small" color="gray" className="mt-1">
                          Track ongoing projects and tasks
                        </Typography>
                      </Card>
                      <Card className="p-4 border border-gray-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate('/dashboard/analytics')}>
                        <div className="p-3 bg-purple-50 rounded-full mb-3">
                          <ChartBarIcon className="h-6 w-6 text-purple-500" />
                        </div>
                        <Typography variant="h6">Analytics</Typography>
                        <Typography variant="small" color="gray" className="mt-1">
                          View detailed performance metrics
                        </Typography>
                      </Card>
                      <Card className="p-4 border border-gray-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate('/dashboard/marketplace')}>
                        <div className="p-3 bg-amber-50 rounded-full mb-3">
                          <ShoppingBagIcon className="h-6 w-6 text-amber-500" />
                        </div>
                        <Typography variant="h6">Marketplace</Typography>
                        <Typography variant="small" color="gray" className="mt-1">
                          Browse available services and add-ons
                        </Typography>
                      </Card>
                    </div>
                  </div>
                ) : (
                  // User Dashboard Content
                  <UserDashboard />
                )} 
              </>
            )}

            {/* Analytics Dashboard */}
            {currentPage === 'analytics' && (
              <AnalyticsDashboard />
            )}

            {/* Projects Management */}
            {currentPage === 'projects' && (
              <ProjectManagement />
            )}

            {/* Users Table Section - Only shown in Admin view */}
            {currentPage === 'users' && isAdminView && (
                <UsersTable />
            )}
            
            {/* Guests Table Section - Only shown in Admin view */}
            {currentPage === 'guests' && isAdminView && (
              <GuestsTable />
            )}
            
            {/* Resources Section - Available to both roles */}
            {currentPage === 'resources' && (
              <Card className="border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <Typography variant="h5" color="blue-gray">
                      Resources
                    </Typography>
                    <Typography variant="small" color="gray">
                      Manage your files and documents
                    </Typography>
                  </div>
                </div>
                <div className="p-4">
                  <Resources />
                </div>
              </Card>
            )}

            {/* Profile Settings Section - Available to both roles */}
            {currentPage === 'profile' && (
              <Card className="border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <Typography variant="h5" color="blue-gray">
                      Profile Settings
                    </Typography>
                    <Typography variant="small" color="gray">
                      Manage your profile information
                    </Typography>
                  </div>
                </div>
                <div className="p-4">
                  <ProfileSettings />
                </div>
              </Card>
            )}

            {/* Knowledge Graph Integration */}
            {currentPage === 'knowledge' && (
              <KnowledgeGraphPage />
            )}

            {/* Real-Time Dashboard Integration */}
            {currentPage === 'realtime' && (
              <div className="space-y-6">
                <Card className="p-6 border border-gray-100 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <Typography variant="h3" color="blue-gray" className="mb-2">
                          Real-Time Analytics Dashboard
                        </Typography>
                        <Typography color="gray">
                          Monitor system performance and user activity in real-time
                        </Typography>
                      </div>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                </Card>
                <RealTimeDashboard />
              </div>
            )}
            
            {/* Marketplace Section - Available to both roles */}
            {currentPage === 'marketplace' && (
              <div className="space-y-6">
                <Card className="p-6 border border-gray-100 bg-gradient-to-r from-teal-600 to-blue-500 text-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <Typography variant="h3" className="mb-2">
                        AI Solution Marketplace
                      </Typography>
                      <Typography className="opacity-90 max-w-2xl">
                        Browse and purchase AI solutions to enhance your business capabilities. Integrate seamlessly with your existing systems.
                      </Typography>
                    </div>
                    <Button 
                      color="white" 
                      className="flex items-center gap-2 text-teal-800"
                      size="lg"
                    >
                      <ShoppingBagIcon className="h-4 w-4" /> 
                      Browse Solutions
                    </Button>
                  </div>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-teal-50 text-teal-500">
                          <SparklesIcon className="h-6 w-6" />
                        </div>
                        <Typography variant="h5">AI Chatbot Builder</Typography>
                      </div>
                      <div className="mb-4">
                        <Chip color="teal" value="Best Seller" className="mb-3" />
                        <Typography color="blue-gray" className="mb-3">
                          Build custom AI chatbots trained on your business data. Enhance customer support and automate common inquiries.
                        </Typography>
                        <Typography variant="h6" color="blue-gray" className="font-medium">
                          $249/month
                        </Typography>
                      </div>
                      <Button color="teal" fullWidth onClick={() => showNotification("AI Chatbot Builder added to your account!")}>
                        Add to Account
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-blue-50 text-blue-500">
                          <ChartBarIcon className="h-6 w-6" />
                        </div>
                        <Typography variant="h5">Predictive Analytics</Typography>
                      </div>
                      <div className="mb-4">
                        <Chip color="blue" value="Popular" className="mb-3" />
                        <Typography color="blue-gray" className="mb-3">
                          Leverage machine learning to predict business trends and customer behavior based on historical data.
                        </Typography>
                        <Typography variant="h6" color="blue-gray" className="font-medium">
                          $349/month
                        </Typography>
                      </div>
                      <Button color="blue" fullWidth onClick={() => showNotification("Predictive Analytics added to your account!")}>
                        Add to Account
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-purple-50 text-purple-500">
                          <CpuChipIcon className="h-6 w-6" />
                        </div>
                        <Typography variant="h5">Document Intelligence</Typography>
                      </div>
                      <div className="mb-4">
                        <Chip color="purple" value="New" className="mb-3" />
                        <Typography color="blue-gray" className="mb-3">
                          Automatically extract, classify, and process information from documents, forms, and receipts.
                        </Typography>
                        <Typography variant="h6" color="blue-gray" className="font-medium">
                          $199/month
                        </Typography>
                      </div>
                      <Button color="purple" fullWidth onClick={() => showNotification("Document Intelligence added to your account!")}>
                        Add to Account
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Logout Modal */}
      <Dialog
        open={isLogoutModalOpen}
        handler={handleCloseLogoutModal}
        size="xs"
        className="bg-white shadow-none z-[70]"
      >
        <DialogHeader>Confirm Logout</DialogHeader>
        <DialogBody>
          Are you sure you want to log out of your account?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={handleCloseLogoutModal}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red" onClick={handleConfirmLogout}>
            <span>Logout</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Toast notification */}
      {showToast.show && (
        <Alert
          open={showToast.show}
          color={showToast.color as colors}
          className="fixed top-20 right-4 z-50 max-w-md"
          icon={<CheckCircleIcon className="h-6 w-6" />}
          onClose={() => setShowToast({...showToast, show: false})}
        >
          {showToast.message}
        </Alert>
      )}

      {/* Support Modal */}
      <Dialog
        open={isSupportModalOpen}
        handler={() => setIsSupportModalOpen(false)}
        size="md"
      >
        <DialogHeader>Contact Support</DialogHeader>
        <DialogBody divider>
          <div className="space-y-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Support Category
              </Typography>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500">
                <option value="">Select category</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Priority
              </Typography>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Description
              </Typography>
              <Textarea label="Describe your issue" rows={4} />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsSupportModalOpen(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            color="purple"
            onClick={() => {
              setIsSupportModalOpen(false);
              showNotification("Support ticket submitted successfully!");
            }}
          >
            Submit Ticket
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Report Generation Modal */}
      <Dialog
        open={isReportModalOpen}
        handler={() => setIsReportModalOpen(false)}
        size="md"
      >
        <DialogHeader>Generate Report</DialogHeader>
        <DialogBody divider>
          <div className="space-y-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Report Type
              </Typography>
              <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500">
                <option value="">Select report type</option>
                <option value="performance">Performance Analysis</option>
                <option value="financial">Financial Summary</option>
                <option value="user">User Activity</option>
                <option value="custom">Custom Report</option>
              </select>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Date Range
              </Typography>
              <div className="grid grid-cols-2 gap-4">
                <Input type="date" label="Start Date" crossOrigin={undefined} />
                <Input type="date" label="End Date" crossOrigin={undefined} />
              </div>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Format
              </Typography>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="format" value="pdf" defaultChecked className="h-4 w-4" />
                  <span>PDF</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="format" value="excel" className="h-4 w-4" />
                  <span>Excel</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="format" value="csv" className="h-4 w-4" />
                  <span>CSV</span>
                </label>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsReportModalOpen(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            color="teal"
            onClick={() => {
              setIsReportModalOpen(false);
              showNotification("Report generation started! You'll be notified when it's ready.");
            }}
          >
            Generate Report
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Dashboard;