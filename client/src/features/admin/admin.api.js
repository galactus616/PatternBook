import axios from '../../lib/axios';

// ── Stats ──
export const fetchStats = () => axios.get('/admin/stats').catch(() => ({ data: {} }));

// ── Topics ──
export const fetchTopics = () => axios.get('/admin/topics').catch(() => ({ data: { topics: [] } }));
export const createTopic = (data) => axios.post('/admin/topics', data);
export const updateTopic = (id, data) => axios.put(`/admin/topics/${id}`, data);
export const deleteTopic = (id) => axios.delete(`/admin/topics/${id}`);

// ── Patterns ──
export const fetchPatterns = () => axios.get('/admin/patterns').catch(() => ({ data: { patterns: [] } }));
export const createPattern = (data) => axios.post('/admin/patterns', data);
export const updatePattern = (id, data) => axios.put(`/admin/patterns/${id}`, data);
export const deletePattern = (id) => axios.delete(`/admin/patterns/${id}`);

// ── SubPatterns ──
export const fetchSubPatterns = () => axios.get('/admin/sub-patterns').catch(() => ({ data: { subPatterns: [] } }));
export const createSubPattern = (data) => axios.post('/admin/sub-patterns', data);
export const updateSubPattern = (id, data) => axios.put(`/admin/sub-patterns/${id}`, data);
export const deleteSubPattern = (id) => axios.delete(`/admin/sub-patterns/${id}`);

// ── Problems ──
export const fetchProblems = () => axios.get('/admin/problems').catch(() => ({ data: { problems: [] } }));
export const createProblem = (data) => axios.post('/admin/problems', data);
export const updateProblem = (id, data) => axios.put(`/admin/problems/${id}`, data);
export const deleteProblem = (id) => axios.delete(`/admin/problems/${id}`);

// ── Users ──
export const fetchUsers = () => axios.get('/admin/users').catch(() => ({ data: { users: [] } }));
export const updateUser = (id, data) => axios.put(`/admin/users/${id}`, data);

// ── Coupons ──
export const fetchCoupons = () => axios.get('/admin/coupons').catch(() => ({ data: { coupons: [] } }));
export const createCoupon = (data) => axios.post('/admin/coupons', data);
export const updateCoupon = (id, data) => axios.put(`/admin/coupons/${id}`, data);
export const deleteCoupon = (id) => axios.delete(`/admin/coupons/${id}`);
export const toggleCoupon = (id) => axios.patch(`/admin/coupons/${id}/toggle`);
