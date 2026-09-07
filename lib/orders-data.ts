export interface OrderItemDetail {
  productId: string;
  title: string;
  variantTitle?: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  sku?: string;
}

export interface DashboardOrder {
  id: string; // e.g. "7", "6"
  orderSeq: number; // 7, 6, etc.
  orderNumber: string; // e.g. "#3015756"
  fullOrderCode: string; // e.g. "BH-260905-30157"
  channel: "online" | "in-shop";
  customerName: string;
  phone: string;
  email?: string;
  district: string;
  area: string;
  address: string;
  deliveryZone: "inside-dhaka" | "outside-dhaka";
  itemsCount: number;
  totalQuantity: number;
  subtotal: number;
  shippingCharge: number;
  totalAmount: number;
  paymentMethod: "cod" | "bkash";
  paymentStatus: "unpaid" | "submitted" | "paid" | "failed";
  orderStatus: "placed" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  dateFormatted: string; // e.g. "Sep 5 · 7:30 PM"
  createdAt: string;
  customerNote?: string;
  items: OrderItemDetail[];
  payment?: {
    senderNumber?: string;
    transactionId?: string;
    submittedAt?: string;
  };
}

export const initialOrders: DashboardOrder[] = [
  {
    id: "7",
    orderSeq: 7,
    orderNumber: "3015756",
    fullOrderCode: "BH-260905-30157",
    channel: "online",
    customerName: "Bushra Kabir",
    phone: "+8801974786573",
    email: "bushra.kabir@gmail.com",
    district: "Dhaka",
    area: "Banani",
    address: "House 42, Road 11, Block D, Banani, Dhaka",
    deliveryZone: "inside-dhaka",
    itemsCount: 2,
    totalQuantity: 2,
    subtotal: 410,
    shippingCharge: 80,
    totalAmount: 490.0,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    orderStatus: "confirmed",
    dateFormatted: "Sep 5 · 7:30 PM",
    createdAt: "2026-09-05T19:30:00.000Z",
    customerNote: "Please deliver before 6 PM if possible.",
    items: [
      {
        productId: "bh-101",
        title: "Burmese Mango Chutney",
        variantTitle: "250g Jar",
        imageUrl: "/images/mango-chutney.png",
        quantity: 1,
        unitPrice: 220,
        lineTotal: 220,
        sku: "BH-MNG-250",
      },
      {
        productId: "bh-102",
        title: "Burmese Tamarind Chutney",
        variantTitle: "250g Jar",
        imageUrl: "/images/tamarind-chutney.png",
        quantity: 1,
        unitPrice: 190,
        lineTotal: 190,
        sku: "BH-TMR-250",
      },
    ],
  },
  {
    id: "6",
    orderSeq: 6,
    orderNumber: "2968232",
    fullOrderCode: "BH-260829-29682",
    channel: "online",
    customerName: "umme fatema",
    phone: "+8801906782089",
    email: "fatema.umme@yahoo.com",
    district: "Dhaka",
    area: "Dhanmondi",
    address: "Apartment 4B, Road 7/A, Dhanmondi, Dhaka",
    deliveryZone: "inside-dhaka",
    itemsCount: 2,
    totalQuantity: 2,
    subtotal: 440,
    shippingCharge: 80,
    totalAmount: 520.0,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    orderStatus: "delivered",
    dateFormatted: "Aug 29 · 12:46 PM",
    createdAt: "2026-08-29T12:46:00.000Z",
    customerNote: "Call before arriving.",
    items: [
      {
        productId: "bh-101",
        title: "Burmese Mango Chutney",
        variantTitle: "250g Jar",
        imageUrl: "/images/mango-chutney.png",
        quantity: 1,
        unitPrice: 220,
        lineTotal: 220,
        sku: "BH-MNG-250",
      },
      {
        productId: "bh-103",
        title: "Burmese Chili Garlic Chutney",
        variantTitle: "250g Jar",
        imageUrl: "/images/chili-chutney.png",
        quantity: 1,
        unitPrice: 220,
        lineTotal: 220,
        sku: "BH-CHL-250",
      },
    ],
  },
  {
    id: "5",
    orderSeq: 5,
    orderNumber: "2890124",
    fullOrderCode: "BH-260828-28901",
    channel: "online",
    customerName: "Sadia Rahman",
    phone: "+8801712345678",
    email: "sadia.rahman@gmail.com",
    district: "Dhaka",
    area: "Uttara",
    address: "Sector 4, Road 7, House 19, Uttara, Dhaka",
    deliveryZone: "inside-dhaka",
    itemsCount: 1,
    totalQuantity: 1,
    subtotal: 919,
    shippingCharge: 80,
    totalAmount: 999.0,
    paymentMethod: "bkash",
    paymentStatus: "paid",
    orderStatus: "shipped",
    dateFormatted: "Aug 28 · 3:15 PM",
    createdAt: "2026-08-28T15:15:00.000Z",
    items: [
      {
        productId: "bh-104",
        title: "Burmese Chutney Tasting Trio",
        variantTitle: "Gift Pack (3 Jars)",
        imageUrl: "/images/hero-chutney.png",
        quantity: 1,
        unitPrice: 919,
        lineTotal: 919,
        sku: "BH-TRIO-01",
      },
    ],
    payment: {
      senderNumber: "01712345678",
      transactionId: "BK7819X30",
      submittedAt: "2026-08-28T15:18:00.000Z",
    },
  },
  {
    id: "4",
    orderSeq: 4,
    orderNumber: "2847219",
    fullOrderCode: "BH-260827-28472",
    channel: "in-shop",
    customerName: "Rafiqul Islam",
    phone: "+8801819876543",
    district: "Dhaka",
    area: "Banani Outlet",
    address: "Banani Outlet Walk-in Counter",
    deliveryZone: "inside-dhaka",
    itemsCount: 2,
    totalQuantity: 2,
    subtotal: 740,
    shippingCharge: 0,
    totalAmount: 740.0,
    paymentMethod: "cod",
    paymentStatus: "paid",
    orderStatus: "delivered",
    dateFormatted: "Aug 27 · 5:20 PM",
    createdAt: "2026-08-27T17:20:00.000Z",
    items: [
      {
        productId: "bh-101",
        title: "Burmese Mango Chutney",
        variantTitle: "500g Family Jar",
        imageUrl: "/images/mango-chutney.png",
        quantity: 1,
        unitPrice: 380,
        lineTotal: 380,
        sku: "BH-MNG-500",
      },
      {
        productId: "bh-102",
        title: "Burmese Tamarind Chutney",
        variantTitle: "500g Family Jar",
        imageUrl: "/images/tamarind-chutney.png",
        quantity: 1,
        unitPrice: 360,
        lineTotal: 360,
        sku: "BH-TMR-500",
      },
    ],
  },
  {
    id: "3",
    orderSeq: 3,
    orderNumber: "2789120",
    fullOrderCode: "BH-260825-27891",
    channel: "online",
    customerName: "Mehedi Hasan",
    phone: "+8801678901234",
    email: "mehedi.h@outlook.com",
    district: "Dhaka",
    area: "Mirpur",
    address: "Section 10, Block C, Mirpur, Dhaka",
    deliveryZone: "inside-dhaka",
    itemsCount: 1,
    totalQuantity: 1,
    subtotal: 260,
    shippingCharge: 80,
    totalAmount: 340.0,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    orderStatus: "placed",
    dateFormatted: "Aug 25 · 11:10 AM",
    createdAt: "2026-08-25T11:10:00.000Z",
    items: [
      {
        productId: "bh-101",
        title: "Burmese Mango Chutney",
        variantTitle: "250g Jar",
        imageUrl: "/images/mango-chutney.png",
        quantity: 1,
        unitPrice: 260,
        lineTotal: 260,
        sku: "BH-MNG-250",
      },
    ],
  },
  {
    id: "2",
    orderSeq: 2,
    orderNumber: "2710344",
    fullOrderCode: "BH-260822-27103",
    channel: "online",
    customerName: "Tanvir Ahmed",
    phone: "+8801755123987",
    district: "Chattogram",
    area: "GEC Circle",
    address: "Nasirabad Housing, GEC, Chattogram",
    deliveryZone: "outside-dhaka",
    itemsCount: 1,
    totalQuantity: 1,
    subtotal: 290,
    shippingCharge: 130,
    totalAmount: 420.0,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    orderStatus: "cancelled",
    dateFormatted: "Aug 22 · 4:45 PM",
    createdAt: "2026-08-22T16:45:00.000Z",
    customerNote: "Customer requested cancellation via phone call.",
    items: [
      {
        productId: "bh-103",
        title: "Burmese Chili Garlic Chutney",
        variantTitle: "250g Jar",
        imageUrl: "/images/chili-chutney.png",
        quantity: 1,
        unitPrice: 290,
        lineTotal: 290,
        sku: "BH-CHL-250",
      },
    ],
  },
];
