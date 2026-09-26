export const copy = {
  en: {
    appName: "The Launch Era Cleaning App",
    today: "Today",
    leads: "Leads",
    clients: "Clients",
    calendar: "Calendar",
    quotes: "Quotes",
    invoices: "Invoices",
    services: "Services",
    team: "Team",
    reports: "Reports",
    settings: "Settings",
    route: "Today's Route",
    mileage: "Mileage",
    timeTracking: "Time tracking",
  },
  es: {
    appName: "The Launch Era Cleaning App",
    today: "Hoy",
    leads: "Leads",
    clients: "Clientes",
    calendar: "Calendario",
    quotes: "Cotizaciones",
    invoices: "Facturas",
    services: "Servicios",
    team: "Equipo",
    reports: "Reportes",
    settings: "Configuración",
    route: "Ruta de hoy",
    mileage: "Millas",
    timeTracking: "Control de tiempo",
  }
} as const;

export type Language = keyof typeof copy;
