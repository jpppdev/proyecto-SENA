// Datos de demostración; sustituir por la respuesta del servicio cuando esté disponible.
export const indicators = [
  { label: "Órdenes activas", value: 12, change: "+20%", icon: "orders", tone: "orange", rising: true },
  { label: "Pendientes", value: 5, change: "-17%", icon: "pending", tone: "amber" },
  { label: "Agotados", value: 3, change: "+50%", icon: "inventory", tone: "red", rising: true },
  { label: "Por revisar", value: 8, change: "-11%", icon: "review", tone: "amber" },
];

export const recentOrders = [
  { id: 1024, table: 3, waiter: "Carlos Ruiz", status: "En preparación", time: "02:15 PM" },
  { id: 1023, table: 7, waiter: "Ana López", status: "Pendiente", time: "02:08 PM" },
  { id: 1022, table: 1, waiter: "Miguel Torres", status: "Servida", time: "01:55 PM" },
  { id: 1021, table: 5, waiter: "Sofía Ramírez", status: "En preparación", time: "01:48 PM" },
  { id: 1020, table: 8, waiter: "Luis Pérez", status: "Pendiente", time: "01:32 PM" },
];

export const alerts = [
  { title: "Stock bajo", description: "3 productos con inventario bajo", time: "Hace 12 min", icon: "inventory", tone: "red", to: "/dashboard/inventoryList" },
  { title: "Productos por revisar", description: "5 productos pendientes de revisión", time: "Hace 28 min", icon: "review", tone: "amber", to: "/dashboard/inventoryList" },
  { title: "Órdenes pendientes", description: "5 órdenes llevan más de 15 minutos", time: "Hace 42 min", icon: "pending", tone: "orange", to: "/dashboard/orderList" },
  { title: "Entrega de proveedor", description: "La entrega de Alimentos del Sur llega hoy", time: "Hace 1 hora", icon: "provider", tone: "purple", to: "/dashboard/providerList" },
];

export const quickActions = [
  { title: "Crear inventario", description: "Agregar y gestionar productos", icon: "inventory", to: "/dashboard/inventoryCreate" },
  { title: "Registrar proveedor", description: "Añadir nuevos proveedores", icon: "provider", to: "/dashboard/providerCreate" },
  { title: "Agregar platillo", description: "Crear un nuevo platillo en el menú", icon: "menu", to: "/dashboard/menuCreate" },
  { title: "Crear orden", description: "Registrar una nueva orden manual", icon: "orders", to: "/dashboard/orderCreate" },
  { title: "Gestionar usuarios", description: "Consultar y administrar usuarios", icon: "users", to: "/dashboard/userList" },
];
