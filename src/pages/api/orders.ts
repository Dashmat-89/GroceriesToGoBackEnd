import { getAllOrders } from '@/models';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  }
}
