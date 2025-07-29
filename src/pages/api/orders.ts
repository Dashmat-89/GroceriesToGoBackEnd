import { getAllOrders } from '@/models';

export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === 'GET') {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  }
}
