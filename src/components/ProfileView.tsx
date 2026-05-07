import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Package, UserCircle, LogOut, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import { useAuth } from '@/AuthContext';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

interface Order {
  id: string;
  orderId: string;
  total: number;
  status: string;
  createdAt: any;
  items: OrderItem[];
}

interface ProfileViewProps {
  onBack: () => void;
  onAdminClick: () => void;
}

export default function ProfileView({ onBack, onAdminClick }: ProfileViewProps) {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <UserCircle className="w-16 h-16 mx-auto text-gray-200" />
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">Sign in to view profile</h2>
          <Button onClick={onBack} variant="outline" className="rounded-full">Back to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="tfl-container">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* User Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-brand-accent rounded-full flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl">
                  {user.displayName?.[0] || user.email?.[0]}
                </div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">{user.displayName || 'Sneakerhead'}</h2>
                <p className="text-sm text-gray-500 font-medium mb-6">{user.email}</p>
                <Separator className="mb-6" />
                <div className="w-full space-y-2">
                  <Button variant="outline" className="w-full justify-start rounded-xl font-bold py-6 border-transparent hover:border-gray-200">
                    <UserCircle className="w-4 h-4 mr-3" /> Account Settings
                  </Button>
                  
                  {user.email === 'lebomofube1818@gmail.com' && (
                    <Button 
                      onClick={onAdminClick}
                      className="w-full justify-start rounded-xl font-bold py-6 bg-brand-primary text-brand-accent hover:bg-gray-800"
                    >
                      <Package className="w-4 h-4 mr-3" /> Admin Portal
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={() => { logout(); onBack(); }}
                    className="w-full justify-start rounded-xl font-bold py-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" /> Sign Out
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-8 bg-brand-primary text-white rounded-3xl space-y-4">
               <h3 className="text-lg font-black italic tracking-tighter uppercase">Legacy Rewards</h3>
               <p className="text-xs text-gray-400 font-medium leading-relaxed">
                 You are 2,400 points away from your next exclusive drop access. Keep stacking.
               </p>
               <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '40%' }}
                    className="h-full bg-brand-accent"
                  />
               </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-8">
            <div className="mb-10">
              <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Order History</h2>
              <p className="text-sm text-gray-500 font-medium">Track and manage your recent purchases</p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-brand-accent" />
                          <span className="text-sm font-black italic tracking-tight uppercase">{order.orderId}</span>
                          <Badge className="bg-green-50 text-green-700 hover:bg-green-50 px-3 py-1 rounded-full border-none text-[10px] uppercase font-black">
                            {order.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-3 h-3" />
                            Total: R{order.total}
                          </div>
                        </div>

                        <div className="flex -space-x-4 overflow-hidden pt-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="relative w-12 h-12 rounded-xl border-2 border-white bg-gray-50 overflow-hidden shadow-sm">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Button variant="ghost" className="rounded-full font-bold uppercase text-[10px] tracking-widest group-hover:bg-gray-50">
                          View Details <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-400 font-bold uppercase italic tracking-tighter text-xl">No orders yet</p>
                <p className="text-xs text-gray-400 mt-2 font-medium">Ready to start your legacy?</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
