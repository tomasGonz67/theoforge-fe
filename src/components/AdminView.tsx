import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  IconButton,
  Input
} from '@material-tailwind/react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { cn } from '../lib/utils';

export function AdminView() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Simulating API call with mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock stats data
      setStats({
        totalUsers: 3,
        activeUsers: 2,
        newUsersToday: 0,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Typography variant="h4" color="blue-gray" className="mb-2">
        Admin Control Panel
      </Typography>
      <Typography color="gray" className="mb-6">
        Manage your application users, settings, and permissions
      </Typography>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <Typography color="teal" className="text-sm font-medium">Total Users</Typography>
          <Typography variant="h4">{stats.totalUsers}</Typography>
        </Card>
        
        <Card className="p-4">
          <Typography color="teal" className="text-sm font-medium">Active Users</Typography>
          <Typography variant="h4">{stats.activeUsers}</Typography>
        </Card>
        
        <Card className="p-4">
          <Typography color="teal" className="text-sm font-medium">New Users Today</Typography>
          <Typography variant="h4">{stats.newUsersToday}</Typography>
        </Card>
      </div>
      
      {/* Additional admin features can be added here */}
      <Card className="w-full p-4">
        <CardHeader floated={false} shadow={false} className="rounded-none p-4">
          <Typography variant="h5" color="blue-gray">
            System Settings
          </Typography>
        </CardHeader>
        
        <CardBody>
          <Typography color="gray" className="mb-4">
            Configure your application settings and preferences
          </Typography>
          
          <div className="space-y-4">
            <Card className="p-4 border border-blue-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <Typography variant="h6" color="blue-gray">
                    Maintenance Mode
                  </Typography>
                  <Typography variant="small" color="gray">
                    Enable maintenance mode to temporarily restrict access to the application
                  </Typography>
                </div>
                <Button variant="outlined" color="teal" size="sm">
                  Configure
                </Button>
              </div>
            </Card>
            
            <Card className="p-4 border border-blue-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <Typography variant="h6" color="blue-gray">
                    System Backup
                  </Typography>
                  <Typography variant="small" color="gray">
                    Configure automatic backups and restore points
                  </Typography>
                </div>
                <Button variant="outlined" color="teal" size="sm">
                  Configure
                </Button>
              </div>
            </Card>
            
            <Card className="p-4 border border-blue-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <Typography variant="h6" color="blue-gray">
                    API Settings
                  </Typography>
                  <Typography variant="small" color="gray">
                    Manage API keys and access permissions
                  </Typography>
                </div>
                <Button variant="outlined" color="teal" size="sm">
                  Configure
                </Button>
              </div>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}