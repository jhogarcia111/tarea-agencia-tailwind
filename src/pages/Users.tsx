import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { UserTable } from "@/components/users/UserTable";
import { UserForm } from "@/components/users/UserForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UserPlus } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getUsers, createUser, updateUser, deleteUser } from '@/services/userService';

export default function Users() {
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const isNewUserRoute = location.pathname === "/users/new";
  const isEditUserRoute = location.pathname.includes("/users/edit/");

  const openNewUserForm = () => {
    navigate("/users/new");
    setIsUserFormOpen(true);
  };

  const handleFormClose = () => {
    navigate("/users");
    setIsUserFormOpen(false);
  };

  const getUserById = (userId: number) => {
    // Replace this with the actual logic to fetch user data by ID
    return {
      id: userId,
      name: "John Doe",
      email: "johndoe@example.com",
      role: "User", // Default role
      isActive: true // Default active status
    };
  };

  const fetchUsers = async () => {
    try {
      const users = await getUsers();
      console.log('Fetched users:', users);
      // Update state with fetched users if needed
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const newUser = await createUser(userData);
      console.log('User created:', newUser);
      // Update state with the new user if needed
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      const updatedUser = await updateUser(id, userData);
      console.log('User updated:', updatedUser);
      // Update state with the updated user if needed
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      console.log('User deleted:', id);
      // Update state to remove the deleted user if needed
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:pl-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Usuarios</h1>
            <p className="text-muted-foreground mt-1">
              Gestione los usuarios de la agencia y sus permisos.
            </p>
          </div>
          <Button className="bg-brand-500 hover:bg-brand-600" onClick={openNewUserForm}>
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        {/* Main content */}
        {!isNewUserRoute && !isEditUserRoute && <UserTable />}

        {/* New user form */}
        {isNewUserRoute && (
          <Sheet open={true} onOpenChange={handleFormClose}>
            <SheetContent className="sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Nuevo Usuario</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <UserForm
                  editMode={false}
                  onCancel={handleFormClose}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Edit user form */}
        {isEditUserRoute && id && (
          <Sheet open={true} onOpenChange={handleFormClose}>
            <SheetContent className="sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Editar Usuario</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <UserForm
                  editMode={true}
                  onCancel={handleFormClose}
                  initialData={id ? getUserById(Number(id)) : undefined}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </MainLayout>
  );
}
