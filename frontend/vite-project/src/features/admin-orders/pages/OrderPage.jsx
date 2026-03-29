import React, { useEffect, useState } from 'react';
import { adminOrderService } from '../services/orderService';
import { Package, Eye, X, User, MapPin, Phone, Mail, Search, Filter } from 'lucide-react';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // For Detail Modal
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await adminOrderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminOrderService.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      if(selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({...prev, status: newStatus}));
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.shippingDetails.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-10 text-center animate-pulse font-bold text-gray-400">Loading Orders...</div>;

  return (
    <div className="space-y-6">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <p className="text-sm text-gray-500 font-medium">Manage your customer deliveries and statuses.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Order ID or Name..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Order Detail</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Total</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-mono text-sm font-bold text-blue-600">{order.orderNumber}</div>
                  <div className="text-sm font-bold text-gray-900 mt-1">{order.shippingDetails.fullName}</div>
                  <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  Rs. {order.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="View Full Detail"
                  >
                    <Eye size={20} />
                  </button>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Set Pending</option>
                    <option value="Processing">Set Processing</option>
                    <option value="Shipped">Set Shipped</option>
                    <option value="Delivered">Set Delivered</option>
                    <option value="Cancelled">Set Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order #{selectedOrder.orderNumber}</h2>
                <p className="text-xs text-gray-500">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Column 1: Customer & Shipping */}
              <div className="lg:col-span-1 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User size={14} /> Customer Info
                  </h3>
                  <div className="space-y-2">
                    <p className="font-bold text-gray-900 text-lg">{selectedOrder.shippingDetails.fullName}</p>
                    <p className="flex items-center gap-2 text-sm text-gray-600"><Mail size={14}/> {selectedOrder.shippingDetails.email}</p>
                    <p className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14}/> {selectedOrder.shippingDetails.phone}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MapPin size={14} /> Shipping Address
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    {selectedOrder.shippingDetails.address}<br />
                    <strong>{selectedOrder.shippingDetails.city}</strong><br />
                    {selectedOrder.shippingDetails.postalCode}
                  </p>
                </div>
              </div>

              {/* Column 2 & 3: Order Items */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Package size={14} /> Items Ordered
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border">
                        <img 
                          src={item.productId?.productImg?.[0]?.url || item.productId?.productImg?.[0]} 
                          className="w-full h-full object-cover" 
                          alt="product"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{item.productId?.productName || "Product Deleted"}</p>
                        <p className="text-xs text-gray-500">Price: Rs. {item.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 italic">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-900 rounded-2xl text-white flex justify-between items-center shadow-lg">
                  <div>
                    <p className="text-xs text-gray-400">Total Bill (inc. shipping)</p>
                    <p className="text-2xl font-bold font-mono">Rs. {selectedOrder.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${getStatusStyle(selectedOrder.status)}`}>
                    Status: {selectedOrder.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;