import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowLeft, Plus, Trash2, Save, Users, Target, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";

interface SprintSetupProps {
  onBack: () => void;
}

export function SprintSetup({ onBack }: SprintSetupProps) {
  const teamMembers = [
    { id: 1, name: "Ana García", role: "Frontend Developer", availability: "100%" },
    { id: 2, name: "Carlos López", role: "Backend Developer", availability: "100%" },
    { id: 3, name: "María Rodríguez", role: "Full Stack", availability: "80%" },
    { id: 4, name: "Juan Martínez", role: "QA Engineer", availability: "100%" },
  ];

  const backlogItems = [
    { id: 1, title: "Sistema de autenticación de usuarios", points: 8, priority: "Alta" },
    { id: 2, title: "Panel de control principal", points: 13, priority: "Media" },
    { id: 3, title: "Integración con servicio de pagos", points: 5, priority: "Alta" },
  ];

  const totalPoints = backlogItems.reduce((sum, item) => sum + item.points, 0);

  return (
    <div className="space-y-8 p-4">
      {/* Header Section */}
      <div className="flex items-start gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Regresar
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Configurar Sprint</h1>
          <p className="text-sm text-gray-500 mt-1">
            Establece la configuración y objetivos para el próximo ciclo de trabajo
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sprint Details */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <CardTitle>Detalles del Sprint</CardTitle>
            </div>
            <CardDescription>Información fundamental del ciclo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="sprint-title" className="text-sm font-medium">
                  Título del Sprint
                </Label>
                <Input
                  id="sprint-title"
                  placeholder="Ej: Sprint Q4-2025"
                  className="border-gray-300 focus:border-blue-500"
                  defaultValue="Sprint Q4-2025"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="capacity" className="text-sm font-medium">
                  Capacidad (horas)
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="180"
                  className="border-gray-300 focus:border-blue-500"
                  defaultValue="180"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Label className="text-sm font-medium">Período del Sprint</Label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  type="date"
                  className="border-gray-300 focus:border-blue-500"
                  defaultValue="2025-10-20"
                />
                <Input
                  type="date"
                  className="border-gray-300 focus:border-blue-500"
                  defaultValue="2025-11-03"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="focus" className="text-sm font-medium">
                Enfoque Principal
              </Label>
              <Textarea
                id="focus"
                placeholder="¿Qué se espera lograr en este sprint?"
                className="border-gray-300 focus:border-blue-500 min-h-[120px] resize-none"
                defaultValue="Desarrollar e implementar el sistema de autenticación seguro y comenzar con la estructura base del dashboard administrativo."
              />
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <CardTitle>Asignación de Equipo</CardTitle>
            </div>
            <CardDescription>Recursos asignados al sprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{member.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{member.role}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {member.availability}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full gap-2 border-dashed">
                <Plus className="h-4 w-4" />
                Agregar Recurso
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backlog Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Elementos del Backlog</CardTitle>
            <CardDescription>Tareas y historias asignadas al sprint</CardDescription>
          </div>
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Tarea
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Elemento</TableHead>
                  <TableHead className="font-semibold">Descripción</TableHead>
                  <TableHead className="font-semibold">Prioridad</TableHead>
                  <TableHead className="font-semibold">Estimación</TableHead>
                  <TableHead className="font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backlogItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-mono text-sm">TASK-{item.id}</TableCell>
                    <TableCell className="max-w-md">{item.title}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.priority === "Alta" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        defaultValue={item.points}
                        className="w-16 border-gray-300 text-center"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="hover:bg-red-50">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                <TableRow className="bg-gray-50 font-semibold">
                  <TableCell colSpan={3} className="text-right">
                    Total Estimado:
                  </TableCell>
                  <TableCell className="text-blue-600">
                    {totalPoints} puntos
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={onBack}>
              Descartar
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                Guardar Borrador
              </Button>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4" />
                Crear Sprint
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}