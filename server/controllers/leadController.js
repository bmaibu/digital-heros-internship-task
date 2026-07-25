import Lead from '../models/Lead.js';

export async function createLead(req, res) {
  const lead = await Lead.create(req.body);
  res.status(201).json({ message: 'Thanks — we will be in touch shortly.', lead });
}

export async function getLeads(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const query = req.query.search?.trim().slice(0, 80);
  const escapedQuery = query?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const filter = escapedQuery ? { $or: [{ name: { $regex: escapedQuery, $options: 'i' } }, { email: { $regex: escapedQuery, $options: 'i' } }] } : {};
  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Lead.countDocuments(filter),
  ]);
  res.json({ leads, pagination: { page, limit, total, pages: Math.max(Math.ceil(total / limit), 1) } });
}

export async function updateLead(req, res) {
  const lead = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!lead) return res.status(404).json({ message: 'Lead not found.' });
  res.json({ message: 'Lead status updated.', lead });
}

export async function deleteLead(req, res) {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found.' });
  res.status(204).send();
}
