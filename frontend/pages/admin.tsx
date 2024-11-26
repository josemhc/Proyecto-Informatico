import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import { SidebarComponent } from '@/components/Sidebar';
import jwt from 'jsonwebtoken';
import ProtectedRoute from '@/components/ProtectedRoute';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function Admin() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No estás autenticado. Redirigiendo al login.');
          window.location.href = '/dashboard';
          return;
        }
        const decodedToken: any = jwt.decode(token);
        if (decodedToken) {
          setUserId(decodedToken.id);
        }
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result: User[] = await response.json();
        setUsers(result);
        setFilteredUsers(result);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetchData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/role/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        toast.success('Rol actualizado exitosamente', { position: 'top-right' });
        setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
        setFilteredUsers(filteredUsers.map(user => user._id === userId ? { ...user, role: newRole } : user));
      } else {
        toast.error('Error al actualizar el rol', { position: 'top-right' });
      }
    } catch (error) {
      toast.error('Error al actualizar el rol', { position: 'top-right' });
    }
  };

  const handleSearch = () => {
    const filtered = users.filter(user => user.name.includes(searchTerm) || user.email.includes(searchTerm));
    setFilteredUsers(filtered.length > 0 ? filtered : users);
  };

  return (
    <ProtectedRoute allowedRoles={['Admin']} userId={userId}>
      <div className="rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen w-full">
        <SidebarComponent open={open} setOpen={setOpen} />
        <div className="flex-1 container p-4 ml-auto">
          <div className="mb-4 flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Buscar por nombre o email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar por nombre o email"
            />
            <Button onClick={handleSearch} style={{ cursor: 'pointer' }}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="Paciente">Paciente</option>
                      <option value="Medico">Medico</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ToastContainer />
        </div>
      </div>
    </ProtectedRoute>
  );
}