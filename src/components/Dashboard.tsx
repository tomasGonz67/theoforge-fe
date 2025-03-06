import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import {
  UsersIcon,
  HomeIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon as MenuIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  BeakerIcon,
  ChartBarIcon,
  BellIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowPathIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { UsersTable } from './UsersTable';
import { GuestsTable } from './GuestsTable';
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
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Input,
  Button,
  Progress,
  Avatar,
  Chip
} from "@material-tailwind/react";
import { cn } from '../lib/utils';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: ChartBarIcon,
    description: 'Overview of your activity'
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
    name: 'Marketplace', 
    href: '/dashboard/marketplace', 
    icon: ShoppingBagIcon,
    description: 'Browse available services'
  },
];

const TABS = [
  {
    label: "Personal Details",
    value: "personal",
    icon: UserCircleIcon,
  },
  {
    label: "Payments",
    value: "payments",
    icon: CreditCardIcon,
  },
  {
    label: "Subscriptions",
    value: "subscriptions",
    icon: BuildingLibraryIcon,
  },
];

// Mock data for dashboard metrics
const metrics = [
  { id: 1, name: 'Total Users', value: '1,204', change: '+12%', icon: UsersIcon, color: 'blue' },
  { id: 2, name: 'Active Guests', value: '423', change: '+5%', icon: HomeIcon, color: 'teal' },
  { id: 3, name: 'New Sign-ups', value: '48', change: '+18%', icon: UserCircleIcon, color: 'purple' },
  { id: 4, name: 'Marketplace Items', value: '152', change: '+7%', icon: ShoppingBagIcon, color: 'amber' }
];

// Mock data for recent activity
const recentActivity = [
  { id: 1, action: 'New user registered', user: 'Alex Johnson', time: '5 minutes ago', icon: UserCircleIcon },
  { id: 2, action: 'File uploaded', user: 'Maria Garcia', time: '1 hour ago', icon: ClipboardDocumentCheckIcon },
  { id: 3, action: 'Project updated', user: 'Sam Taylor', time: '3 hours ago', icon: ArrowPathIcon },
  { id: 4, action: 'Task completed', user: 'Robin Chen', time: '5 hours ago', icon: CheckCircleIcon },
  { id: 5, action: 'New comment added', user: 'Jamie Wilson', time: '1 day ago', icon: ChatBubbleLeftRightIcon }
];

