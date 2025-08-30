
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useData } from "@/context/DataContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Settings() {
  const { getSettings, updateSettings } = useData();
  const [settings, setSettings] = useState({
    agency_name: '',
    email: '',
    website: '',
    phone: '',
    address: '',
    theme_color: '#6366f1',
    timezone: 'America/Mexico_City',
    language: 'es'
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar configuración al montar el componente
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Error al cargar la configuración');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [getSettings]);

  // Manejar cambios en los campos
  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Guardar configuración
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await updateSettings(settings);
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6 md:pl-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando configuración...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 md:pl-16">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground mt-1">
            Administre la configuración de su cuenta y preferencias de la aplicación.
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="permissions">Permisos</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Agencia</CardTitle>
                <CardDescription>
                  Actualice la información general de la agencia.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="agency-name">Nombre de la Agencia</Label>
                  <Input
                    id="agency-name"
                    value={settings.agency_name}
                    onChange={(e) => handleInputChange('agency_name', e.target.value)}
                    placeholder="Nombre de la Agencia"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="agency-email">Correo Electrónico</Label>
                  <Input
                    id="agency-email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Correo electrónico de contacto"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="agency-website">Sitio Web</Label>
                  <Input
                    id="agency-website"
                    value={settings.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="URL del sitio web"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="agency-phone">Teléfono</Label>
                  <Input
                    id="agency-phone"
                    value={settings.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Número de teléfono"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="agency-address">Dirección</Label>
                  <Input
                    id="agency-address"
                    value={settings.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Dirección de la agencia"
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button 
                  className="bg-brand-500 hover:bg-brand-600"
                  onClick={handleSaveSettings}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración Regional</CardTitle>
                <CardDescription>
                  Configure sus preferencias regionales.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={settings.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Seleccione un idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Seleccione una zona horaria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Mexico_City">
                        América/México (GMT-6)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        América/Nueva York (GMT-5)
                      </SelectItem>
                      <SelectItem value="Europe/Madrid">
                        Europa/Madrid (GMT+1)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Europa/Londres (GMT)
                      </SelectItem>
                      <SelectItem value="Asia/Tokyo">
                        Asia/Tokio (GMT+9)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="theme-color">Color del Tema</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="theme-color"
                      type="color"
                      value={settings.theme_color}
                      onChange={(e) => handleInputChange('theme_color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.theme_color}
                      onChange={(e) => handleInputChange('theme_color', e.target.value)}
                      placeholder="#6366f1"
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button 
                  className="bg-brand-500 hover:bg-brand-600"
                  onClick={handleSaveSettings}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Roles y Permisos</CardTitle>
                <CardDescription>
                  Configure los permisos para cada rol de usuario.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Administrador</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Acceso completo a todas las funciones del sistema.
                  </p>
                  <div className="grid gap-4">
                    <PermissionItem
                      label="Gestionar usuarios"
                      defaultChecked={true}
                      disabled={true}
                    />
                    <PermissionItem
                      label="Gestionar clientes"
                      defaultChecked={true}
                      disabled={true}
                    />
                    <PermissionItem
                      label="Gestionar tareas"
                      defaultChecked={true}
                      disabled={true}
                    />
                    <PermissionItem
                      label="Configuración avanzada"
                      defaultChecked={true}
                      disabled={true}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="text-lg font-medium">Gestor</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Acceso a gestión de clientes y tareas.
                  </p>
                  <div className="grid gap-4">
                    <PermissionItem
                      label="Gestionar usuarios"
                      defaultChecked={false}
                    />
                    <PermissionItem
                      label="Gestionar clientes"
                      defaultChecked={true}
                    />
                    <PermissionItem
                      label="Gestionar tareas"
                      defaultChecked={true}
                    />
                    <PermissionItem
                      label="Configuración avanzada"
                      defaultChecked={false}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="text-lg font-medium">Miembro del Equipo</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Acceso limitado a tareas asignadas.
                  </p>
                  <div className="grid gap-4">
                    <PermissionItem
                      label="Ver usuarios"
                      defaultChecked={true}
                    />
                    <PermissionItem
                      label="Ver clientes"
                      defaultChecked={true}
                    />
                    <PermissionItem
                      label="Gestionar tareas propias"
                      defaultChecked={true}
                    />
                    <PermissionItem
                      label="Configuración personal"
                      defaultChecked={true}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button className="bg-brand-500 hover:bg-brand-600">
                  Guardar Cambios
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>
                  Configure las notificaciones que desea recibir.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Notificaciones por Correo</h3>
                  <div className="grid gap-4 mt-2">
                    <PermissionItem
                      label="Tareas asignadas"
                      defaultChecked={true}
                    />
                    <PermissionItem
                      label="Fechas límite próximas"
                      defaultChecked={true}
                    />
                    <PermissionItem
                      label="Nuevos comentarios"
                      defaultChecked={true}
                    />
                    <PermissionItem
                      label="Cambios en tareas"
                      defaultChecked={false}
                    />
                    <PermissionItem
                      label="Resumen semanal"
                      defaultChecked={true}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="text-lg font-medium">Notificaciones en la Aplicación</h3>
                  <div className="grid gap-4 mt-2">
                    <PermissionItem
                      label="Tareas asignadas"
                      defaultChecked={true}
                    />
                    <PermissionItem
                      label="Fechas límite próximas"
                      defaultChecked={true}
                    />
                    <PermissionItem
                      label="Nuevos comentarios"
                      defaultChecked={true}
                    />
                    <PermissionItem
                      label="Cambios en tareas"
                      defaultChecked={true}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button className="bg-brand-500 hover:bg-brand-600">
                  Guardar Cambios
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración Avanzada</CardTitle>
                <CardDescription>
                  Opciones avanzadas de configuración.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cache">Limpiar Caché</Label>
                    <p className="text-sm text-muted-foreground">
                      Limpiar el caché de la aplicación
                    </p>
                  </div>
                  <Button variant="outline">Limpiar</Button>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-export">Exportar Datos</Label>
                    <p className="text-sm text-muted-foreground">
                      Exportar todos los datos en formato CSV
                    </p>
                  </div>
                  <Button variant="outline">Exportar</Button>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-red-500">Eliminar Cuenta</Label>
                    <p className="text-sm text-muted-foreground">
                      Esta acción no se puede deshacer
                    </p>
                  </div>
                  <Button variant="destructive">Eliminar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

interface PermissionItemProps {
  label: string;
  defaultChecked: boolean;
  disabled?: boolean;
}

function PermissionItem({
  label,
  defaultChecked,
  disabled = false,
}: PermissionItemProps) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={`permission-${label}`} className="cursor-pointer">
        {label}
      </Label>
      <Switch
        id={`permission-${label}`}
        defaultChecked={defaultChecked}
        disabled={disabled}
      />
    </div>
  );
}
