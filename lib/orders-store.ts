import { type DashboardOrder } from "./orders-data";

// Shared in-memory store for orders across API routes
const globalOrderStore = new Map<string, DashboardOrder>();

export function clearStoredOrders(): void {
  globalOrderStore.clear();
}

export function getAllStoredOrders(): DashboardOrder[] {
  return Array.from(globalOrderStore.values()).sort((a, b) => b.orderSeq - a.orderSeq);
}

export function getStoredOrder(id: string): DashboardOrder | undefined {
  return globalOrderStore.get(id);
}

export function saveStoredOrder(order: DashboardOrder): void {
  globalOrderStore.set(order.id, order);
}

export function updateStoredOrderStatus(
  id: string,
  orderStatus?: DashboardOrder["orderStatus"],
  paymentStatus?: DashboardOrder["paymentStatus"]
): DashboardOrder | undefined {
  const existing = globalOrderStore.get(id);
  if (!existing) return undefined;

  if (orderStatus) existing.orderStatus = orderStatus;
  if (paymentStatus) existing.paymentStatus = paymentStatus;
  globalOrderStore.set(id, existing);
  return existing;
}

export function getNextOrderSequence(): number {
  return globalOrderStore.size + 1;
}
