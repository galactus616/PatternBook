import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../lib/axios';

const AdminContext = createContext(null);

export const PERMISSIONS = {
  TOPICS_CREATE:   'topics:create',
  TOPICS_EDIT:     'topics:edit',
  TOPICS_DELETE:   'topics:delete',
  PATTERNS_CREATE: 'patterns:create',
  PATTERNS_EDIT:   'patterns:edit',
  PATTERNS_DELETE: 'patterns:delete',
  SUBPATTERNS_CREATE: 'subpatterns:create',
  SUBPATTERNS_EDIT:   'subpatterns:edit',
  SUBPATTERNS_DELETE: 'subpatterns:delete',
  PROBLEMS_CREATE: 'problems:create',
  PROBLEMS_EDIT:   'problems:edit',
  PROBLEMS_DELETE: 'problems:delete',
  USERS_VIEW:      'users:view',
  USERS_PROMOTE:   'users:promote',
  PAYMENTS_VIEW:   'payments:view',
  COUPONS_CREATE:  'coupons:create',
  COUPONS_EDIT:    'coupons:edit',
  COUPONS_DELETE:  'coupons:delete',
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const PERMISSION_GROUPS = [
  { group: 'Topics', perms: [PERMISSIONS.TOPICS_CREATE, PERMISSIONS.TOPICS_EDIT, PERMISSIONS.TOPICS_DELETE] },
  { group: 'Patterns & SubPatterns', perms: [PERMISSIONS.PATTERNS_CREATE, PERMISSIONS.PATTERNS_EDIT, PERMISSIONS.PATTERNS_DELETE, PERMISSIONS.SUBPATTERNS_CREATE, PERMISSIONS.SUBPATTERNS_EDIT, PERMISSIONS.SUBPATTERNS_DELETE] },
  { group: 'Problems', perms: [PERMISSIONS.PROBLEMS_CREATE, PERMISSIONS.PROBLEMS_EDIT, PERMISSIONS.PROBLEMS_DELETE] },
  { group: 'Users', perms: [PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_PROMOTE] },
  { group: 'Payments & Coupons', perms: [PERMISSIONS.PAYMENTS_VIEW, PERMISSIONS.COUPONS_CREATE, PERMISSIONS.COUPONS_EDIT, PERMISSIONS.COUPONS_DELETE] },
];

export function hasPermission(role, permissions, perm) {
  if (role === 'ADMIN') return true;
  return permissions && permissions.includes(perm);
}

export function AdminProvider({ children }) {
  const [loading, setLoading] = useState(true);

  const [topics, setTopics] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [subPatterns, setSubPatterns] = useState([]);
  const [problems, setProblems] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        statsRes, topicsRes, patternsRes, subPatternsRes, 
        problemsRes, usersRes, couponsRes
      ] = await Promise.all([
        axios.get('/admin/stats').catch(() => ({ data: {} })),
        axios.get('/admin/topics').catch(() => ({ data: { topics: [] } })),
        axios.get('/admin/patterns').catch(() => ({ data: { patterns: [] } })),
        axios.get('/admin/sub-patterns').catch(() => ({ data: { subPatterns: [] } })),
        axios.get('/admin/problems').catch(() => ({ data: { problems: [] } })),
        axios.get('/admin/users').catch(() => ({ data: { users: [] } })),
        axios.get('/admin/coupons').catch(() => ({ data: { coupons: [] } })),
      ]);

      setAnalytics(statsRes.data?.analytics || null);
      setRevenueStats(statsRes.data?.revenueStats || null);
      setTransactions(statsRes.data?.transactions || []);
      
      setTopics(topicsRes.data?.topics || []);
      setPatterns(patternsRes.data?.patterns || []);
      setSubPatterns(subPatternsRes.data?.subPatterns || []);
      setProblems(problemsRes.data?.problems || []);
      setUsers(usersRes.data?.users || []);
      setCoupons(couponsRes.data?.coupons || []);
      
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const actionWrapper = async (apiCall, successCallback) => {
    try {
      const res = await apiCall();
      if (res.data.success) {
        successCallback(res.data);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  // Topics
  const addTopic = (data) => actionWrapper(() => axios.post('/admin/topics', data), res => setTopics(p => [...p, res.topic]));
  const updateTopic = (id, data) => actionWrapper(() => axios.put(`/admin/topics/${id}`, data), res => setTopics(p => p.map(t => t.id === id ? res.topic : t)));
  const deleteTopic = (id) => actionWrapper(() => axios.delete(`/admin/topics/${id}`), () => setTopics(p => p.filter(t => t.id !== id)));

  // Patterns
  const addPattern = (data) => actionWrapper(() => axios.post('/admin/patterns', data), res => setPatterns(p => [...p, res.pattern]));
  const updatePattern = (id, data) => actionWrapper(() => axios.put(`/admin/patterns/${id}`, data), res => setPatterns(p => p.map(pt => pt.id === id ? res.pattern : pt)));
  const deletePattern = (id) => actionWrapper(() => axios.delete(`/admin/patterns/${id}`), () => setPatterns(p => p.filter(pt => pt.id !== id)));

  // SubPatterns
  const addSubPattern = (data) => actionWrapper(() => axios.post('/admin/sub-patterns', data), res => setSubPatterns(p => [...p, res.subPattern]));
  const updateSubPattern = (id, data) => actionWrapper(() => axios.put(`/admin/sub-patterns/${id}`, data), res => setSubPatterns(p => p.map(sp => sp.id === id ? res.subPattern : sp)));
  const deleteSubPattern = (id) => actionWrapper(() => axios.delete(`/admin/sub-patterns/${id}`), () => setSubPatterns(p => p.filter(sp => sp.id !== id)));

  // Problems
  const addProblem = (data) => actionWrapper(() => axios.post('/admin/problems', data), res => setProblems(p => [...p, res.problem]));
  const updateProblem = (id, data) => actionWrapper(() => axios.put(`/admin/problems/${id}`, data), res => setProblems(p => p.map(pr => pr.id === id ? res.problem : pr)));
  const deleteProblem = (id) => actionWrapper(() => axios.delete(`/admin/problems/${id}`), () => setProblems(p => p.filter(pr => pr.id !== id)));

  // Users
  const updateUser = (id, data) => actionWrapper(() => axios.put(`/admin/users/${id}`, data), res => setUsers(p => p.map(u => u.id === id ? { ...u, ...data } : u)));

  // Coupons
  const addCoupon = (data) => actionWrapper(() => axios.post('/admin/coupons', data), res => setCoupons(p => [...p, res.coupon]));
  const updateCoupon = (id, data) => actionWrapper(() => axios.put(`/admin/coupons/${id}`, data), res => setCoupons(p => p.map(c => c.id === id ? res.coupon : c)));
  const deleteCoupon = (id) => actionWrapper(() => axios.delete(`/admin/coupons/${id}`), () => setCoupons(p => p.filter(c => c.id !== id)));
  const toggleCoupon = (id) => actionWrapper(() => axios.patch(`/admin/coupons/${id}/toggle`), res => setCoupons(p => p.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)));

  const value = {
    loading,
    topics, patterns, subPatterns, problems, users, transactions, revenueStats, coupons, analytics,
    addTopic, updateTopic, deleteTopic,
    addPattern, updatePattern, deletePattern,
    addSubPattern, updateSubPattern, deleteSubPattern,
    addProblem, updateProblem, deleteProblem,
    updateUser,
    addCoupon, updateCoupon, deleteCoupon, toggleCoupon,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
