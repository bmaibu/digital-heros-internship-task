import Lead from '../models/Lead.js';

export async function getStats(req, res) {
  const [total, grouped, recent, growth] = await Promise.all([
    Lead.countDocuments(),
    Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
    Lead.aggregate([
      { $match: { createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 6)) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, leads: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);
  const statuses = Object.fromEntries(grouped.map(({ _id, count }) => [_id, count]));
  res.json({ total, new: statuses.New || 0, contacted: statuses.Contacted || 0, closed: statuses.Closed || 0, recent, growth });
}
