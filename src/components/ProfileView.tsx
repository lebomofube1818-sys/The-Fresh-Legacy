import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Package, UserCircle, LogOut, Calendar, CreditCard, ChevronRight, CheckCircle2, Settings, Save, Smartphone, MapPin, Ruler, Lock } from 'lucide-react';
import { useAuth } from '@/AuthContext';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface UserProfile {
  displayName?: string;
  mobileNumber?: string;
  shippingAddress?: string;
  birthday?: string;
  preferences?: {
    category?: 'Mens' | 'Womens' | 'Unisex';
    notifications?: boolean;
  };
  sizeProfile?: {
    shoeSize?: string;
    shirtSize?: string;
  };
}
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
  estimatedArrival?: string;
  receivedConfirmation?: boolean;
  shippingAddress?: string;
}

interface ProfileViewProps {
  onBack: () => void;
  onAdminClick: () => void;
  onAuthOpen: () => void;
}

export default function ProfileView({ onBack, onAdminClick, onAuthOpen }: ProfileViewProps) {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [view, setView] = useState<'orders' | 'settings'>('orders');
  
  // Settings State
  const [profile, setProfile] = useState<UserProfile>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Fetch User Profile Data
    const fetchProfile = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();

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

      // Keep selected order in sync
      if (selectedOrder) {
        const updated = ordersData.find(o => o.id === selectedOrder.id);
        if (updated) setSelectedOrder(updated);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, selectedOrder?.id]);

  const saveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...profile,
        updatedAt: serverTimestamp()
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmReceipt = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { receivedConfirmation: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 flex items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-lg mx-auto">
          <div className="relative inline-block mb-4">
             <div className="absolute inset-0 bg-brand-accent/20 blur-3xl rounded-full" />
             <div className="relative">
               <UserCircle className="w-24 h-24 mx-auto text-gray-100" />
               <div className="absolute -bottom-2 -right-2 bg-brand-accent p-3 rounded-full border-4 border-white shadow-xl">
                  <Lock className="w-5 h-5 text-white" />
               </div>
             </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">Identity Check / <span className="text-gray-300">Restricted</span></h2>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              Step into the vault. Authorized access only to track orders, manage archives, and secure exclusive drops.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Button 
              onClick={() => onAuthOpen?.()} 
              className="bg-black text-white hover:bg-gray-800 rounded-3xl py-8 font-black uppercase tracking-[0.3em] text-[11px] px-16 shadow-2xl relative overflow-hidden group"
            >
              <span className="relative z-10">Authorize Access</span>
              <div className="absolute inset-0 bg-brand-accent opacity-0 group-hover:opacity-10 transition-opacity" />
            </Button>
            <Button 
              onClick={onBack} 
              variant="ghost" 
              className="rounded-full font-black uppercase text-[10px] tracking-[0.3em] text-gray-400 hover:text-black flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Return to Catalog
            </Button>
          </div>
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
                  <Button 
                    variant={view === 'settings' ? 'default' : 'outline'}
                    onClick={() => setView('settings')}
                    className={`w-full justify-start rounded-xl font-bold py-6 border-transparent hover:border-gray-200 transition-all ${
                      view === 'settings' ? 'bg-brand-accent text-white hover:bg-brand-accent/90' : ''
                    }`}
                  >
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
                    onClick={() => { logout(); onBack(); setView('orders'); }}
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

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {view === 'orders' ? (
                <motion.div
                  key="orders-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
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
                          layoutId={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`group bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all ${
                             selectedOrder?.id === order.id ? 'shadow-2xl ring-2 ring-brand-primary border-transparent' : 'hover:shadow-xl'
                          }`}
                        >
                          <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                              <div className="space-y-4 flex-1">
                                <div className="flex items-center flex-wrap gap-3">
                                  <Package className="w-5 h-5 text-brand-accent" />
                                  <span className="text-sm font-black italic tracking-tight uppercase">{order.orderId}</span>
                                  <Badge className="bg-green-50 text-green-700 hover:bg-green-50 px-3 py-1 rounded-full border-none text-[10px] uppercase font-black">
                                    {order.status}
                                  </Badge>
                                  {order.receivedConfirmation && (
                                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-full border-none text-[10px] uppercase font-black flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> Received
                                    </Badge>
                                  )}
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
                                <Button 
                                  variant="ghost" 
                                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                                  className="rounded-full font-bold uppercase text-[10px] tracking-widest group-hover:bg-gray-50 h-12 px-6"
                                >
                                  {selectedOrder?.id === order.id ? 'Close Details' : 'View Details'} 
                                  <ChevronRight className={`ml-2 w-4 h-4 transition-transform ${selectedOrder?.id === order.id ? 'rotate-90' : ''}`} />
                                </Button>
                              </div>
                            </div>

                            {/* Detail View */}
                            <AnimatePresence>
                              {selectedOrder?.id === order.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="mt-8 pt-8 border-t border-gray-100 overflow-hidden"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order Contents</h4>
                                      <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                          <div key={idx} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="font-black italic uppercase text-xs">{item.name}</p>
                                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Size {item.size} • Qty {item.quantity} • R{item.price}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="space-y-8">
                                      <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
                                        <div className="flex justify-between items-center">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tracking Status</span>
                                          <span className="text-xs font-black italic uppercase">{order.status}</span>
                                        </div>
                                        {order.estimatedArrival && (
                                          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estimated Arrival</span>
                                            <span className="text-xs font-black italic uppercase text-brand-primary">{order.estimatedArrival}</span>
                                          </div>
                                        )}
                                        {order.shippingAddress && (
                                          <div className="space-y-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shipping To</span>
                                            <p className="text-xs font-medium text-gray-500 leading-relaxed">{order.shippingAddress}</p>
                                          </div>
                                        )}
                                      </div>

                                      {order.status === 'shipped' && !order.receivedConfirmation && (
                                        <Button 
                                          onClick={() => confirmReceipt(order.id)}
                                          className="w-full bg-black text-white hover:bg-gray-800 rounded-2xl py-6 text-[10px] font-black uppercase tracking-[0.2em]"
                                        >
                                          Confirm Order Received
                                        </Button>
                                      )}
                                      
                                      {order.receivedConfirmation && (
                                        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
                                          <div className="bg-green-100 p-2 rounded-full">
                                             <CheckCircle2 className="w-4 h-4 text-green-600" />
                                          </div>
                                          <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Receipt Confirmed</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
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
                </motion.div>
              ) : (
                <motion.div
                  key="settings-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Account Settings</h2>
                      <p className="text-sm text-gray-500 font-medium">Personalize your legacy and size profile</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setView('orders')}
                      className="self-start md:self-center font-bold uppercase text-[10px] tracking-widest"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Back to Orders
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     {/* Profile Form */}
                     <div className="space-y-8">
                        <div className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                             <UserCircle className="w-4 h-4" /> Personal Information
                           </h3>
                           
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Display Name</label>
                                 <input 
                                   type="text"
                                   value={profile.displayName || ''}
                                   onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                   placeholder="Your legacy name"
                                   className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all outline-none"
                                 />
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mobile Number</label>
                                 <div className="relative">
                                    <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                      type="tel"
                                      value={profile.mobileNumber || ''}
                                      onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
                                      placeholder="+27 000 000 0000"
                                      className="w-full bg-white border border-gray-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all outline-none"
                                    />
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Birthday</label>
                                 <input 
                                   type="date"
                                   value={profile.birthday || ''}
                                   onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                                   className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none"
                                 />
                                 <p className="text-[9px] text-gray-400 font-medium ml-1">Receive exclusive rewards on your birthday.</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                             <MapPin className="w-4 h-4" /> Default Shipping Address
                           </h3>
                           <textarea 
                             value={profile.shippingAddress || ''}
                             onChange={(e) => setProfile({ ...profile, shippingAddress: e.target.value })}
                             placeholder="Street address, City, Postcode"
                             rows={4}
                             className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all outline-none resize-none"
                           />
                        </div>
                     </div>

                     {/* Size Profile & Save */}
                     <div className="space-y-8">
                        <div className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                             <Ruler className="w-4 h-4" /> Size Profile
                           </h3>
                           <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                             Set your sizes to get personalized inventory alerts and faster checkout.
                           </p>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Shoe Size (UK)</label>
                                 <select 
                                   value={profile.sizeProfile?.shoeSize || ''}
                                   onChange={(e) => setProfile({ 
                                     ...profile, 
                                     sizeProfile: { ...profile.sizeProfile, shoeSize: e.target.value } 
                                   })}
                                   className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none appearance-none"
                                 >
                                   <option value="">Select</option>
                                   {['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(s => (
                                     <option key={s} value={s}>{s}</option>
                                   ))}
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Apparel Size</label>
                                 <select 
                                   value={profile.sizeProfile?.shirtSize || ''}
                                   onChange={(e) => setProfile({ 
                                     ...profile, 
                                     sizeProfile: { ...profile.sizeProfile, shirtSize: e.target.value } 
                                   })}
                                   className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none appearance-none"
                                 >
                                   <option value="">Select</option>
                                   {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                                     <option key={s} value={s}>{s}</option>
                                   ))}
                                 </select>
                              </div>
                           </div>

                           <div className="pt-4 border-t border-gray-100">
                             <div className="flex items-center justify-between">
                               <div className="space-y-1">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-black">Email Notifications</p>
                                 <p className="text-[9px] text-gray-400 font-medium">Get notified about exclusive drops</p>
                               </div>
                               <button 
                                 onClick={() => setProfile({ 
                                   ...profile, 
                                   preferences: { ...profile.preferences, notifications: !profile.preferences?.notifications } 
                                 })}
                                 className={`w-12 h-6 rounded-full transition-all relative ${
                                   profile.preferences?.notifications ? 'bg-brand-accent' : 'bg-gray-200'
                                 }`}
                               >
                                 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                                   profile.preferences?.notifications ? 'left-7' : 'left-1'
                                 }`} />
                               </button>
                             </div>
                           </div>
                        </div>

                        <div className="pt-4 flex flex-col items-center gap-4">
                           <Button 
                             onClick={saveProfile}
                             disabled={isSaving}
                             className={`w-full py-8 rounded-3xl text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
                               saveSuccess 
                                 ? 'bg-green-500 hover:bg-green-600 text-white' 
                                 : 'bg-black hover:bg-gray-800 text-white'
                             }`}
                           >
                             {isSaving ? (
                               <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                             ) : saveSuccess ? (
                               <>
                                 <CheckCircle2 className="w-5 h-5" /> Changes Saved
                               </>
                             ) : (
                               <>
                                 <Save className="w-5 h-5" /> Save Changes
                               </>
                             )}
                           </Button>
                           {saveSuccess && (
                             <p className="text-[10px] font-black uppercase tracking-widest text-green-600 animate-bounce">
                               Profile Sync Successful
                             </p>
                           )}
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
