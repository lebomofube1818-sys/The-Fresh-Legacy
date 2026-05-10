import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  addDoc,
  deleteDoc,
  writeBatch,
  getDocs
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
  Calendar,
  Plus,
  Edit,
  Trash2,
  Box,
  Image as ImageIcon,
  DollarSign,
  Tag,
  AlertCircle,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/constants';

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
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [estimatedArrival, setEstimatedArrival] = useState<string>('');
  
  // Product Edit State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    if (selectedOrder) {
      setEstimatedArrival(selectedOrder.estimatedArrival || '');
    }
  }, [selectedOrder]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!auth.currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const adminRef = doc(db, 'admins', auth.currentUser.uid);
        const { getDoc } = await import('firebase/firestore');
        const adminDoc = await getDoc(adminRef);
        
        // Owner bootstrap
        if (!adminDoc.exists() && auth.currentUser.email === 'lebomofube1818@gmail.com' && auth.currentUser.emailVerified) {
          setIsAdmin(true);
        } else {
          setIsAdmin(adminDoc.exists());
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin === false) {
      onBack();
      return;
    }
    if (!isAdmin) return;

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    const unsubscribeOrders = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    const productsRef = collection(db, 'products');
    const unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
    };
  }, []);

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, updates as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    
    try {
      if (editingProduct.id) {
        const productRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productRef, editingProduct as any);
      } else {
        await addDoc(collection(db, 'products'), {
          ...editingProduct,
          rating: 0,
          reviewCount: 0,
          isNew: true
        });
      }
      setIsEditingProduct(false);
      setEditingProduct(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this legendary piece from the archive?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const seedDatabase = async () => {
    if (!confirm('This will seed the database with mock products. Continue?')) return;
    try {
      const batch = writeBatch(db);
      MOCK_PRODUCTS.forEach(product => {
        const docRef = doc(collection(db, 'products'), product.id);
        batch.set(docRef, product);
      });
      await batch.commit();
      alert('Archive Synchronized Successfully.');
    } catch (error) {
      console.error('Error seeding:', error);
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
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Operations Hub</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Management Interface v2.0</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex bg-gray-100 p-1 rounded-full mr-4">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Orders
                </button>
                <button 
                  onClick={() => setActiveTab('inventory')}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Inventory
                </button>
             </div>
            <Button variant="outline" onClick={onBack} className="rounded-full border-2 font-bold px-6">
              Exit Portal
            </Button>
          </div>
        </div>
      </div>

      <div className="tfl-container mt-12">
        <AnimatePresence mode="wait">
          {activeTab === 'orders' ? (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Orders logic remains here... */}
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
            </motion.div>
          ) : (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
               {/* Inventory Stats */}
               <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                  {[
                    { label: 'Total Stocked Items', value: products.length, icon: Box, color: 'text-blue-500' },
                    { label: 'Out of Stock', value: products.filter(p => p.stockCount === 0).length, icon: AlertCircle, color: 'text-red-500' },
                    { label: 'Low Stock (< 10)', value: products.filter(p => p.stockCount > 0 && p.stockCount < 10).length, icon: Tag, color: 'text-orange-500' },
                    { label: 'System Health', value: 'Sync Optimized', icon: Database, color: 'text-green-500' },
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

               {/* Inventory Controls */}
               <div className="lg:col-span-12 flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={() => {
                        setEditingProduct({});
                        setIsEditingProduct(true);
                      }}
                      className="bg-black text-white rounded-full px-8 py-6 font-black uppercase italic tracking-tighter hover:bg-gray-800 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> New Archival Piece
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={seedDatabase}
                      className="rounded-full px-8 py-6 font-black uppercase italic tracking-tighter border-black border-2 hover:bg-black hover:text-white transition-all flex items-center gap-2"
                    >
                      <Database className="w-4 h-4" /> Sync Archive
                    </Button>
                  </div>
                  <div className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                    Total SKU: {products.length.toString().padStart(3, '0')}
                  </div>
               </div>

               {/* Inventory Grid */}
               <div className="lg:col-span-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <Card key={product.id} className="border-none shadow-sm rounded-3xl overflow-hidden group">
                        <div className="aspect-square relative overflow-hidden bg-gray-100">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                             <Button 
                              size="icon" 
                              onClick={() => {
                                setEditingProduct(product);
                                setIsEditingProduct(true);
                              }}
                              className="bg-white text-black hover:bg-brand-accent hover:text-white rounded-full w-12 h-12"
                             >
                                <Edit className="w-5 h-5" />
                             </Button>
                             <Button 
                              size="icon" 
                              onClick={() => deleteProduct(product.id)}
                              className="bg-white text-red-600 hover:bg-red-600 hover:text-white rounded-full w-12 h-12"
                             >
                                <Trash2 className="w-5 h-5" />
                             </Button>
                          </div>
                          {product.stockCount < 10 && (
                            <Badge className="absolute top-4 left-4 bg-red-500 text-white border-none rounded-full px-3 py-1 font-black uppercase text-[9px] tracking-widest">
                               Low Stock: {product.stockCount}
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-6">
                           <div className="flex justify-between items-start mb-2">
                             <div>
                               <h3 className="font-black italic uppercase tracking-tighter text-lg">{product.name}</h3>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</p>
                             </div>
                             <p className="text-xl font-black italic text-brand-primary tracking-tight">R{product.price}</p>
                           </div>
                           <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                 <Box className="w-3 h-3 text-gray-400" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available Count:</span>
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${product.stockCount > 0 ? 'text-black' : 'text-red-500'}`}>
                                {product.stockCount} Units
                              </span>
                           </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Edit Modal */}
      <AnimatePresence>
        {isEditingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingProduct(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                 <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
                   {editingProduct?.id ? 'Refine Archive' : 'New Legacy Item'}
                 </h2>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Item Blueprint Registry</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Identity & Title</label>
                       <input 
                        type="text" 
                        placeholder="Product Name"
                        value={editingProduct?.name || ''}
                        onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                        className="w-full bg-gray-100 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary"
                       />
                       <input 
                        type="text" 
                        placeholder="Category"
                        value={editingProduct?.category || ''}
                        onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                        className="w-full bg-gray-100 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary"
                       />
                       <div className="flex gap-4">
                         <div className="flex-1 relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                              type="number" 
                              placeholder="Price"
                              value={editingProduct?.price || ''}
                              onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                              className="w-full bg-gray-100 border-none rounded-2xl pl-10 p-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary"
                            />
                         </div>
                         <div className="flex-1 relative">
                            <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                              type="number" 
                              placeholder="Stock"
                              value={editingProduct?.stockCount ?? ''}
                              onChange={e => setEditingProduct({...editingProduct, stockCount: Number(e.target.value)})}
                              className="w-full bg-gray-100 border-none rounded-2xl pl-10 p-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary"
                            />
                         </div>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Visual Archive (Image URL)</label>
                       <input 
                        type="text" 
                        placeholder="Primary Image URL"
                        value={editingProduct?.images?.[0] || ''}
                        onChange={e => setEditingProduct({...editingProduct, images: [e.target.value]})}
                        className="w-full bg-gray-100 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary"
                       />
                       <div className="grid grid-cols-2 gap-4">
                          <select 
                            value={editingProduct?.gender || ''}
                            onChange={e => setEditingProduct({...editingProduct, gender: e.target.value as any})}
                            className="w-full bg-gray-100 border-none rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-primary"
                          >
                            <option value="">Gender</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="kids">Kids</option>
                            <option value="unisex">Unisex</option>
                          </select>
                          <select 
                            value={editingProduct?.sport || ''}
                            onChange={e => setEditingProduct({...editingProduct, sport: e.target.value as any})}
                            className="w-full bg-gray-100 border-none rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-primary"
                          >
                            <option value="">Utility</option>
                            <option value="lifestyle">Lifestyle</option>
                            <option value="running">Running</option>
                            <option value="basketball">Basketball</option>
                            <option value="training">Training</option>
                          </select>
                       </div>
                       <textarea 
                        placeholder="Product Description"
                        rows={3}
                        value={editingProduct?.description || ''}
                        onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                        className="w-full bg-gray-100 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary resize-none"
                       />
                    </div>
                    
                    <div className="md:col-span-2 grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Sizes (Comma Separated)</label>
                          <input 
                            type="text" 
                            placeholder="US 8, US 9, US 10..."
                            value={editingProduct?.sizes?.join(', ') || ''}
                            onChange={e => setEditingProduct({...editingProduct, sizes: e.target.value.split(',').map(s => s.trim())})}
                            className="w-full bg-gray-100 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-brand-primary"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Colors (Comma Separated)</label>
                          <input 
                            type="text" 
                            placeholder="Black, White, Crimson..."
                            value={editingProduct?.colors?.join(', ') || ''}
                            onChange={e => setEditingProduct({...editingProduct, colors: e.target.value.split(',').map(s => s.trim())})}
                            className="w-full bg-gray-100 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-brand-primary"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="mt-10 flex gap-4">
                    <Button 
                      onClick={() => setIsEditingProduct(false)}
                      variant="outline"
                      className="flex-1 rounded-full py-8 border-2 font-black uppercase italic tracking-tighter"
                    >
                      Cancel Blueprint
                    </Button>
                    <Button 
                      onClick={saveProduct}
                      className="flex-1 rounded-full py-8 bg-black text-white hover:bg-gray-800 font-black uppercase italic tracking-tighter"
                    >
                      Authorize & Store
                    </Button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
