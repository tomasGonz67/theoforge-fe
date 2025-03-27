// src/components/UsersTable.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardBody,
  Typography,
  Spinner,
} from "@material-tailwind/react";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  nickname: string;
  role: string;
}

export const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken'); // :white_check_mark: Ensure token is stored on login
      if (!token) {
        console.error('No access token found.');
        setUsers([]);
        setLoading(false);
        return;
      }

      const response = await axios.get('https://dev.theoforge.com/API/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Fetched Users:', response.data); // Should log an array of users
      setUsers(response.data || []); // :white_check_mark: Your API returns a list, not { users: [] }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(); // Fetch on component mount
  }, []);
return (
    <Card className="mt-6 shadow-lg border border-gray-200">
      <CardBody>
        <Typography variant="h4" className="mb-6">Users</Typography>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner color="teal" className="h-10 w-10" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-6 border-b">Email</th>
                  <th className="py-3 px-6 border-b">First Name</th>
                  <th className="py-3 px-6 border-b">Last Name</th>
                  <th className="py-3 px-6 border-b">Nickname</th>
                  <th className="py-3 px-6 border-b">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-3 px-6 border-b">{user.email}</td>
                      <td className="py-3 px-6 border-b">{user.first_name}</td>
                      <td className="py-3 px-6 border-b">{user.last_name}</td>
                      <td className="py-3 px-6 border-b">{user.nickname}</td>
                      <td className="py-3 px-6 border-b">{user.role}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default UsersTable;