export function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isVisible, setIsVisible] = useState(false);

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
    firstName: "Test",
    lastName: "User",
    email: "test@test.com",
    phone: "+1 (555) 123-4567",
    company: "Theoforge",
    role: "Administrator",
    address: "123 Main St",
    city: "Newark",
    state: "NJ",
    zipCode: "07102",
    country: "United States",
    timezone: "America/New_York",
    language: "English",
    notifications: true
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    const page = path.split('/').pop() || 'dashboard';
    setCurrentPage(page);
    navigate(path);
    setIsDrawerOpen(false); // Close drawer on navigation
  };

  const breadcrumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map((path, index, array) => ({
      name: path.charAt(0).toUpperCase() + path.slice(1),
      href: '/' + array.slice(0, index + 1).join('/'),
      current: index === array.length - 1,
    }));

  const Sidebar = () => (
    <Card className={cn(
      "h-screen p-4 shadow-xl shadow-blue-gray-900/5 relative overflow-hidden transition-all duration-300",
      isSidebarCollapsed ? "w-20" : "w-full max-w-[20rem]"
    )}>
      {/* Decorative elements similar to landing page */}
      <div className="absolute top-20 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-50 z-0"></div>
      <div className="absolute bottom-20 left-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 z-0"></div>
      
      <div className="mb-6 p-4 flex items-center justify-between relative z-10">
        <div className={cn("flex items-center gap-2 transition-opacity duration-300", 
                          isSidebarCollapsed ? "opacity-0" : "opacity-100")}>
          <img src="/logo.png" alt="Theoforge Logo" className="h-12 w-12" />
          <Typography variant="h5" color="blue-gray">
            Theoforge
          </Typography>
        </div>
        <IconButton 
          variant="text" 
          color="teal" 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="z-10"
        >
          {isSidebarCollapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
        </IconButton>
      </div>
      
      <div className="relative z-10">
        <List>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                            (item.href === '/dashboard' && location.pathname === '/dashboard') || 
                            (location.pathname.includes(item.href) && item.href !== '/dashboard');
            return (
              <ListItem
                key={item.name}
                className={cn(
                  "mb-2 hover:bg-teal-50/80 transition-all duration-200",
                  isActive && "bg-teal-50/80 text-teal-500 font-medium"
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
        </List>
        
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
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                Contact Support
              </Button>
            </Card>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar className="sticky top-0 z-10 max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between text-blue-gray-900">
          <div className="flex items-center gap-4">
            <IconButton
              variant="text"
              color="teal"
              className="lg:hidden"
              onClick={() => setIsDrawerOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </IconButton>
            <div className="flex items-center gap-2 lg:hidden">
              <img src="/logo.png" alt="Theoforge Logo" className="h-10 w-10" />
              <Typography variant="h5" color="blue-gray" className="font-medium">
                Theoforge
              </Typography>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <IconButton variant="text" color="blue-gray" className="relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-teal-500 flex items-center justify-center text-[10px] text-white">
                3
              </span>
            </IconButton>
            
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
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Cog6ToothIcon className="h-4 w-4 text-teal-500" />
                  <Typography variant="small" className="font-normal">
                    Account Settings
                  </Typography>
                </MenuItem>
                <MenuItem 
                  className="flex items-center gap-2 rounded hover:bg-red-50 text-red-500"
                  onClick={handleLogout}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <Typography variant="small" className="font-normal">
                    Sign Out
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </Navbar>

      <Dialog
        size="xl"
        open={isSettingsOpen}
        handler={() => setIsSettingsOpen(false)}
        className="bg-white"
      >
        <DialogHeader className="text-teal-500 border-b pb-4">
          <div className="flex items-center gap-3">
            <Cog6ToothIcon className="h-6 w-6" />
            Account Settings
          </div>
        </DialogHeader>
        <DialogBody className="overflow-y-auto">
          <Tabs value={activeTab} className="overflow-visible">
            <TabsHeader className="rounded-none border-b border-blue-gray-50 bg-transparent p-0">
              {TABS.map(({ label, value, icon: Icon }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => setActiveTab(value)}
                  className={cn(
                    "border-b-2 border-transparent py-4",
                    activeTab === value && "border-teal-500 text-teal-500"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {label}
                  </div>
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody>
              <TabPanel value="personal" className="p-0">
                <form className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="First Name"
                    value={userData.firstName}
                    onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                    className="!border-t-teal-500 focus:!border-t-teal-500"
                    labelProps={{
                      className: "!text-teal-500",
                    }}
                  />
                  <Input
                    label="Last Name"
                    value={userData.lastName}
                    onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                    className="!border-t-teal-500 focus:!border-t-teal-500"
                    labelProps={{
                      className: "!text-teal-500",
                    }}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="!border-t-teal-500 focus:!border-t-teal-500"
                    labelProps={{
                      className: "!text-teal-500",
                    }}
                  />
                  <Input
                    label="Phone Number"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="!border-t-teal-500 focus:!border-t-teal-500"
                    labelProps={{
                      className: "!text-teal-500",
                    }}
                  />
                  <Input
                    label="Company"
                    value={userData.company}
                    onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                    className="!border-t-teal-500 focus:!border-t-teal-500"
                    labelProps={{
                      className: "!text-teal-500",
                    }}
                  />
                  <Input
                    label="Role"
                    value={userData.role}
                    onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                    className="!border-t-teal-500 focus:!border-t-teal-500"
                    labelProps={{
                      className: "!text-teal-500",
                    }}
                  />
                  <Input
                    label="Address"
                    value={userData.address}
                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                    className="!border-t-teal-500 focus:!border-t-teal-500"
                    labelProps={{
                      className: "!text-teal-500",
                    }}
                  />
                  <Input
                    label="City"
                    value={userData.city}
                    onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                    className="!border-t-teal-500 focus:!border-t-teal-500"
                    labelProps={{
                      className: "!text-teal-500",
                    }}
                  />
                  <Input
                    label="State"
                    value={userData.state}
                    onChange={(e) => setUserData({ ...userData, state: e.target.value })}
                    className="!border-t-teal-500 focus:!border-t-teal-500"
                    labelProps={{
                      className: "!text-teal-500",
                    }}
                  />
                  <Input
                    label="ZIP Code"
                    value={userData.zipCode}
                    onChange={(e) => setUserData({ ...userData, zipCode: e.target.value })}
                    className="!border-t-teal-500 focus:!border-t-teal-500"
                    labelProps={{
                      className: "!text-teal-500",
                    }}
                  />
                  <div className="md:col-span-2 flex justify-end gap-4">
                    <Button variant="outlined" color="teal" onClick={() => setIsSettingsOpen(false)}>
                      Cancel
                    </Button>
                    <Button color="teal" onClick={() => setIsSettingsOpen(false)}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </TabPanel>
              <TabPanel value="payments" className="p-0">
                <div className="mt-8">
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    Payment Methods
                  </Typography>
                  <div className="space-y-4">
                    <Card className="p-4 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-10 w-16 rounded-md flex items-center justify-center text-white">
                            <CreditCardIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <Typography variant="h6">•••• •••• •••• 4242</Typography>
                            <Typography variant="small" color="gray">
                              Expires 12/24
                            </Typography>
                          </div>
                        </div>
                        <Button variant="text" color="teal">Edit</Button>
                      </div>
                    </Card>
                    <Button color="teal" variant="outlined" className="w-full">
                      Add New Payment Method
                    </Button>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="subscriptions" className="p-0">
                <div className="mt-8">
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    Active Subscriptions
                  </Typography>
                  <Card className="p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Typography variant="h6">Enterprise Plan</Typography>
                          <Chip size="sm" value="Active" color="teal" className="rounded-full" />
                        </div>
                        <Typography variant="small" color="gray">
                          $499/month • Renews on March 31, 2024
                        </Typography>
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <Typography variant="small">Usage: 65%</Typography>
                            <Typography variant="small" color="teal">8,450 / 13,000 credits</Typography>
                          </div>
                          <Progress value={65} color="teal" className="h-1" />
                        </div>
                      </div>
                      <Button variant="text" color="teal">Manage</Button>
                    </div>
                  </Card>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </DialogBody>
      </Dialog>

      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <Drawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          className="lg:hidden"
        >
          <Sidebar />
        </Drawer>

        <div className="flex-1 p-4 lg:p-6 max-w-full">
          <Breadcrumbs className="bg-white rounded-lg p-3 mb-4 border border-gray-100">
            {breadcrumbs.map((breadcrumb, index) => (
              <a
                key={breadcrumb.href}
                href={breadcrumb.href}
                className={cn(
                  "opacity-60",
                  breadcrumb.current && "opacity-100 text-teal-500 font-medium"
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
            {currentPage === 'dashboard' && (
              <div className="space-y-6">
                {/* Welcome Header */}
                <Card className="p-6 border border-gray-100 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-500 mb-4">
                          <SparklesIcon className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Dashboard Overview</span>
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

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {metrics.map((metric) => (
                    <Card key={metric.id} className="p-4 border border-gray-100 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <Typography variant="small" color="gray" className="mb-2">
                            {metric.name}
                          </Typography>
                          <Typography variant="h4">
                            {metric.value}
                          </Typography>
                          <div className="flex items-center mt-1">
                            <Typography variant="small" color="teal" className="font-medium">
                              {metric.change}
                            </Typography>
                            <Typography variant="small" color="gray" className="ml-1">
                              vs. last month
                            </Typography>
                          </div>
                        </div>
                        <div 
                          className={`p-2 rounded-lg bg-${metric.color}-50 text-${metric.color}-500`}
                        >
                          <metric.icon className="h-6 w-6" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Recent Activity & Tasks */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Recent Activity */}
                  <Card className="lg:col-span-3 border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                      <Typography variant="h6" color="blue-gray">
                        Recent Activity
                      </Typography>
                    </div>
                    <List>
                      {recentActivity.map((activity) => (
                        <ListItem 
                          key={activity.id}
                          className="py-3 px-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-teal-50">
                              <activity.icon className="h-5 w-5 text-teal-500" />
                            </div>
                            <div className="flex-grow">
                              <Typography variant="small" className="font-medium">
                                {activity.action}
                              </Typography>
                              <Typography variant="small" color="gray">
                                {activity.user}
                              </Typography>
                            </div>
                            <Typography variant="small" color="gray">
                              {activity.time}
                            </Typography>
                          </div>
                        </ListItem>
                      ))}
                    </List>
                    <div className="px-6 py-3 border-t border-gray-100 text-center">
                      <Button variant="text" color="teal" size="sm">
                        View All Activity
                      </Button>
                    </div>
                  </Card>


                </div>
              </div>
            )}

            {/* Users Table Section */}
            {currentPage === 'users' && (
              <Card className="border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <Typography variant="h5" color="blue-gray">
                      Users Management
                    </Typography>
                    <Typography variant="small" color="gray">
                      Manage your system users and their permissions
                    </Typography>
                  </div>
                  <Button 
                    color="teal" 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    <UsersIcon className="h-4 w-4" /> Add User
                  </Button>
                </div>
                <UsersTable />
              </Card>
            )}
            
            {/* Guests Table Section */}
            {currentPage === 'guests' && (
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
                  >
                    <HomeIcon className="h-4 w-4" /> Add Guest
                  </Button>
                </div>
                <GuestsTable />
              </Card>
            )}
            
            {/* Marketplace Section */}
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
                
                <div className="text-center py-12">
                  <SparklesIcon className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                  <Typography variant="h4" color="blue-gray" className="mb-2">
                    Marketplace Coming Soon
                  </Typography>
                  <Typography color="gray" className="max-w-md mx-auto">
                    We're working hard to bring you a comprehensive marketplace of AI solutions. Check back soon for updates!
                  </Typography>
                  <Button color="teal" className="mt-6">
                    Get Notified
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}