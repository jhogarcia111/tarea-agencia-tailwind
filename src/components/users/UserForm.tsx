import React, { useState } from 'react';
import { createUser, updateUser } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFormData {
  id?: string;
  name?: string;
  email?: string;
  password?: string; // Added password field
  role?: string;
}

export function UserForm({ editMode = false, initialData = {} as UserFormData, onCancel }: { editMode?: boolean; initialData?: UserFormData; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    password: '', // Added password field
    role: initialData.role || 'User',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateUser(initialData.id, formData);
        console.log('User updated successfully:', formData);
      } else {
        await createUser(formData);
        console.log('User created successfully:', formData);
      }
      onCancel();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <Input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Role</label>
        <Select value={formData.role} onValueChange={handleRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Administrador">Administrador</SelectItem>
            <SelectItem value="User">User</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{editMode ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
}
