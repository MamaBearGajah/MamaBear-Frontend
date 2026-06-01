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
	kurir?: string;
	resi?: string;
};

let ORDERS: Order[] = [
	{
		id: "MB-2026-1001",
		date: "2026-05-28",
		items: [
			{ id: "p10", name: "MamaBear Protein Mix", quantity: 1, price: 125000 },
		],
		total: 125000,
		status: "Pending",
	},
	{
		id: "MB-2026-1002",
		date: "2026-05-25",
		items: [
			{ id: "p11", name: "Kookie Bites – Peanut", quantity: 2, price: 49000 },
		],
		total: 98000,
		status: "Processing",
		kurir: "JNE Regular",
		resi: "JNE123456789",
	},
	{
		id: "MB-2026-1003",
		date: "2026-05-20",
		items: [
			{ id: "p12", name: "Zaya Mix – Vanilla", quantity: 1, price: 55000 },
		],
		total: 55000,
		status: "Cancelled",
	},
	{
		id: "MB-2025-4521",
		date: "2025-03-15",
		items: [{ id: "p1", name: "ASI Booster Tea – Thai Milk Tea", quantity: 2, price: 49000 }],
		total: 98000,
		status: "Delivered",
		kurir: "JNE Express",
		resi: "1234567890123",
	},
    {
		id: "MB-2025-4523",
		date: "2025-03-15",
		items: [{ id: "p1", name: "ASI Booster Tea – Thai Milk Tea", quantity: 2, price: 49000 }],
		total: 88000,
		status: "Processing",
		kurir: "JNE Express",
		resi: "1234567890123",
	},
    {
		id: "MB-2025-4411",
		date: "2025-03-17",
		items: [{ id: "p1", name: "ASI Booster Tea – Thai Milk Tea", quantity: 2, price: 49000 }],
		total: 988000,
		status: "Processing",
		kurir: "JNE Express",
		resi: "1234567890123",
	},
	{
		id: "MB-2025-3892",
		date: "2025-02-28",
		items: [
			{ id: "p2", name: "Kookie Bites – Chocolate Chip", quantity: 3, price: 39000 },
			{ id: "p3", name: "Almon Mix – Vanilla", quantity: 1, price: 59000 },
		],
		total: 176000,
		status: "Cancelled",
		kurir: "TIKI Overnight",
		resi: "9876543210987",
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

