import React, { useContext, useState } from 'react';
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
  BeakerIcon
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
  Button
} from "@material-tailwind/react";
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
  { name: 'Guests', href: '/dashboard/guests', icon: HomeIcon },
  { name: 'Marketplace', href: '/dashboard/marketplace', icon: ShoppingBagIcon },
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

export function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

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
      "h-screen p-4 shadow-xl shadow-blue-gray-900/5",
      isSidebarCollapsed ? "w-20" : "w-full max-w-[20rem]"
    )}>
      <div className="mb-2 p-4 flex justify-end">
        <IconButton variant="text" color="teal" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
          {isSidebarCollapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
        </IconButton>
      </div>
      <List>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || currentPage === item.name.toLowerCase();
          return (
            <ListItem
              key={item.name}
              className={cn(
                "hover:bg-teal-50/80",
                isActive && "bg-teal-50/80 text-teal-500"
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <ListItemPrefix>
                <item.icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-teal-500" : "text-blue-gray-500"
                )} />
              </ListItemPrefix>
              {!isSidebarCollapsed && item.name}
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
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
            <div className="flex items-center gap-2">
              <BeakerIcon className="h-8 w-8 text-teal-500" />
              <Typography variant="h5" color="blue-gray">
                Theoforge
              </Typography>
            </div>
          </div>
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="teal">
                <UserCircleIcon className="h-6 w-6" />
              </IconButton>
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
      </Navbar>

      <Dialog
        size="xl"
        open={isSettingsOpen}
        handler={() => setIsSettingsOpen(false)}
        className="bg-white"
      >
        <DialogHeader className="text-teal-500">Account Settings</DialogHeader>
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
                  />
                  <Input
                    label="Last Name"
                    value={userData.lastName}
                    onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  />
                  <Input
                    label="Phone Number"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  />
                  <Input
                    label="Company"
                    value={userData.company}
                    onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                  />
                  <Input
                    label="Role"
                    value={userData.role}
                    onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                  />
                  <Input
                    label="Address"
                    value={userData.address}
                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                  />
                  <Input
                    label="City"
                    value={userData.city}
                    onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                  />
                  <Input
                    label="State"
                    value={userData.state}
                    onChange={(e) => setUserData({ ...userData, state: e.target.value })}
                  />
                  <Input
                    label="ZIP Code"
                    value={userData.zipCode}
                    onChange={(e) => setUserData({ ...userData, zipCode: e.target.value })}
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
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <CreditCardIcon className="h-8 w-8 text-blue-gray-500" />
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
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="h6">Enterprise Plan</Typography>
                        <Typography variant="small" color="gray">
                          $499/month • Renews on March 31, 2024
                        </Typography>
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

        <div className="flex-1 p-4">
          <Breadcrumbs className="bg-white rounded-lg p-3 mb-4">
            {breadcrumbs.map((breadcrumb, index) => (
              <a
                key={breadcrumb.href}
                href={breadcrumb.href}
                className={cn(
                  "opacity-60",
                  breadcrumb.current && "opacity-100 text-teal-500"
                )}
              >
                <span>{breadcrumb.name}</span>
              </a>
            ))}
          </Breadcrumbs>

          <div className="bg-white rounded-lg shadow-sm">
            {currentPage === 'dashboard' && (
              <div className="p-6">
                <Typography variant="h4" color="blue-gray">
                  Welcome to Dashboard
                </Typography>
                <Typography color="gray" className="mt-2">
                  Select a section from the sidebar to get started.
                </Typography>
              </div>
            )}
            {currentPage === 'users' && <UsersTable />}
            {currentPage === 'guests' && <GuestsTable />}
            {currentPage === 'marketplace' && (
              <div className="p-6">
                <Typography variant="h4" color="blue-gray">
                  Marketplace
                </Typography>
                <Typography color="gray" className="mt-2">
                  Coming soon...
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}