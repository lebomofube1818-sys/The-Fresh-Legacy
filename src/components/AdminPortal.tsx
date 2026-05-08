import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Search,
  ExternalLink,
  ChevronRight,
  User,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
  id: string;
  orderId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  mobileNumber: string;
  items: any[];
  total: number;
  status: string;
  createdAt: any;
  estimatedArrival: string | null;
  receivedConfirmation: boolean;
}

export default function AdminPortal({ onBack }: { onBack: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [estimatedArrival, setEstimatedArrival] = useState<string>('');

  useEffect(() => {
    if (selectedOrder) {
      setEstimatedArrival(selectedOrder.estimatedArrival || '');
    }
  }, [selectedOrder]);

  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, []);

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, updates as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processed': return <CheckCircle2 className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-24">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="tfl-container py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Order Command</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Operational Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="bg-gray-100 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary w-full md:w-64"
              />
            </div>
            <Button variant="outline" onClick={onBack} className="rounded-full border-2 font-bold px-6">
              Exit Portal
            </Button>
          </div>
        </div>
      </div>

      <div className="tfl-container mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Stats Bar */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            {[
              { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-brand-primary' },
              { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'text-yellow-500' },
              { label: 'In Transit', value: orders.filter(o => o.status === 'shipped').length, icon: Truck, color: 'text-purple-500' },
              { label: 'Revenue', value: `R${orders.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}`, icon: CheckCircle2, color: 'text-green-500' },
            ].map((stat, i) => (
              <Card key={i} className="border-none shadow-sm rounded-2xl">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-xl font-black italic tracking-tight">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Orders List */}
          <div className="lg:col-span-12">
             <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none">
                {['all', 'pending', 'processed', 'shipped', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      filterStatus === status 
                        ? 'bg-brand-primary text-white shadow-lg' 
                        : 'bg-white text-gray-400 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
             </div>

             <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.map((order) => (
                    <motion.div
                      layout
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card 
                        className={`overflow-hidden border-none shadow-sm rounded-3xl transition-all hover:shadow-md cursor-pointer ${
                          selectedOrder?.id === order.id ? 'ring-2 ring-brand-primary' : ''
                        }`}
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                             <div className="flex-1">
                               <div className="flex items-center gap-3 mb-2">
                                  <Badge className={`rounded-full px-3 py-1 font-black uppercase text-[9px] tracking-widest flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                     {getStatusIcon(order.status)}
                                     {order.status}
                                  </Badge>
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{order.orderId || order.id.slice(0, 8)}</span>
                                  {order.receivedConfirmation && (
                                    <Badge className="bg-green-100 text-green-700 border-none rounded-full px-3 py-1 font-black uppercase text-[9px] tracking-widest">
                                       Received by Customer
                                    </Badge>
                                  )}
                               </div>
                               <h3 className="text-xl font-black italic tracking-tighter uppercase">{order.customerName || order.customerEmail || 'LEGACY ORDER'}</h3>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                                  <Mail className="w-3 h-3" /> {order.customerEmail || 'No email provided'}
                               </p>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                                  <Calendar className="w-3 h-3" />
                                  {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'} at {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleTimeString() : ''}
                               </p>
                            </div>

                            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-12">
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                               <p className="text-2xl font-black italic tracking-tighter text-brand-primary">R{order.total.toLocaleString()}</p>
                            </div>

                            <div className="flex items-center justify-center md:pl-6 px-6 pb-6 md:pb-0">
                               <ChevronRight className={`w-5 h-5 text-gray-300 transition-transform ${selectedOrder?.id === order.id ? 'rotate-90' : ''}`} />
                            </div>
                          </div>

                          {/* Order Details Expanded */}
                          <AnimatePresence>
                            {selectedOrder?.id === order.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-gray-50/50 border-t border-gray-100"
                              >
                                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                                  {/* Items */}
                                  <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                                       <Package className="w-4 h-4" /> Manifest Details
                                    </h4>
                                    <div className="space-y-4">
                                      {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm">
                                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                          </div>
                                          <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-start">
                                               <p className="font-black italic uppercase text-xs tracking-tight">{item.name}</p>
                                               <p className="font-black text-xs text-brand-primary">R{item.price}</p>
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                               Size {item.size} • Qty {item.quantity}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Actions & Status */}
                                  <div className="space-y-8">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                           <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                              <User className="w-4 h-4" /> Customer Info
                                           </h4>
                                           <div className="space-y-2">
                                              <p className="text-xs font-bold text-gray-600 flex items-center gap-2"><MapPin className="w-3 h-3" /> Shipping Address</p>
                                              <p className="text-xs font-medium text-gray-400 bg-white p-3 rounded-xl">{order.shippingAddress || 'No address provided'}</p>
                                              {order.mobileNumber && (
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Mobile: {order.mobileNumber}</p>
                                              )}
                                           </div>
                                        </div>

                                        <div className="space-y-4">
                                           <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                              <CheckCircle2 className="w-4 h-4" /> Operations
                                           </h4>
                                           <div className="space-y-4">
                                             <div>
                                               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Update Status</p>
                                               <div className="grid grid-cols-2 gap-2">
                                                 {['pending', 'processed', 'shipped', 'completed'].map((s) => (
                                                   <button
                                                     key={s}
                                                     onClick={(e) => {
                                                       e.stopPropagation();
                                                       updateOrder(order.id, { status: s });
                                                     }}
                                                     className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                                       order.status === s 
                                                         ? 'bg-brand-primary text-white' 
                                                         : 'bg-white text-gray-400 hover:bg-gray-100 hover:text-black shadow-sm border border-gray-100'
                                                     }`}
                                                   >
                                                     {s}
                                                   </button>
                                                 ))}
                                               </div>
                                             </div>

                                             <div className="pt-2">
                                               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Estimated Arrival</p>
                                               <div className="flex gap-2">
                                                 <input 
                                                   type="text" 
                                                   value={selectedOrder?.id === order.id ? estimatedArrival : (order.estimatedArrival || '')}
                                                   onChange={(e) => setEstimatedArrival(e.target.value)}
                                                   onClick={(e) => e.stopPropagation()}
                                                   placeholder="e.g. May 15, 2024"
                                                   className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-bold focus:ring-2 focus:ring-brand-primary"
                                                 />
                                                 <Button 
                                                   size="sm" 
                                                   onClick={(e) => {
                                                     e.stopPropagation();
                                                     updateOrder(order.id, { estimatedArrival });
                                                   }}
                                                   className="rounded-xl bg-black text-white px-4 text-[9px] font-black uppercase"
                                                 >
                                                   Set
                                                 </Button>
                                               </div>
                                             </div>
                                           </div>
                                        </div>
                                     </div>

                                     <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                                        <Button variant="outline" className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-12">
                                           Print Invoice
                                        </Button>
                                        <Button 
                                          className="rounded-xl font-black italic uppercase tracking-tighter text-[10px] h-12 bg-black text-white hover:bg-gray-800"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Simulate notification
                                            alert("Customer notified of order update.");
                                          }}
                                        >
                                           Notify Customer
                                        </Button>
                                     </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
