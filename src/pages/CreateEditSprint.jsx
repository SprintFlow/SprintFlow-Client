import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { Badge } from "./ui/badge";

interface CreateEditSprintProps {
  onBack: () => void;
}

export function CreateEditSprint({ onBack }: CreateEditSprintProps) {
  const teamMembers = [
    { id: 1, name: "Ana García", role: "Developer" },
    { id: 2, name: "Carlos López", role: "Developer" },
    { id: 3, name: "María Rodríguez", role: "Developer" },
    { id: 4, name: "Juan Martínez", role: "QA" },
  ];

  const userStories = [
    { id: 1, title: "Implementar login de usuarios", points: 8 },
    { id: 2, title: "Crear dashboard principal", points: 13 },
    { id: 3, title: "Integrar API de pagos", points: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1>Crear Nuevo Sprint</h1>
          <p className="text-muted-foreground mt-1">
            Define los parámetros y objetivos del sprint
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>Datos generales del sprint</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sprint-name">Nombre del Sprint</Label>
              <Input
                id="sprint-name"
                placeholder="Sprint 25"
                className="bg-input-background"
                defaultValue="Sprint 25"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Fecha Inicio</Label>
                <Input
                  id="start-date"
                  type="date"
                  className="bg-input-background"
                  defaultValue="2025-10-20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Fecha Fin</Label>
                <Input
                  id="end-date"
                  type="date"
                  className="bg-input-background"
                  defaultValue="2025-11-03"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="available-hours">Horas Disponibles</Label>
              <Input
                id="available-hours"
                type="number"
                placeholder="160"
                className="bg-input-background"
                defaultValue="160"
              />
              <p className="text-xs text-muted-foreground">
                Total de horas del equipo para este sprint
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sprint-goal">Objetivo del Sprint</Label>
              <Textarea
                id="sprint-goal"
                placeholder="Describe el objetivo principal..."
                className="bg-input-background min-h-[100px]"
                defaultValue="Completar el módulo de autenticación y comenzar con el dashboard principal"
              />
            </div>
          </CardContent>
        </Card>

        {/* Equipo Participante */}
        <Card>
          <CardHeader>
            <CardTitle>Equipo Participante</CardTitle>
            <CardDescription>Miembros asignados al sprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-input-background"
                >
                  <div>
                    <p>{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <Badge variant="outline">Asignado</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Añadir miembro
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historias de Usuario */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Historias de Usuario</CardTitle>
            <CardDescription>Backlog del sprint con puntuaciones</CardDescription>
          </div>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nueva historia
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userStories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell>US-{story.id}</TableCell>
                  <TableCell>{story.title}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      defaultValue={story.points}
                      className="w-20 bg-input-background"
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} className="text-right">
                  <strong>Total Puntos Planificados:</strong>
                </TableCell>
                <TableCell colSpan={2}>
                  <strong>26 puntos</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <Button variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Guardar Sprint
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
