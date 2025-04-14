
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

export default function Settings() {
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
                    defaultValue="Mi Agencia de Marketing"
                    placeholder="Nombre de la Agencia"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="agency-email">Correo Electrónico</Label>
                  <Input
                    id="agency-email"
                    type="email"
                    defaultValue="contacto@miagencia.com"
                    placeholder="Correo electrónico de contacto"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="agency-website">Sitio Web</Label>
                  <Input
                    id="agency-website"
                    defaultValue="https://miagencia.com"
                    placeholder="URL del sitio web"
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button className="bg-brand-500 hover:bg-brand-600">
                  Guardar Cambios
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
                  <Select defaultValue="es">
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
                  <Select defaultValue="europe-madrid">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Seleccione una zona horaria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe-madrid">
                        Europa/Madrid (GMT+1)
                      </SelectItem>
                      <SelectItem value="europe-london">
                        Europa/Londres (GMT)
                      </SelectItem>
                      <SelectItem value="america-new_york">
                        América/Nueva York (GMT-5)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date-format">Formato de Fecha</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Seleccione un formato de fecha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button className="bg-brand-500 hover:bg-brand-600">
                  Guardar Cambios
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
