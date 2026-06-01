export type OrderItem = {
	id: string;
	name: string;
	quantity: number;
	price: number;
};

export type Order = {
	id: string;
	date: string;
	items: OrderItem[];
	total: number;
	status: "Delivered" | "Processing" | "Cancelled" | "Pending";
};

let ORDERS: Order[] = [
	{
		id: "MB-2025-4521",
		date: "2025-03-15",
		items: [{ id: "p1", name: "ASI Booster Tea – Thai Milk Tea", quantity: 2, price: 49000 }],
		total: 98000,
		status: "Delivered",
	},
	{
		id: "MB-2025-3892",
		date: "2025-02-28",
		items: [
			{ id: "p2", name: "Kookie Bites – Chocolate Chip", quantity: 3, price: 39000 },
			{ id: "p3", name: "Almon Mix – Vanilla", quantity: 1, price: 59000 },
		],
		total: 176000,
		status: "Delivered",
	},
];

export function getAllOrders(): Promise<Order[]> {
	return Promise.resolve(ORDERS);
}

export function getOrderById(id: string): Promise<Order | undefined> {
	const o = ORDERS.find((x) => x.id === id);
	return Promise.resolve(o);
}

export function createOrder(order: Omit<Order, "id">): Promise<Order> {
	const id = `MB-${Date.now()}`;
	const newOrder: Order = { id, ...order };
	ORDERS = [newOrder, ...ORDERS];
	return Promise.resolve(newOrder);
}

export function updateOrder(id: string, patch: Partial<Order>): Promise<Order | undefined> {
	let updated: Order | undefined;
	ORDERS = ORDERS.map((o) => {
		if (o.id === id) {
			updated = { ...o, ...patch };
			return updated;
		}
		return o;
	});
	return Promise.resolve(updated);
}

export function deleteOrder(id: string): Promise<boolean> {
	const before = ORDERS.length;
	ORDERS = ORDERS.filter((o) => o.id !== id);
	return Promise.resolve(ORDERS.length < before);
}

export function resetOrdersForTests(orders: Order[]) {
	ORDERS = orders;
}

