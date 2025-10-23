import React from "react";
// import { Footer } from "../components/Footer";
// import { NavBar } from "../components/Navbar";
// import { AdminDashboard } from "../pages/AdminDashboard";
// import { UserDashboard } from "../pages/UserDashboard";
// import { CreateEditSprint } from "../pages/CreateEditSprint";

export default function AdminDashboard() {
  const NavigationFor = (role) => (
    <Navigation
      currentView="dashboard"
      onNavigate={() => {}}
      onLogout={() => {}}
      role={role}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-[1200px] mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-3 mb-12">
          <h1 className="text-3xl font-semibold">SprintFlow</h1>
          <p className="text-muted-foreground">Wireframes y mockups para la gestión de sprints</p>
        </header>

        {/* Screen: Login */}
        <ScreenFrame title="Login" description="Acceso al sistema">
          <div className="scale-95 origin-top">
            <LoginPage onLogin={() => {}} />
          </div>
        </ScreenFrame>

        {/* Screen: Admin Dashboard */}
        <ScreenFrame title="Admin Dashboard" description="Vista general (Admin)">
          <div className="bg-background min-h-screen">
            {NavigationFor("admin")}
            <div className="container mx-auto px-6 py-8">
              <AdminDashboard onCreateSprint={() => {}} onViewSprint={() => {}} />
            </div>
          </div>
        </ScreenFrame>

        {/* Screen: Create / Edit Sprint */}
        <ScreenFrame title="Crear / Editar Sprint" description="Formulario para sprints">
          <div className="bg-background min-h-screen">
            {NavigationFor("admin")}
            <div className="container mx-auto px-6 py-8">
              <CreateEditSprint onBack={() => {}} />
            </div>
          </div>
        </ScreenFrame>

        {/* Screen: User Dashboard */}
        <ScreenFrame title="User Dashboard" description="Vista personal del desarrollador">
          <div className="bg-background min-h-screen">
            {NavigationFor("user")}
            <div className="container mx-auto px-6 py-8">
              <UserDashboard onViewResults={() => {}} />
            </div>
          </div>
        </ScreenFrame>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground">
          SprintFlow © {new Date().getFullYear()} Cohispania
        </footer>
      </div>
    </div>
  );
}

function ScreenFrame({ title, description, children }) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-medium">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <div className="border-2 border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-slate-950">
        {children}
      </div>
    </section>
  );
}
