// In-memory database for demo mode
// This allows users to interact with the app without persistent changes

import dbSchema from "../context-db.json";

// Define record types for each table
interface PatientRecord {
  patient_id: number;
  name: string;
  email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

interface MedicineRecord {
  medicine_id: number;
  name: string;
  description?: string;
  price: number;
  unit?: string;
  expiry_date?: string;
  manufacturer?: string;
  created_at: string;
  updated_at: string;
}

interface InventoryRecord {
  inventory_id: number;
  medicine_id: number;
  quantity: number;
  location?: string;
  last_updated: string;
}

interface OrderRecord {
  order_id: number;
  patient_id: number;
  supplier_id: number;
  employee_id: number;
  order_date: string;
  created_at: string;
}

interface OrderItemRecord {
  order_id: number;
  medicine_id: number;
  quantity: number;
}

interface SupplierRecord {
  supplier_id: number;
  name: string;
  email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

interface EmployeeRecord {
  employee_id: number;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface MedicalLogRecord {
  log_id: number;
  patient_id: number;
  medicine_id: number;
  log_date: string;
  dosage: string;
  notes?: string;
  created_at: string;
}

// Define the database schema type
interface StaffAccountRecord {
  username: string;
  password: string;
  employee_id: number;
  created_at: string;
  updated_at: string;
}

interface MemoryDatabaseSchema {
  Patient: PatientRecord[];
  Medicine: MedicineRecord[];
  Inventory: InventoryRecord[];
  Orders: OrderRecord[];
  OrderItems: OrderItemRecord[];
  Supplier: SupplierRecord[];
  Employee: EmployeeRecord[];
  MedicalLogs: MedicalLogRecord[];
  StaffAccount: StaffAccountRecord[];
  [key: string]: any[]; // Allow indexing by string for dynamic access
}

// Share demo state across route bundles and development hot reloads.
const demoRuntime = globalThis as typeof globalThis & {
  medinvDemoDatabase?: MemoryDatabaseSchema;
};
const memoryDatabase: MemoryDatabaseSchema = demoRuntime.medinvDemoDatabase ?? {
  Patient: [],
  Medicine: [],
  Inventory: [],
  Orders: [],
  OrderItems: [],
  Supplier: [],
  Employee: [],
  MedicalLogs: [],
  StaffAccount: [],
  // Add missing tables from schema to avoid errors
  DrugCategory: [],
  medicinecategories: [],
  Billing: [],
  EmployeeAccounts: [],
  Prescription: [],
  PrescriptionItem: [],
  Order: [], // Alias for Orders if needed, or separate
  OrderItem: [], // Alias for OrderItems
  ExpiryAlert: [],
  Discount: [],
  Feedback: [],
  MedicalLog: [], // Alias for MedicalLogs
  ActivityLog: [],
  AnalyticsData: [],
  Settings: [],
  BillingItem: [],
  PatientMedication: [],
  PatientAppointment: [],
  InventoryLog: [],
  StockAlert: [],
  SupplierContact: [],
  PaymentTransaction: [],
  Insurance: [],
  DashboardWidget: [],
  NotificationSettings: [],
  Notification: [],
  Report: [],
  ApiKey: [],
};

// Pre-populated data
const seedDemoData = () => {
  // Pre-populated staff accounts for login
  memoryDatabase.StaffAccount = [
    {
      username: "admin",
      password: "admin123",
      employee_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      username: "nurse",
      password: "nurse123",
      employee_id: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      username: "pharmacist",
      password: "pharm123",
      employee_id: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      username: "dr_stone",
      password: "password123",
      employee_id: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      username: "admin_james",
      password: "password123",
      employee_id: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      username: "nurse_linda",
      password: "password123",
      employee_id: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      username: "pharm_robert",
      password: "password123",
      employee_id: 7,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      username: "receptionist",
      password: "password123",
      employee_id: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Pre-populated patients
  memoryDatabase.Patient = [
    {
      patient_id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone_number: "1234567890",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone_number: "9876543210",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 3,
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone_number: "9876543211",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 4,
      name: "Emily Davis",
      email: "emily.d@example.com",
      phone_number: "5551234567",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 5,
      name: "Michael Brown",
      email: "m.brown@example.com",
      phone_number: "5559876543",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 6,
      name: "Sarah Connor",
      email: "sarah.c@example.com",
      phone_number: "5551112233",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 7,
      name: "Robert Wilson",
      email: "r.wilson@example.com",
      phone_number: "5554445566",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 8,
      name: "Lisa Taylor",
      email: "lisa.t@example.com",
      phone_number: "5557778899",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 9,
      name: "James Anderson",
      email: "j.anderson@example.com",
      phone_number: "5550001122",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 10,
      name: "Jennifer Thomas",
      email: "j.thomas@example.com",
      phone_number: "5553334455",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 11,
      name: "William Jackson",
      email: "w.jackson@example.com",
      phone_number: "5556667788",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 12,
      name: "Elizabeth White",
      email: "e.white@example.com",
      phone_number: "5559990011",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 13,
      name: "David Harris",
      email: "d.harris@example.com",
      phone_number: "5552223344",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 14,
      name: "Patricia Martin",
      email: "p.martin@example.com",
      phone_number: "5555556677",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      patient_id: 15,
      name: "Richard Thompson",
      email: "r.thompson@example.com",
      phone_number: "5558889900",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Pre-populated suppliers
  memoryDatabase.Supplier = [
    {
      supplier_id: 1,
      name: "MediSupply Inc.",
      email: "contact@medisupply.com",
      phone_number: "1122334455",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      supplier_id: 2,
      name: "PharmaWholesale",
      email: "info@pharmawholesale.com",
      phone_number: "5566778899",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      supplier_id: 3,
      name: "Global Health Distributors",
      email: "sales@globalhealth.com",
      phone_number: "9988776655",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      supplier_id: 4,
      name: "Apex Pharmaceuticals",
      email: "orders@apexpharma.com",
      phone_number: "5551239876",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      supplier_id: 5,
      name: "BioLife Solutions",
      email: "support@biolife.com",
      phone_number: "5559871234",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      supplier_id: 6,
      name: "CarePlus Supplies",
      email: "sales@careplus.com",
      phone_number: "5554567890",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      supplier_id: 7,
      name: "DirectMeds",
      email: "contact@directmeds.com",
      phone_number: "5557890123",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      supplier_id: 8,
      name: "Elite Medical",
      email: "info@elitemedical.com",
      phone_number: "5552345678",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Pre-populated employees
  memoryDatabase.Employee = [
    {
      employee_id: 1,
      name: "Dr. Mike Johnson",
      email: "mike.johnson@hospital.com",
      phone_number: "1231231234",
      role: "Doctor",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      employee_id: 2,
      name: "Nurse Sarah Williams",
      email: "sarah.williams@hospital.com",
      phone_number: "4564564567",
      role: "Nurse",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      employee_id: 3,
      name: "David Chen",
      email: "david.chen@hospital.com",
      phone_number: "7897897890",
      role: "Pharmacist",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      employee_id: 4,
      name: "Dr. Emily Stone",
      email: "emily.stone@hospital.com",
      phone_number: "5551112222",
      role: "Doctor",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      employee_id: 5,
      name: "James Wilson",
      email: "james.wilson@hospital.com",
      phone_number: "5553334444",
      role: "Administrator",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      employee_id: 6,
      name: "Linda Martinez",
      email: "linda.martinez@hospital.com",
      phone_number: "5555556666",
      role: "Nurse",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      employee_id: 7,
      name: "Robert Taylor",
      email: "robert.taylor@hospital.com",
      phone_number: "5557778888",
      role: "Pharmacist",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      employee_id: 8,
      name: "Susan Clark",
      email: "susan.clark@hospital.com",
      phone_number: "5559990000",
      role: "Receptionist",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Pre-populated medicines
  memoryDatabase.Medicine = [
    {
      medicine_id: 1,
      name: "Paracetamol",
      description: "Pain reliever and fever reducer",
      price: 9.99,
      unit: "bottle",
      expiry_date: "2025-12-31",
      manufacturer: "MediCorp",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 2,
      name: "Amoxicillin",
      description: "Antibiotic medication",
      price: 19.99,
      unit: "pack",
      expiry_date: "2025-06-30",
      manufacturer: "PharmaCorp",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 3,
      name: "Loratadine",
      description: "Antihistamine for allergies",
      price: 15.5,
      unit: "box",
      expiry_date: "2026-01-15",
      manufacturer: "AllergyMeds Inc.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 4,
      name: "Ibuprofen",
      description: "Nonsteroidal anti-inflammatory drug",
      price: 12.99,
      unit: "bottle",
      expiry_date: "2025-11-20",
      manufacturer: "MediCorp",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 5,
      name: "Metformin",
      description: "Diabetes medication",
      price: 25.0,
      unit: "pack",
      expiry_date: "2026-03-10",
      manufacturer: "DiabetCare",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 6,
      name: "Atorvastatin",
      description: "Cholesterol lowering medication",
      price: 30.0,
      unit: "pack",
      expiry_date: "2025-09-15",
      manufacturer: "HeartHealth",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 7,
      name: "Lisinopril",
      description: "High blood pressure medication",
      price: 22.5,
      unit: "pack",
      expiry_date: "2026-05-20",
      manufacturer: "CardioPharma",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 8,
      name: "Omeprazole",
      description: "Acid reflux medication",
      price: 18.75,
      unit: "box",
      expiry_date: "2025-10-05",
      manufacturer: "GastroMeds",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 9,
      name: "Levothyroxine",
      description: "Thyroid hormone replacement",
      price: 28.0,
      unit: "bottle",
      expiry_date: "2026-02-28",
      manufacturer: "ThyroCare",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 10,
      name: "Amlodipine",
      description: "Calcium channel blocker",
      price: 14.99,
      unit: "pack",
      expiry_date: "2025-08-12",
      manufacturer: "HeartHealth",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 11,
      name: "Metoprolol",
      description: "Beta blocker",
      price: 16.5,
      unit: "bottle",
      expiry_date: "2025-12-10",
      manufacturer: "CardioPharma",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 12,
      name: "Albuterol",
      description: "Bronchodilator inhaler",
      price: 45.0,
      unit: "inhaler",
      expiry_date: "2026-04-15",
      manufacturer: "RespiraTech",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 13,
      name: "Gabapentin",
      description: "Nerve pain medication",
      price: 35.0,
      unit: "bottle",
      expiry_date: "2025-11-30",
      manufacturer: "NeuroMeds",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 14,
      name: "Sertraline",
      description: "Antidepressant",
      price: 40.0,
      unit: "bottle",
      expiry_date: "2026-06-20",
      manufacturer: "MindCare",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      medicine_id: 15,
      name: "Hydrochlorothiazide",
      description: "Diuretic",
      price: 11.5,
      unit: "bottle",
      expiry_date: "2025-07-25",
      manufacturer: "MediCorp",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Pre-populated inventory
  memoryDatabase.Inventory = [
    {
      inventory_id: 1,
      medicine_id: 1,
      quantity: 100,
      location: "Shelf A1",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 2,
      medicine_id: 2,
      quantity: 50,
      location: "Shelf B2",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 3,
      medicine_id: 3,
      quantity: 75,
      location: "Shelf C3",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 4,
      medicine_id: 4,
      quantity: 120,
      location: "Shelf A2",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 5,
      medicine_id: 5,
      quantity: 200,
      location: "Shelf D1",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 6,
      medicine_id: 6,
      quantity: 150,
      location: "Shelf D2",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 7,
      medicine_id: 7,
      quantity: 80,
      location: "Shelf E1",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 8,
      medicine_id: 8,
      quantity: 60,
      location: "Shelf E2",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 9,
      medicine_id: 9,
      quantity: 90,
      location: "Shelf F1",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 10,
      medicine_id: 10,
      quantity: 110,
      location: "Shelf F2",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 11,
      medicine_id: 11,
      quantity: 70,
      location: "Shelf G1",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 12,
      medicine_id: 12,
      quantity: 40,
      location: "Shelf G2",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 13,
      medicine_id: 13,
      quantity: 55,
      location: "Shelf H1",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 14,
      medicine_id: 14,
      quantity: 65,
      location: "Shelf H2",
      last_updated: new Date().toISOString(),
    },
    {
      inventory_id: 15,
      medicine_id: 15,
      quantity: 130,
      location: "Shelf I1",
      last_updated: new Date().toISOString(),
    },
  ];

  // Pre-populated orders - Expanded for Analytics
  const today = new Date();
  const months = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(today);
    d.setMonth(today.getMonth() - i);
    months.push(d.toISOString().slice(0, 7)); // YYYY-MM
  }

  memoryDatabase.Orders = [
    // Recent orders (Current Month)
    {
      order_id: 1,
      patient_id: 1,
      supplier_id: 1,
      employee_id: 1,
      order_date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
    },
    {
      order_id: 2,
      patient_id: 2,
      supplier_id: 2,
      employee_id: 2,
      order_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
    },
    {
      order_id: 3,
      patient_id: 3,
      supplier_id: 1,
      employee_id: 3,
      order_date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
    },
    {
      order_id: 4,
      patient_id: 4,
      supplier_id: 3,
      employee_id: 1,
      order_date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
    },

    // Last Month
    {
      order_id: 5,
      patient_id: 5,
      supplier_id: 2,
      employee_id: 2,
      order_date: `${months[1]}-15`,
      created_at: new Date().toISOString(),
    },
    {
      order_id: 6,
      patient_id: 1,
      supplier_id: 1,
      employee_id: 3,
      order_date: `${months[1]}-20`,
      created_at: new Date().toISOString(),
    },
    {
      order_id: 7,
      patient_id: 2,
      supplier_id: 3,
      employee_id: 1,
      order_date: `${months[1]}-25`,
      created_at: new Date().toISOString(),
    },

    // 2 Months Ago
    {
      order_id: 8,
      patient_id: 3,
      supplier_id: 1,
      employee_id: 2,
      order_date: `${months[2]}-10`,
      created_at: new Date().toISOString(),
    },
    {
      order_id: 9,
      patient_id: 4,
      supplier_id: 2,
      employee_id: 3,
      order_date: `${months[2]}-15`,
      created_at: new Date().toISOString(),
    },
    {
      order_id: 10,
      patient_id: 5,
      supplier_id: 3,
      employee_id: 1,
      order_date: `${months[2]}-22`,
      created_at: new Date().toISOString(),
    },

    // 3 Months Ago
    {
      order_id: 11,
      patient_id: 1,
      supplier_id: 1,
      employee_id: 2,
      order_date: `${months[3]}-05`,
      created_at: new Date().toISOString(),
    },
    {
      order_id: 12,
      patient_id: 2,
      supplier_id: 2,
      employee_id: 3,
      order_date: `${months[3]}-12`,
      created_at: new Date().toISOString(),
    },
    {
      order_id: 13,
      patient_id: 3,
      supplier_id: 3,
      employee_id: 1,
      order_date: `${months[3]}-18`,
      created_at: new Date().toISOString(),
    },

    // 4 Months Ago
    {
      order_id: 14,
      patient_id: 4,
      supplier_id: 1,
      employee_id: 2,
      order_date: `${months[4]}-08`,
      created_at: new Date().toISOString(),
    },
    {
      order_id: 15,
      patient_id: 5,
      supplier_id: 2,
      employee_id: 3,
      order_date: `${months[4]}-16`,
      created_at: new Date().toISOString(),
    },
    {
      order_id: 16,
      patient_id: 1,
      supplier_id: 3,
      employee_id: 1,
      order_date: `${months[4]}-24`,
      created_at: new Date().toISOString(),
    },

    // 5 Months Ago
    {
      order_id: 17,
      patient_id: 2,
      supplier_id: 1,
      employee_id: 2,
      order_date: `${months[5]}-03`,
      created_at: new Date().toISOString(),
    },
    {
      order_id: 18,
      patient_id: 3,
      supplier_id: 2,
      employee_id: 3,
      order_date: `${months[5]}-14`,
      created_at: new Date().toISOString(),
    },
    {
      order_id: 19,
      patient_id: 4,
      supplier_id: 3,
      employee_id: 1,
      order_date: `${months[5]}-21`,
      created_at: new Date().toISOString(),
    },
    {
      order_id: 20,
      patient_id: 5,
      supplier_id: 1,
      employee_id: 2,
      order_date: `${months[5]}-28`,
      created_at: new Date().toISOString(),
    },
  ];

  // Pre-populated order items - Expanded for Analytics
  memoryDatabase.OrderItems = [
    // Order 1
    { order_id: 1, medicine_id: 1, quantity: 2 },
    { order_id: 1, medicine_id: 4, quantity: 1 },
    // Order 2
    { order_id: 2, medicine_id: 2, quantity: 1 },
    // Order 3
    { order_id: 3, medicine_id: 5, quantity: 3 },
    // Order 4
    { order_id: 4, medicine_id: 3, quantity: 2 },
    { order_id: 4, medicine_id: 6, quantity: 1 },

    // Order 5
    { order_id: 5, medicine_id: 1, quantity: 5 },
    { order_id: 5, medicine_id: 2, quantity: 2 },
    // Order 6
    { order_id: 6, medicine_id: 4, quantity: 3 },
    // Order 7
    { order_id: 7, medicine_id: 5, quantity: 4 },
    { order_id: 7, medicine_id: 6, quantity: 2 },

    // Order 8
    { order_id: 8, medicine_id: 1, quantity: 3 },
    { order_id: 8, medicine_id: 3, quantity: 2 },
    // Order 9
    { order_id: 9, medicine_id: 2, quantity: 4 },
    // Order 10
    { order_id: 10, medicine_id: 4, quantity: 2 },
    { order_id: 10, medicine_id: 5, quantity: 1 },

    // Order 11
    { order_id: 11, medicine_id: 6, quantity: 3 },
    // Order 12
    { order_id: 12, medicine_id: 1, quantity: 4 },
    { order_id: 12, medicine_id: 2, quantity: 2 },
    // Order 13
    { order_id: 13, medicine_id: 3, quantity: 3 },

    // Order 14
    { order_id: 14, medicine_id: 4, quantity: 5 },
    // Order 15
    { order_id: 15, medicine_id: 5, quantity: 2 },
    { order_id: 15, medicine_id: 6, quantity: 1 },
    // Order 16
    { order_id: 16, medicine_id: 1, quantity: 6 },

    // Order 17
    { order_id: 17, medicine_id: 2, quantity: 3 },
    // Order 18
    { order_id: 18, medicine_id: 3, quantity: 4 },
    // Order 19
    { order_id: 19, medicine_id: 4, quantity: 2 },
    { order_id: 19, medicine_id: 5, quantity: 3 },
    // Order 20
    { order_id: 20, medicine_id: 6, quantity: 2 },
    { order_id: 20, medicine_id: 1, quantity: 3 },
  ];

  // Pre-populated medical logs
  memoryDatabase.MedicalLogs = [
    {
      log_id: 1,
      patient_id: 1,
      medicine_id: 1,
      log_date: "2025-05-15",
      dosage: "1 tablet every 6 hours",
      notes: "Patient reported headache relief after first dose",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 2,
      patient_id: 2,
      medicine_id: 2,
      log_date: "2025-05-16",
      dosage: "1 capsule twice daily",
      notes: "Treating respiratory infection",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 3,
      patient_id: 3,
      medicine_id: 5,
      log_date: "2025-05-20",
      dosage: "500mg with meals",
      notes: "Routine checkup for diabetes management",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 4,
      patient_id: 4,
      medicine_id: 3,
      log_date: "2025-05-22",
      dosage: "10mg daily",
      notes: "Seasonal allergy symptoms improving",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 5,
      patient_id: 5,
      medicine_id: 6,
      log_date: "2025-05-25",
      dosage: "20mg at night",
      notes: "Cholesterol levels monitoring required",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 6,
      patient_id: 1,
      medicine_id: 4,
      log_date: "2025-06-01",
      dosage: "400mg as needed",
      notes: "For joint pain",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 7,
      patient_id: 6,
      medicine_id: 7,
      log_date: "2025-06-02",
      dosage: "10mg daily",
      notes: "Blood pressure stable",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 8,
      patient_id: 7,
      medicine_id: 8,
      log_date: "2025-06-03",
      dosage: "20mg before breakfast",
      notes: "Acid reflux symptoms controlled",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 9,
      patient_id: 8,
      medicine_id: 9,
      log_date: "2025-06-04",
      dosage: "50mcg daily",
      notes: "TSH levels normal",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 10,
      patient_id: 9,
      medicine_id: 10,
      log_date: "2025-06-05",
      dosage: "5mg daily",
      notes: "Monitor for ankle swelling",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 11,
      patient_id: 10,
      medicine_id: 11,
      log_date: "2025-06-06",
      dosage: "25mg twice daily",
      notes: "Heart rate controlled",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 12,
      patient_id: 11,
      medicine_id: 12,
      log_date: "2025-06-07",
      dosage: "2 puffs every 4 hours prn",
      notes: "Asthma exacerbation",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 13,
      patient_id: 12,
      medicine_id: 13,
      log_date: "2025-06-08",
      dosage: "300mg at night",
      notes: "Neuropathic pain management",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 14,
      patient_id: 13,
      medicine_id: 14,
      log_date: "2025-06-09",
      dosage: "50mg daily",
      notes: "Mood improved",
      created_at: new Date().toISOString(),
    },
    {
      log_id: 15,
      patient_id: 14,
      medicine_id: 15,
      log_date: "2025-06-10",
      dosage: "12.5mg daily",
      notes: "Blood pressure check required",
      created_at: new Date().toISOString(),
    },
  ];

  // Pre-populated prescriptions
  memoryDatabase.Prescription = [
    {
      prescription_id: 1,
      patient_id: 1,
      employee_id: 1,
      date: "2025-05-15",
      notes: "Take with food",
    },
    {
      prescription_id: 2,
      patient_id: 2,
      employee_id: 1,
      date: "2025-05-16",
      notes: "Complete full course",
    },
    {
      prescription_id: 3,
      patient_id: 3,
      employee_id: 1,
      date: "2025-05-20",
      notes: "Monitor blood sugar levels",
    },
    {
      prescription_id: 4,
      patient_id: 4,
      employee_id: 4,
      date: "2025-05-22",
      notes: "Avoid driving if drowsy",
    },
    {
      prescription_id: 5,
      patient_id: 5,
      employee_id: 1,
      date: "2025-05-25",
      notes: "Low fat diet recommended",
    },
    {
      prescription_id: 6,
      patient_id: 6,
      employee_id: 4,
      date: "2025-06-01",
      notes: "Regular BP checks",
    },
    {
      prescription_id: 7,
      patient_id: 7,
      employee_id: 1,
      date: "2025-06-02",
      notes: "Take on empty stomach",
    },
    {
      prescription_id: 8,
      patient_id: 8,
      employee_id: 4,
      date: "2025-06-03",
      notes: "Take in the morning",
    },
    {
      prescription_id: 9,
      patient_id: 9,
      employee_id: 1,
      date: "2025-06-04",
      notes: "Do not skip doses",
    },
    {
      prescription_id: 10,
      patient_id: 10,
      employee_id: 4,
      date: "2025-06-05",
      notes: "Report side effects",
    },
    {
      prescription_id: 11,
      patient_id: 11,
      employee_id: 1,
      date: "2025-06-06",
      notes: "Follow asthma action plan",
    },
    {
      prescription_id: 12,
      patient_id: 12,
      employee_id: 4,
      date: "2025-06-07",
      notes: "Taper dose as instructed",
    },
    {
      prescription_id: 13,
      patient_id: 13,
      employee_id: 1,
      date: "2025-06-08",
      notes: "May cause dizziness",
    },
    {
      prescription_id: 14,
      patient_id: 14,
      employee_id: 4,
      date: "2025-06-09",
      notes: "Take with plenty of water",
    },
    {
      prescription_id: 15,
      patient_id: 15,
      employee_id: 1,
      date: "2025-06-10",
      notes: "Review in 2 weeks",
    },
  ];

  // Pre-populated prescription items
  memoryDatabase.PrescriptionItem = [
    {
      item_id: 1,
      prescription_id: 1,
      medicine_id: 1,
      dosage: "500mg",
      frequency: "Every 6 hours",
      duration: "5 days",
    },
    {
      item_id: 2,
      prescription_id: 2,
      medicine_id: 2,
      dosage: "250mg",
      frequency: "Twice daily",
      duration: "7 days",
    },
    {
      item_id: 3,
      prescription_id: 3,
      medicine_id: 5,
      dosage: "500mg",
      frequency: "Once daily",
      duration: "30 days",
    },
    {
      item_id: 4,
      prescription_id: 4,
      medicine_id: 3,
      dosage: "10mg",
      frequency: "Once daily",
      duration: "14 days",
    },
    {
      item_id: 5,
      prescription_id: 5,
      medicine_id: 6,
      dosage: "20mg",
      frequency: "Once daily",
      duration: "30 days",
    },
    {
      item_id: 6,
      prescription_id: 6,
      medicine_id: 7,
      dosage: "10mg",
      frequency: "Once daily",
      duration: "30 days",
    },
    {
      item_id: 7,
      prescription_id: 7,
      medicine_id: 8,
      dosage: "20mg",
      frequency: "Once daily",
      duration: "14 days",
    },
    {
      item_id: 8,
      prescription_id: 8,
      medicine_id: 9,
      dosage: "50mcg",
      frequency: "Once daily",
      duration: "90 days",
    },
    {
      item_id: 9,
      prescription_id: 9,
      medicine_id: 10,
      dosage: "5mg",
      frequency: "Once daily",
      duration: "30 days",
    },
    {
      item_id: 10,
      prescription_id: 10,
      medicine_id: 11,
      dosage: "25mg",
      frequency: "Twice daily",
      duration: "30 days",
    },
    {
      item_id: 11,
      prescription_id: 11,
      medicine_id: 12,
      dosage: "2 puffs",
      frequency: "Every 4 hours",
      duration: "As needed",
    },
    {
      item_id: 12,
      prescription_id: 12,
      medicine_id: 13,
      dosage: "300mg",
      frequency: "Once daily",
      duration: "30 days",
    },
    {
      item_id: 13,
      prescription_id: 13,
      medicine_id: 14,
      dosage: "50mg",
      frequency: "Once daily",
      duration: "30 days",
    },
    {
      item_id: 14,
      prescription_id: 14,
      medicine_id: 15,
      dosage: "12.5mg",
      frequency: "Once daily",
      duration: "30 days",
    },
    {
      item_id: 15,
      prescription_id: 15,
      medicine_id: 1,
      dosage: "500mg",
      frequency: "Every 8 hours",
      duration: "3 days",
    },
  ];

  // Pre-populated billing
  memoryDatabase.Billing = [
    {
      billing_id: 1,
      patient_id: 1,
      date: "2025-05-15",
      amount: 32.97,
      status: "Paid",
    },
    {
      billing_id: 2,
      patient_id: 2,
      date: "2025-05-16",
      amount: 19.99,
      status: "Pending",
    },
    {
      billing_id: 3,
      patient_id: 3,
      date: "2025-05-20",
      amount: 75.0,
      status: "Paid",
    },
    {
      billing_id: 4,
      patient_id: 4,
      date: "2025-05-22",
      amount: 45.5,
      status: "Paid",
    },
    {
      billing_id: 5,
      patient_id: 5,
      date: "2025-05-25",
      amount: 120.0,
      status: "Overdue",
    },
    {
      billing_id: 6,
      patient_id: 6,
      date: "2025-06-01",
      amount: 55.0,
      status: "Paid",
    },
    {
      billing_id: 7,
      patient_id: 7,
      date: "2025-06-02",
      amount: 30.0,
      status: "Pending",
    },
    {
      billing_id: 8,
      patient_id: 8,
      date: "2025-06-03",
      amount: 85.0,
      status: "Paid",
    },
    {
      billing_id: 9,
      patient_id: 9,
      date: "2025-06-04",
      amount: 40.0,
      status: "Paid",
    },
    {
      billing_id: 10,
      patient_id: 10,
      date: "2025-06-05",
      amount: 60.0,
      status: "Pending",
    },
    {
      billing_id: 11,
      patient_id: 11,
      date: "2025-06-06",
      amount: 95.0,
      status: "Paid",
    },
    {
      billing_id: 12,
      patient_id: 12,
      date: "2025-06-07",
      amount: 25.0,
      status: "Paid",
    },
    {
      billing_id: 13,
      patient_id: 13,
      date: "2025-06-08",
      amount: 110.0,
      status: "Overdue",
    },
    {
      billing_id: 14,
      patient_id: 14,
      date: "2025-06-09",
      amount: 70.0,
      status: "Paid",
    },
    {
      billing_id: 15,
      patient_id: 15,
      date: "2025-06-10",
      amount: 50.0,
      status: "Pending",
    },
  ];

  // Pre-populated activity logs - Expanded for Recent Activity
  memoryDatabase.ActivityLog = [
    {
      id: 1,
      action: "LOGIN",
      details: "User admin logged in",
      type: "AUTH",
      timestamp: new Date().toISOString(),
      user_name: "admin",
    },
    {
      id: 2,
      action: "CREATE_ORDER",
      details: "Created Order #21 for Patient John Doe",
      type: "ORDER",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      user_name: "admin",
    },
    {
      id: 3,
      action: "UPDATE_INVENTORY",
      details: "Updated stock for Paracetamol (+50 units)",
      type: "INVENTORY",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      user_name: "pharmacist",
    },
    {
      id: 4,
      action: "LOGIN",
      details: "User pharmacist logged in",
      type: "AUTH",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      user_name: "pharmacist",
    },
    {
      id: 5,
      action: "CREATE_PRESCRIPTION",
      details: "Created prescription for Jane Smith",
      type: "CLINICAL",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      user_name: "Dr. Mike Johnson",
    },
    {
      id: 6,
      action: "UPDATE_PATIENT",
      details: "Updated contact info for Rajesh Kumar",
      type: "ADMIN",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      user_name: "admin",
    },
    {
      id: 7,
      action: "LOGIN",
      details: "User nurse logged in",
      type: "AUTH",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      user_name: "nurse",
    },
    {
      id: 8,
      action: "ADD_MEDICINE",
      details: "Added new medicine: Lisinopril",
      type: "INVENTORY",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      user_name: "pharmacist",
    },
    {
      id: 9,
      action: "CREATE_ORDER",
      details: "Created Order #20 for Patient Emily Davis",
      type: "ORDER",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      user_name: "admin",
    },
    {
      id: 10,
      action: "UPDATE_INVENTORY",
      details: "Stock adjustment for Amoxicillin (-10 units)",
      type: "INVENTORY",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      user_name: "pharmacist",
    },
    {
      id: 11,
      action: "LOGIN",
      details: "User admin logged in",
      type: "AUTH",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      user_name: "admin",
    },
    {
      id: 12,
      action: "CREATE_PRESCRIPTION",
      details: "Created prescription for Michael Brown",
      type: "CLINICAL",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      user_name: "Dr. Mike Johnson",
    },
    {
      id: 13,
      action: "UPDATE_SUPPLIER",
      details: "Updated details for MediSupply Inc.",
      type: "ADMIN",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
      user_name: "admin",
    },
    {
      id: 14,
      action: "LOGIN",
      details: "User Dr. Mike Johnson logged in",
      type: "AUTH",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
      user_name: "Dr. Mike Johnson",
    },
    {
      id: 15,
      action: "CREATE_ORDER",
      details: "Created Order #19 for Patient Rajesh Kumar",
      type: "ORDER",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      user_name: "admin",
    },
    {
      id: 16,
      action: "UPDATE_INVENTORY",
      details: "Received shipment from Global Health",
      type: "INVENTORY",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 75).toISOString(),
      user_name: "pharmacist",
    },
    {
      id: 17,
      action: "LOGIN",
      details: "User pharmacist logged in",
      type: "AUTH",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 76).toISOString(),
      user_name: "pharmacist",
    },
    {
      id: 18,
      action: "ADD_PATIENT",
      details: "Registered new patient: Sarah Connor",
      type: "ADMIN",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      user_name: "nurse",
    },
    {
      id: 19,
      action: "CREATE_PRESCRIPTION",
      details: "Created prescription for Emily Davis",
      type: "CLINICAL",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(),
      user_name: "Dr. Mike Johnson",
    },
    {
      id: 20,
      action: "LOGIN",
      details: "User admin logged in",
      type: "AUTH",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
      user_name: "admin",
    },
  ];

  // Alias mapping for compatibility
  memoryDatabase.Order = memoryDatabase.Orders;
  memoryDatabase.OrderItem = memoryDatabase.OrderItems;
  memoryDatabase.MedicalLog = memoryDatabase.MedicalLogs;

  // Pre-populated drug categories
  memoryDatabase.DrugCategory = [
    {
      category_id: 1,
      drug_category_id: 1,
      name: "Analgesics",
      drug_category_name: "Analgesics",
      description: "Pain relievers",
      common_uses: "Pain relief, fever reduction",
    },
    {
      category_id: 2,
      drug_category_id: 2,
      name: "Antibiotics",
      drug_category_name: "Antibiotics",
      description: "Treat bacterial infections",
      common_uses: "Bacterial infections",
    },
    {
      category_id: 3,
      drug_category_id: 3,
      name: "Antihistamines",
      drug_category_name: "Antihistamines",
      description: "Treat allergies",
      common_uses: "Allergies, hay fever",
    },
    {
      category_id: 4,
      drug_category_id: 4,
      name: "Antidiabetics",
      drug_category_name: "Antidiabetics",
      description: "Treat diabetes",
      common_uses: "Type 2 Diabetes management",
    },
    {
      category_id: 5,
      drug_category_id: 5,
      name: "Cardiovascular",
      drug_category_name: "Cardiovascular",
      description: "Heart and blood vessel medications",
      common_uses: "Hypertension, heart failure",
    },
    {
      category_id: 6,
      drug_category_id: 6,
      name: "Antidepressants",
      drug_category_name: "Antidepressants",
      description: "Treat depression",
      common_uses: "Depression, anxiety disorders",
    },
    {
      category_id: 7,
      drug_category_id: 7,
      name: "Antacids",
      drug_category_name: "Antacids",
      description: "Neutralize stomach acid",
      common_uses: "Heartburn, indigestion",
    },
    {
      category_id: 8,
      drug_category_id: 8,
      name: "Bronchodilators",
      drug_category_name: "Bronchodilators",
      description: "Open airways",
      common_uses: "Asthma, COPD",
    },
    {
      category_id: 9,
      drug_category_id: 9,
      name: "Diuretics",
      drug_category_name: "Diuretics",
      description: "Increase urine production",
      common_uses: "Hypertension, edema",
    },
    {
      category_id: 10,
      drug_category_id: 10,
      name: "Antivirals",
      drug_category_name: "Antivirals",
      description: "Treat viral infections",
      common_uses: "Flu, Herpes, HIV",
    },
  ];
  memoryDatabase.medicinecategories = memoryDatabase.DrugCategory;

  // Pre-populated feedback
  memoryDatabase.Feedback = [
    {
      feedback_id: 1,
      user_id: 1,
      message: "Great system, very easy to use!",
      rating: 5,
      created_at: new Date().toISOString(),
    },
    {
      feedback_id: 2,
      user_id: 2,
      message: "Would like to see more detailed reports.",
      rating: 4,
      created_at: new Date().toISOString(),
    },
    {
      feedback_id: 3,
      user_id: 3,
      message: "Inventory tracking is accurate.",
      rating: 5,
      created_at: new Date().toISOString(),
    },
    {
      feedback_id: 4,
      user_id: 4,
      message: "Sometimes loads slowly on mobile.",
      rating: 3,
      created_at: new Date().toISOString(),
    },
    {
      feedback_id: 5,
      user_id: 5,
      message: "Excellent support from the IT team.",
      rating: 5,
      created_at: new Date().toISOString(),
    },
    {
      feedback_id: 6,
      user_id: 1,
      message: "The new dashboard layout is intuitive.",
      rating: 4,
      created_at: new Date().toISOString(),
    },
    {
      feedback_id: 7,
      user_id: 2,
      message: "Need more filter options in orders.",
      rating: 3,
      created_at: new Date().toISOString(),
    },
    {
      feedback_id: 8,
      user_id: 3,
      message: "Billing process is smooth.",
      rating: 5,
      created_at: new Date().toISOString(),
    },
  ];

  // Pre-populated expiry alerts
  memoryDatabase.ExpiryAlert = [
    {
      alert_id: 1,
      medicine_id: 2,
      alert_date: "2025-06-01",
      message: "Amoxicillin expiring soon",
      status: "Active",
    },
    {
      alert_id: 2,
      medicine_id: 6,
      alert_date: "2025-08-15",
      message: "Atorvastatin expiring in 30 days",
      status: "Active",
    },
    {
      alert_id: 3,
      medicine_id: 8,
      alert_date: "2025-10-05",
      message: "Omeprazole expiring in 3 months",
      status: "Active",
    },
    {
      alert_id: 4,
      medicine_id: 15,
      alert_date: "2025-07-25",
      message: "Hydrochlorothiazide expiring soon",
      status: "Active",
    },
  ];

  // Pre-populated discounts
  memoryDatabase.Discount = [
    {
      discount_id: 1,
      code: "SUMMER10",
      name: "Summer Sale",
      description: "10% off on all items",
      percentage: 10,
      start_date: "2025-06-01",
      end_date: "2025-08-31",
      valid_until: "2025-08-31",
      status: "Active",
    },
    {
      discount_id: 2,
      code: "SENIOR20",
      name: "Senior Citizen Discount",
      description: "20% off for seniors",
      percentage: 20,
      start_date: "2025-01-01",
      end_date: "2025-12-31",
      valid_until: "2025-12-31",
      status: "Active",
    },
    {
      discount_id: 3,
      code: "WELCOME5",
      name: "New Patient Discount",
      description: "5% off first order",
      percentage: 5,
      start_date: "2025-01-01",
      end_date: "2025-12-31",
      valid_until: "2025-12-31",
      status: "Active",
    },
    {
      discount_id: 4,
      code: "BULK15",
      name: "Bulk Purchase",
      description: "15% off orders over $100",
      percentage: 15,
      start_date: "2025-01-01",
      end_date: "2025-12-31",
      valid_until: "2025-12-31",
      status: "Active",
    },
    {
      discount_id: 5,
      code: "EXPIRED",
      name: "Winter Sale",
      description: "Winter clearance",
      percentage: 25,
      start_date: "2024-12-01",
      end_date: "2025-02-28",
      valid_until: "2025-02-28",
      status: "Expired",
    },
  ];

  // Pre-populated analytics data
  memoryDatabase.AnalyticsData = [
    {
      data_id: 1,
      data_type: "daily_sales",
      data_value: JSON.stringify({ date: "2025-05-15", total: 1500.5 }),
      timestamp: new Date().toISOString(),
    },
    {
      data_id: 2,
      data_type: "patient_visits",
      data_value: JSON.stringify({ date: "2025-05-15", count: 45 }),
      timestamp: new Date().toISOString(),
    },
  ];

  // Pre-populated settings
  memoryDatabase.Settings = [
    {
      setting_id: 1,
      setting_name: "theme",
      setting_value: "dark",
      setting_group: "appearance",
    },
    {
      setting_id: 2,
      setting_name: "currency",
      setting_value: "USD",
      setting_group: "general",
    },
  ];

  // Pre-populated billing items
  memoryDatabase.BillingItem = [
    {
      item_id: 1,
      billing_id: 1,
      description: "Consultation Fee",
      quantity: 1,
      unit_price: 50.0,
      total_price: 50.0,
    },
    {
      item_id: 2,
      billing_id: 1,
      description: "Paracetamol",
      quantity: 2,
      unit_price: 9.99,
      total_price: 19.98,
    },
  ];

  // Pre-populated patient medications
  memoryDatabase.PatientMedication = [
    {
      medication_id: 1,
      patient_id: 1,
      medicine_id: 1,
      start_date: "2025-01-01",
      end_date: "2025-12-31",
      dosage: "500mg",
      notes: "Take with food",
    },
  ];

  // Pre-populated patient appointments
  memoryDatabase.PatientAppointment = [
    {
      appointment_id: 1,
      patient_id: 1,
      employee_id: 1,
      appointment_date: "2025-06-01T10:00:00Z",
      purpose: "General Checkup",
      status: "Scheduled",
    },
    {
      appointment_id: 2,
      patient_id: 2,
      employee_id: 1,
      appointment_date: "2025-06-02T14:00:00Z",
      purpose: "Follow-up",
      status: "Scheduled",
    },
  ];

  // Pre-populated inventory logs
  memoryDatabase.InventoryLog = [
    {
      log_id: 1,
      inventory_number: 1,
      action: "RESTOCK",
      quantity_change: 50,
      timestamp: new Date().toISOString(),
      employee_id: 1,
      notes: "Monthly restock",
    },
  ];

  // Pre-populated stock alerts
  memoryDatabase.StockAlert = [
    {
      alert_id: 1,
      medicine_id: 2,
      threshold: 20,
      status: "Active",
      last_triggered: new Date().toISOString(),
    },
  ];

  // Pre-populated supplier contacts
  memoryDatabase.SupplierContact = [
    {
      contact_id: 1,
      supplier_id: 1,
      name: "Alice Supplier",
      position: "Sales Manager",
      email: "alice@medisupply.com",
      phone: "123-456-7890",
    },
  ];

  // Pre-populated payment transactions
  memoryDatabase.PaymentTransaction = [
    {
      transaction_id: 1,
      billing_id: 1,
      amount: 69.98,
      payment_date: new Date().toISOString(),
      payment_method: "Credit Card",
      status: "Completed",
    },
  ];

  // Pre-populated insurance
  memoryDatabase.Insurance = [
    {
      insurance_id: 1,
      patient_id: 1,
      provider: "HealthGuard",
      policy_number: "HG123456789",
      coverage_details: "Full coverage",
      expiry_date: "2026-01-01",
    },
  ];

  // Pre-populated dashboard widgets
  memoryDatabase.DashboardWidget = [
    {
      widget_id: 1,
      title: "Sales Overview",
      widget_type: "chart",
      data_source: "sales_api",
      configuration: JSON.stringify({ type: "bar" }),
      position: 1,
    },
  ];

  // Pre-populated notification settings
  memoryDatabase.NotificationSettings = [
    {
      setting_id: 1,
      employee_id: 1,
      notification_type: "email",
      is_enabled: true,
      delivery_method: "instant",
    },
  ];

  // Pre-populated notifications
  memoryDatabase.Notification = [
    {
      notification_id: 1,
      employee_id: 1,
      message: "New stock alert",
      type: "alert",
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ];

  // Pre-populated reports
  memoryDatabase.Report = [
    {
      report_id: 1,
      report_name: "Monthly Sales",
      report_type: "financial",
      parameters: JSON.stringify({ month: "May" }),
      created_by: 1,
      created_at: new Date().toISOString(),
      last_run: new Date().toISOString(),
    },
  ];

  // Pre-populated API keys
  memoryDatabase.ApiKey = [
    {
      key_id: 1,
      api_key: "demo-api-key-123",
      created_by: 1,
      created_at: new Date().toISOString(),
      expires_at: "2026-01-01T00:00:00Z",
      permissions: JSON.stringify(["read", "write"]),
      is_active: true,
    },
  ];
};

if (!demoRuntime.medinvDemoDatabase) {
  seedDemoData();
  demoRuntime.medinvDemoDatabase = memoryDatabase;
}

// Define common return types
type QueryResult = any[] | { insertId?: number; affectedRows?: number };

// Helper to generate sequential IDs for each table
const getNextId = (tableName: string): number => {
  const items = memoryDatabase[tableName];
  const idField = tableName.toLowerCase().endsWith("s")
    ? tableName.toLowerCase().slice(0, -1) + "_id"
    : tableName.toLowerCase() + "_id";

  return items.length > 0
    ? Math.max(...items.map((item) => item[idField] || 0)) + 1
    : 1;
};

// Generic query execution for memory database
export async function executeMemoryQuery(
  query: string,
  params: any[] = [],
): Promise<QueryResult> {
  query = query.trim();
  const operation = query.match(/^\w+/)?.[0].toLowerCase();

  // SELECT queries
  if (operation === "select") {
    return handleSelect(query, params);
  }

  // INSERT queries
  if (operation === "insert") {
    return handleInsert(query, params);
  }

  // UPDATE queries
  if (operation === "update") {
    return handleUpdate(query, params);
  }

  // DELETE queries
  if (operation === "delete") {
    return handleDelete(query, params);
  }

  // For other queries like DESCRIBE, etc.
  return [];
}

// Handle SELECT queries
function handleSelect(query: string, params: any[]): any[] {
  const lowerQuery = query.toLowerCase();
  const tableName = query.match(/from\s+([\w.]+)/i)?.[1] ?? "";

  // Handle information_schema.tables
  if (tableName.toLowerCase() === "information_schema.tables") {
    return Object.keys(dbSchema.tables)
      .map((name) => ({
        table_name: name,
        table_rows: 0, // Mock row count
      }))
      .sort((a, b) => a.table_name.localeCompare(b.table_name));
  }

  // Handle information_schema.columns
  if (tableName.toLowerCase() === "information_schema.columns") {
    // Extract table name from WHERE clause if possible
    // Query: ... WHERE TABLE_SCHEMA = 'test2' AND TABLE_NAME = ?
    // Params usually contain the table name
    const targetTable = params[params.length - 1]; // Assuming last param is table name
    if (targetTable && (dbSchema.tables as any)[targetTable]) {
      const tableDef = (dbSchema.tables as any)[targetTable];
      return tableDef.columns.map((col: any) => ({
        name: col.name,
        type: col.type,
        nullable: false, // Mock
        defaultValue: null, // Mock
        isPrimaryKey: col.key === "PRI",
        isForeignKey: col.key === "MUL", // Approximation
      }));
    }
    return [];
  }

  // Handle information_schema.key_column_usage
  if (tableName.toLowerCase() === "information_schema.key_column_usage") {
    const targetTable = params[params.length - 1];
    if (targetTable && (dbSchema.tables as any)[targetTable]) {
      const tableDef = (dbSchema.tables as any)[targetTable];
      if (tableDef.relationships) {
        return tableDef.relationships.map((rel: any) => {
          const [refTable, refCol] = rel.references.split(".");
          return {
            column_name: rel.column,
            referenced_table: refTable,
            referenced_column: refCol,
          };
        });
      }
    }
    return [];
  }

  // Handle Average Order Value (Nested Query)
  if (query.toLowerCase().includes("avg(order_total.total)")) {
    return [{ average: 150.5 }];
  }

  // PRIORITIZE COMPLEX QUERIES (JOIN/GROUP BY)
  // This ensures that analytics queries are handled by handleJoinQuery
  // instead of falling through to handleSumQuery which rejects GROUP BY
  if (lowerQuery.includes("join") || lowerQuery.includes("group by")) {
    const joinResult = handleJoinQuery(query, params);
    if (joinResult && joinResult.length > 0) {
      return joinResult;
    }
  }

  // Handle COUNT aggregation
  if (lowerQuery.includes("count(*)")) {
    return handleCountQuery(query, params);
  }

  // Handle SUM aggregation
  if (lowerQuery.includes("sum(")) {
    return handleSumQuery(query, params);
  }

  // Simple join handling using regex for common patterns
  // (Fallback if not caught above)
  if (lowerQuery.includes("join")) {
    return handleJoinQuery(query, params);
  }

  // Simple where clause handling
  if (lowerQuery.includes("where")) {
    return handleWhereQuery(query, params, tableName);
  }

  let results: any[] = [];
  // Default - return all records from the table
  // Handle case mismatch and mapping
  const dbKey = Object.keys(memoryDatabase).find(
    (k) => k.toLowerCase() === tableName.toLowerCase(),
  );
  if (dbKey && memoryDatabase[dbKey]) {
    results = memoryDatabase[dbKey].map((item) => ({ ...item }));
  }

  // Handle LIMIT
  const limitMatch = query.match(/limit\s+(\d+)/i);
  if (limitMatch) {
    const limit = parseInt(limitMatch[1]);
    results = results.slice(0, limit);
  }

  return results;
}

// Handle INSERT queries
function handleInsert(
  query: string,
  params: any[],
): { insertId: number; affectedRows: number } {
  // Extract table name
  const tableMatch = query.match(/insert\s+into\s+(\w+)/i);
  if (!tableMatch || !tableMatch[1]) return { insertId: 0, affectedRows: 0 };

  const tableName =
    Object.keys(memoryDatabase).find(
      (key) => key.toLowerCase() === tableMatch[1].toLowerCase(),
    ) ?? tableMatch[1];

  // Make sure table exists
  if (!memoryDatabase[tableName]) {
    memoryDatabase[tableName] = [];
  }

  // Create new record
  const newId = getNextId(tableName);
  const idField = tableName.toLowerCase().endsWith("s")
    ? tableName.toLowerCase().slice(0, -1) + "_id"
    : tableName.toLowerCase() + "_id";

  // Create new record with ID
  const newRecord: Record<string, any> = { [idField]: newId };

  // Extract column names from query
  const columnsMatch = query.match(/\(([^)]+)\)\s*values/i);
  if (columnsMatch && columnsMatch[1]) {
    const columns = columnsMatch[1]
      .split(",")
      .map((col) => col.trim().toLowerCase());

    // Assign values from params to corresponding columns
    columns.forEach((col: string, index: number) => {
      if (index < params.length) {
        newRecord[col] = params[index];
      }
    });
  }

  // Add timestamps if they exist in the schema
  if (tableName !== "OrderItems") {
    if (!("created_at" in newRecord)) {
      newRecord.created_at = new Date().toISOString();
    }
    if (!("updated_at" in newRecord)) {
      newRecord.updated_at = new Date().toISOString();
    }
  }
  if (tableName === "Inventory")
    newRecord.last_updated = new Date().toISOString();

  // Add to the table
  memoryDatabase[tableName].push(newRecord as any);

  // Return mysql-like result
  return { insertId: newId, affectedRows: 1 };
}

// Handle UPDATE queries
function handleUpdate(query: string, params: any[]): { affectedRows: number } {
  // Extract table name
  const tableMatch = query.match(/update\s+(\w+)\s+set/i);
  if (!tableMatch || !tableMatch[1]) return { affectedRows: 0 };

  const tableName =
    Object.keys(memoryDatabase).find(
      (key) => key.toLowerCase() === tableMatch[1].toLowerCase(),
    ) ?? tableMatch[1];

  // Make sure table exists
  if (!memoryDatabase[tableName]) {
    return { affectedRows: 0 };
  }

  // Extract where condition
  const whereMatch = query.match(/where\s+([\s\S]+)$/i);
  if (!whereMatch) {
    return { affectedRows: 0 }; // Safety - don't update all records
  }

  const whereCondition = whereMatch[1].trim();

  // Extract field and value from where condition (simplified)
  const whereFieldMatch = whereCondition.match(/(\w+)\s*=\s*\?/);
  if (!whereFieldMatch) {
    return { affectedRows: 0 };
  }

  const whereField = whereFieldMatch[1].toLowerCase();
  const whereValue = params[params.length - 1]; // Last param is the where value

  // Extract field=value pairs from SET clause
  const setMatch = query.match(/set\s+([\s\S]+?)\s+where/i);
  if (!setMatch) {
    return { affectedRows: 0 };
  }

  // Find records to update
  let affectedRows = 0;
  memoryDatabase[tableName] = memoryDatabase[tableName].map((record) => {
    if (record[whereField] == whereValue) {
      // Loose comparison for type handling
      affectedRows++;

      // Process SET clause (simplified parsing)
      const setParts = setMatch[1].split(",");
      let paramIndex = 0;

      setParts.forEach((part: string) => {
        const fieldMatch = part.trim().match(/(\w+)\s*=\s*\?/);
        if (fieldMatch && paramIndex < params.length - 1) {
          const field = fieldMatch[1].toLowerCase();
          record[field] = params[paramIndex++];
        }
      });

      // Update timestamp if it exists
      if ("updated_at" in record) {
        record.updated_at = new Date().toISOString();
      }
      if ("last_updated" in record)
        record.last_updated = new Date().toISOString();
    }
    return record;
  });

  return { affectedRows };
}

// Handle DELETE queries
function handleDelete(query: string, params: any[]): { affectedRows: number } {
  // Extract table name
  const tableMatch = query.match(/delete\s+from\s+(\w+)/i);
  if (!tableMatch || !tableMatch[1]) return { affectedRows: 0 };

  const tableName =
    Object.keys(memoryDatabase).find(
      (key) => key.toLowerCase() === tableMatch[1].toLowerCase(),
    ) ?? tableMatch[1];

  // Make sure table exists
  if (!memoryDatabase[tableName]) {
    return { affectedRows: 0 };
  }

  // Extract where condition
  const whereMatch = query.match(/where\s+([\s\S]+)$/i);
  if (!whereMatch) {
    return { affectedRows: 0 }; // Safety - don't delete all records
  }

  const whereCondition = whereMatch[1].trim();

  // Extract field and value from where condition (simplified)
  const whereFieldMatch = whereCondition.match(/(\w+)\s*=\s*\?/);
  if (!whereFieldMatch) {
    return { affectedRows: 0 };
  }

  const whereField = whereFieldMatch[1].toLowerCase();
  const whereValue = params[0]; // Assume it's the first param

  // Count items before deletion
  const beforeCount = memoryDatabase[tableName].length;

  // Filter out matching records
  memoryDatabase[tableName] = memoryDatabase[tableName].filter(
    (record) => record[whereField] != whereValue, // Loose comparison
  );

  // Calculate affected rows
  return { affectedRows: beforeCount - memoryDatabase[tableName].length };
}

// Define result type for JOIN queries
interface OrderJoinResult {
  order_id: number;
  patient_name: string;
  patient_id: number;
  medicine_name: string;
  order_date: string;
  log_date?: string;
  quantity: number;
}

// Handle more complex JOIN queries
function handleJoinQuery(query: string, params: any[]): any[] {
  // This is a simplified JOIN handler that works for the most common queries in MedInv
  // Extract main table and joined tables
  const fromMatch = query.match(/from\s+(\w+)/i);
  if (!fromMatch) return [];

  const mainTable = fromMatch[1].toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Inventory records and expiry alerts both join the physical Inventory table to Medicine.
  if (
    mainTable === "inventory" &&
    /join\s+medicine\b/.test(lowerQuery) &&
    !/\b(count|sum|avg)\s*\(|group\s+by/.test(lowerQuery)
  ) {
    const medicines = new Map(
      memoryDatabase.Medicine.map((medicine) => [
        medicine.medicine_id,
        medicine,
      ]),
    );
    const joined = memoryDatabase.Inventory.map((item) => ({
      item,
      medicine: medicines.get(item.medicine_id),
    }));
    if (/m\.expiry_date\s*<=\s*\?/.test(lowerQuery)) {
      const cutoff = new Date(params[0]).getTime();
      return joined
        .filter(
          ({ medicine }) =>
            medicine?.expiry_date &&
            new Date(medicine.expiry_date).getTime() <= cutoff,
        )
        .sort(
          (a, b) =>
            new Date(a.medicine!.expiry_date!).getTime() -
            new Date(b.medicine!.expiry_date!).getTime(),
        )
        .map(({ item, medicine }) => ({
          medicine_id: item.medicine_id,
          medicine_name: medicine!.name,
          expiry_date: medicine!.expiry_date,
          quantity: item.quantity,
          supplier_name: null,
          supplier_contact_info: null,
        }));
    }
    return joined
      .sort((a, b) => a.item.inventory_id - b.item.inventory_id)
      .map(({ item, medicine }) => ({
        inventory_number: item.inventory_id,
        medicine_id: item.medicine_id,
        medicine_name: medicine?.name ?? null,
        supplier_id: null,
        supplier_name: null,
        quantity: item.quantity,
      }));
  }

  // For orders page JOIN example:
  if (
    mainTable === "orders" &&
    lowerQuery.includes("join patient") &&
    lowerQuery.includes("join orderitems") &&
    lowerQuery.includes("join medicine")
  ) {
    // Create joined results manually
    const results: OrderJoinResult[] = [];

    // Process each order
    memoryDatabase.Orders.forEach((order) => {
      // Find related patient
      const patient = memoryDatabase.Patient.find(
        (p) => p.patient_id === order.patient_id,
      ) || {
        patient_id: 0,
        name: "Unknown Patient",
        email: "",
        phone_number: "",
        created_at: "",
        updated_at: "",
      };

      // Find related order items
      const orderItems = memoryDatabase.OrderItems.filter(
        (oi) => oi.order_id === order.order_id,
      );

      // For each order item, create a result row with medicine details
      orderItems.forEach((item) => {
        const medicine = memoryDatabase.Medicine.find(
          (m) => m.medicine_id === item.medicine_id,
        ) || {
          medicine_id: 0,
          name: "Unknown Medicine",
          price: 0,
          created_at: "",
          updated_at: "",
        };

        // Find optional medical log (LEFT JOIN)
        const medicalLog = memoryDatabase.MedicalLogs.find(
          (ml) => ml.patient_id === order.patient_id,
        ) || {
          log_id: 0,
          patient_id: 0,
          medicine_id: 0,
          log_date: "",
          dosage: "",
          created_at: "",
        };

        results.push({
          order_id: order.order_id,
          patient_name: patient.name,
          patient_id: patient.patient_id,
          medicine_name: medicine.name,
          order_date: order.order_date,
          log_date: medicalLog.log_date,
          quantity: item.quantity,
        });
      });
    });

    return results;
  }

  // Handle Inventory Distribution - Categories
  if (
    mainTable === "medicinecategories" &&
    lowerQuery.includes("group by mc.drug_category_name")
  ) {
    return [
      { name: "Analgesics", count: 15, total_quantity: 450, value: 4500.0 },
      { name: "Antibiotics", count: 12, total_quantity: 320, value: 6400.0 },
      { name: "Antihistamines", count: 8, total_quantity: 200, value: 3000.0 },
      { name: "Antidiabetics", count: 10, total_quantity: 500, value: 12500.0 },
      {
        name: "Cardiovascular",
        count: 14,
        total_quantity: 420,
        value: 12600.0,
      },
    ];
  }

  // Handle Inventory Distribution - Locations
  if (mainTable === "inventory" && lowerQuery.includes("group by i.location")) {
    return [
      { name: "Shelf A1", count: 5, total_quantity: 150, value: 2250.0 },
      { name: "Shelf B2", count: 4, total_quantity: 120, value: 2400.0 },
      { name: "Shelf C3", count: 6, total_quantity: 180, value: 2700.0 },
      { name: "Shelf D1", count: 8, total_quantity: 240, value: 6000.0 },
      { name: "Shelf D2", count: 7, total_quantity: 210, value: 6300.0 },
    ];
  }

  // Handle Analytics - Top Medicines
  if (
    mainTable === "orderitems" &&
    lowerQuery.includes("group by m.medicine_id")
  ) {
    return [
      { medicine_id: 1, name: "Paracetamol", total_quantity_sold: 150 },
      { medicine_id: 2, name: "Amoxicillin", total_quantity_sold: 120 },
      { medicine_id: 5, name: "Metformin", total_quantity_sold: 90 },
      { medicine_id: 4, name: "Ibuprofen", total_quantity_sold: 85 },
      { medicine_id: 6, name: "Atorvastatin", total_quantity_sold: 60 },
    ];
  }

  // Handle Analytics - Inventory Turnover (Monthly Sales)
  if (
    mainTable === "orderitems" &&
    lowerQuery.includes("group by date_format(o.order_date")
  ) {
    return [
      { month: "2025-01", total_quantity_sold: 320 },
      { month: "2025-02", total_quantity_sold: 280 },
      { month: "2025-03", total_quantity_sold: 350 },
      { month: "2025-04", total_quantity_sold: 410 },
      { month: "2025-05", total_quantity_sold: 390 },
      { month: "2025-06", total_quantity_sold: 450 },
    ];
  }

  // Handle Orders Overview - Monthly Data
  if (
    mainTable === "orders" &&
    lowerQuery.includes("group by date_format(o.order_date")
  ) {
    return [
      { name: "Jan", orders: 45, revenue: 12500.0 },
      { name: "Feb", orders: 38, revenue: 10200.0 },
      { name: "Mar", orders: 52, revenue: 15800.0 },
      { name: "Apr", orders: 48, revenue: 14500.0 },
      { name: "May", orders: 60, revenue: 18900.0 },
      { name: "Jun", orders: 55, revenue: 16500.0 },
    ];
  }

  // Handle Orders Overview - Average Value (Nested Query)
  // Note: Nested queries are hard to match with regex on the main query string if passed directly
  // But executeQuery passes the full string.
  // The query starts with SELECT AVG... FROM (SELECT ... FROM Orders ...)
  // So mainTable extraction might fail or be 'Orders' depending on regex.
  // My regex: const fromMatch = query.match(/from\s+(\w+)/i);
  // For "SELECT AVG(...) FROM (SELECT ...)", the first FROM is followed by "(".
  // So mainTable might be undefined or match something else.

  // Let's handle it in the main executeMemoryQuery or add a specific check here if mainTable is null/weird

  // If we don't have a specific handler, return empty array
  return [];
}

// Handle COUNT queries
function handleCountQuery(
  query: string,
  params: any[],
): Array<Record<string, number>> {
  const fromMatch = query.match(/from\s+(\w+)/i);
  if (!fromMatch) return [{ "COUNT(*)": 0 }];

  const tableName = fromMatch[1];

  // Check if the table exists (case-insensitive)
  const dbKey = Object.keys(memoryDatabase).find(
    (k) => k.toLowerCase() === tableName.toLowerCase(),
  );
  if (!dbKey || !memoryDatabase[dbKey]) return [{ "COUNT(*)": 0 }];

  const tableData = memoryDatabase[dbKey];

  // Extract field name for count result
  const countAsMatch = query.match(/count\(\*\)\s+as\s+(\w+)/i);
  // Default to 'COUNT(*)' to match MySQL behavior when no alias is provided
  const countField = countAsMatch ? countAsMatch[1] : "COUNT(*)";

  // Extract where condition if present
  if (/\bwhere\b/i.test(query)) {
    const whereMatch = query.match(/where\s+([\s\S]+)$/i);
    if (whereMatch) {
      const condition = whereMatch[1].toLowerCase();

      // Handle quantity < 10 condition for inventory
      if (condition.includes("quantity") && condition.includes("<")) {
        const threshold = parseInt(condition.split("<")[1].trim(), 10);
        const count = tableData.filter(
          (item: any) =>
            item.quantity !== undefined && item.quantity < threshold,
        ).length;
        return [{ [countField]: count }];
      }

      // Handle expiry_date between x and y
      if (condition.includes("expiry_date") && condition.includes("between")) {
        // Improved date handling with error checking
        const count = tableData.filter((item: any) => {
          // Skip items with missing or invalid expiry dates
          if (!item.expiry_date) return false;

          try {
            const expiryDate = new Date(item.expiry_date);

            // Check if date is valid (invalid dates return NaN when converted to number)
            if (isNaN(expiryDate.getTime())) return false;

            const today = new Date();

            // Determine the interval from the query if possible, otherwise default to 90 days (common case)
            let daysToAdd = 90;
            if (condition.includes("interval 30 day")) daysToAdd = 30;
            if (condition.includes("interval 60 day")) daysToAdd = 60;

            const futureDate = new Date();
            futureDate.setDate(today.getDate() + daysToAdd);

            return expiryDate >= today && expiryDate <= futureDate;
          } catch (error) {
            console.error(
              `Invalid date format for expiry_date: ${item.expiry_date}`,
              error,
            );
            return false;
          }
        }).length;

        return [{ [countField]: count }];
      }
    }
  }

  // Default - count all records
  return [{ [countField]: tableData.length }];
}

// Handle SUM queries
function handleSumQuery(
  query: string,
  params: any[],
): Array<Record<string, number>> {
  const lowerQuery = query.toLowerCase();

  // Only handle simple SUM queries, not complex ones with GROUP BY or multiple columns
  if (lowerQuery.includes("group by") || lowerQuery.includes(",")) {
    return []; // Let it fall through to other handlers or return empty
  }

  // Extract the field being summed - improved regex to handle expressions
  // Matches SUM(...) AS alias
  const sumMatch = query.match(/sum\((.*?)\)\s+as\s+(\w+)/i);

  // Default result field if not found
  const resultField = sumMatch ? sumMatch[2] : "sum";
  const sumExpression = sumMatch ? sumMatch[1].toLowerCase() : "";

  // Handle inventory total items query: SUM(quantity)
  if (
    lowerQuery.includes("from inventory") &&
    (sumExpression === "quantity" || sumExpression.includes("quantity"))
  ) {
    // Check if it's just quantity or quantity * price
    if (sumExpression.includes("price")) {
      // Calculate total value: quantity * price
      let totalValue = 0;
      memoryDatabase.Inventory.forEach((invItem) => {
        const medicine = memoryDatabase.Medicine.find(
          (m) => m.medicine_id === invItem.medicine_id,
        );
        if (medicine) {
          totalValue += invItem.quantity * (medicine.price || 0);
        }
      });
      return [{ [resultField]: totalValue }];
    } else {
      // Just quantity
      const sum = memoryDatabase.Inventory.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      return [{ [resultField]: sum }];
    }
  }

  // Handle orders revenue: SUM(oi.quantity * m.price)
  if (
    lowerQuery.includes("from orders") ||
    lowerQuery.includes("from orderitems")
  ) {
    if (sumExpression.includes("price") && sumExpression.includes("quantity")) {
      let totalRevenue = 0;
      memoryDatabase.OrderItems.forEach((item) => {
        const medicine = memoryDatabase.Medicine.find(
          (m) => m.medicine_id === item.medicine_id,
        );
        if (medicine) {
          totalRevenue += item.quantity * (medicine.price || 0);
        }
      });
      return [{ [resultField]: totalRevenue }];
    }

    if (sumExpression.includes("quantity")) {
      const totalQuantity = memoryDatabase.OrderItems.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      return [{ [resultField]: totalQuantity }];
    }
  }

  return [{ [resultField]: 0 }];
}

// Handle WHERE clause queries
function handleWhereQuery(
  query: string,
  params: any[],
  tableName: string,
): any[] {
  // Handle case-insensitive table lookup
  const dbKey = Object.keys(memoryDatabase).find(
    (k) => k.toLowerCase() === tableName.toLowerCase(),
  );
  if (!dbKey || !memoryDatabase[dbKey]) {
    console.log(`[MemoryDB] Table not found: ${tableName}`);
    return [];
  }

  const tableData = memoryDatabase[dbKey];

  const whereMatch = query.match(/where\s+([\s\S]+)$/i);
  if (!whereMatch) return tableData;

  const whereCondition = whereMatch[1].toLowerCase();

  // Simple WHERE field = ? handling
  const whereFieldMatch = whereCondition.match(/(\w+)\s*=\s*\?/);
  if (whereFieldMatch && params.length > 0) {
    const field = whereFieldMatch[1];
    const value = params[0];

    console.log(`[MemoryDB] Filtering ${dbKey} where ${field} = ${value}`);
    const results = tableData.filter(
      (item) => String(item[field]) === String(value),
    ); // Loose comparison with string conversion
    console.log(`[MemoryDB] Found ${results.length} matches`);
    return results;
  }

  return tableData;
}

// Reset the demo database to its initial state
export function resetDemoDatabase() {
  for (const tableName of Object.keys(memoryDatabase))
    memoryDatabase[tableName] = [];
  seedDemoData();
}

// Get table schema information
export function getDemoTableStructure(tableName: string) {
  // For DESCRIBE queries, return simplified column metadata
  const tableDefinitions = {
    Patient: [
      {
        Field: "patient_id",
        Type: "int",
        Null: "NO",
        Key: "PRI",
        Default: null,
        Extra: "auto_increment",
      },
      {
        Field: "name",
        Type: "varchar(255)",
        Null: "NO",
        Key: "",
        Default: null,
        Extra: "",
      },
      {
        Field: "email",
        Type: "varchar(255)",
        Null: "YES",
        Key: "",
        Default: null,
        Extra: "",
      },
      {
        Field: "phone_number",
        Type: "varchar(20)",
        Null: "YES",
        Key: "",
        Default: null,
        Extra: "",
      },
      {
        Field: "created_at",
        Type: "timestamp",
        Null: "NO",
        Key: "",
        Default: "CURRENT_TIMESTAMP",
        Extra: "",
      },
      {
        Field: "updated_at",
        Type: "timestamp",
        Null: "NO",
        Key: "",
        Default: "CURRENT_TIMESTAMP",
        Extra: "",
      },
    ],
    Medicine: [
      {
        Field: "medicine_id",
        Type: "int",
        Null: "NO",
        Key: "PRI",
        Default: null,
        Extra: "auto_increment",
      },
      {
        Field: "name",
        Type: "varchar(255)",
        Null: "NO",
        Key: "",
        Default: null,
        Extra: "",
      },
      {
        Field: "description",
        Type: "text",
        Null: "YES",
        Key: "",
        Default: null,
        Extra: "",
      },
      {
        Field: "price",
        Type: "decimal(10,2)",
        Null: "NO",
        Key: "",
        Default: "0.00",
        Extra: "",
      },
      {
        Field: "unit",
        Type: "varchar(50)",
        Null: "YES",
        Key: "",
        Default: null,
        Extra: "",
      },
      {
        Field: "expiry_date",
        Type: "date",
        Null: "YES",
        Key: "",
        Default: null,
        Extra: "",
      },
      {
        Field: "manufacturer",
        Type: "varchar(255)",
        Null: "YES",
        Key: "",
        Default: null,
        Extra: "",
      },
      {
        Field: "created_at",
        Type: "timestamp",
        Null: "NO",
        Key: "",
        Default: "CURRENT_TIMESTAMP",
        Extra: "",
      },
      {
        Field: "updated_at",
        Type: "timestamp",
        Null: "NO",
        Key: "",
        Default: "CURRENT_TIMESTAMP",
        Extra: "",
      },
    ],
    Inventory: [
      {
        Field: "inventory_id",
        Type: "int",
        Null: "NO",
        Key: "PRI",
        Default: null,
        Extra: "auto_increment",
      },
      {
        Field: "medicine_id",
        Type: "int",
        Null: "NO",
        Key: "MUL",
        Default: null,
        Extra: "",
      },
      {
        Field: "quantity",
        Type: "int",
        Null: "NO",
        Key: "",
        Default: "0",
        Extra: "",
      },
      {
        Field: "location",
        Type: "varchar(100)",
        Null: "YES",
        Key: "",
        Default: null,
        Extra: "",
      },
      {
        Field: "last_updated",
        Type: "timestamp",
        Null: "NO",
        Key: "",
        Default: "CURRENT_TIMESTAMP",
        Extra: "",
      },
    ],
    Orders: [
      {
        Field: "order_id",
        Type: "int",
        Null: "NO",
        Key: "PRI",
        Default: null,
        Extra: "auto_increment",
      },
      {
        Field: "patient_id",
        Type: "int",
        Null: "NO",
        Key: "MUL",
        Default: null,
        Extra: "",
      },
      {
        Field: "supplier_id",
        Type: "int",
        Null: "NO",
        Key: "MUL",
        Default: null,
        Extra: "",
      },
      {
        Field: "employee_id",
        Type: "int",
        Null: "NO",
        Key: "MUL",
        Default: null,
        Extra: "",
      },
      {
        Field: "order_date",
        Type: "date",
        Null: "NO",
        Key: "",
        Default: null,
        Extra: "",
      },
      {
        Field: "created_at",
        Type: "timestamp",
        Null: "NO",
        Key: "",
        Default: "CURRENT_TIMESTAMP",
        Extra: "",
      },
    ],
    OrderItems: [
      {
        Field: "order_id",
        Type: "int",
        Null: "NO",
        Key: "PRI",
        Default: null,
        Extra: "",
      },
      {
        Field: "medicine_id",
        Type: "int",
        Null: "NO",
        Key: "PRI",
        Default: null,
        Extra: "",
      },
      {
        Field: "quantity",
        Type: "int",
        Null: "NO",
        Key: "",
        Default: null,
        Extra: "",
      },
    ],
  };

  return tableDefinitions[tableName as keyof typeof tableDefinitions] || [];
}
