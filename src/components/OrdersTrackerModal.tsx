import React from 'react';
import { X, Package, AlertCircle } from 'lucide-react';
import type { Order, OrderStatus } from '../types/bakery';
import { CakeFallbackImage } from './CakeFallbackImage';

interface OrdersTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrder?: (order: Order) => void;
}

const STATUS_STEPS: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

export const OrdersTrackerModal: React.FC<OrdersTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#111113] text-[#f0f0f0] max-w-4xl w-full overflow-hidden shadow-2xl border border-[rgba(240,240,240,0.15)] my-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[rgba(240,240,240,0.1)] bg-[#161618] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a1a1c] border border-[rgba(240,240,240,0.15)] flex items-center justify-center text-[#d48b7a]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#d48b7a] font-bold">
                Celebration Dispatch
              </span>
              <h2 className="font-syne font-extrabold text-xl sm:text-2xl uppercase text-[#f0f0f0]">
                Order History & Live Tracking
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#f0f0f0]/70 hover:text-white hover:bg-[#1a1a1c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders list */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Package className="w-12 h-12 text-[#d48b7a] opacity-40 mx-auto" />
              <h3 className="font-syne text-lg font-bold uppercase text-[#f0f0f0]">No orders found yet</h3>
              <p className="font-mono text-xs uppercase text-[#f0f0f0]/50">
                When you place a cake order, tracking details and delivery progress appear here.
              </p>
            </div>
          ) : (
            orders.map((ord) => {
              const currentStepIdx = STATUS_STEPS.indexOf(ord.orderStatus);

              return (
                <div
                  key={ord.id}
                  className="bg-[#1a1a1c] p-5 sm:p-6 border border-[rgba(240,240,240,0.1)] space-y-5"
                >
                  {/* Top Bar: Order Number & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[rgba(240,240,240,0.1)] gap-3 font-mono text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-syne text-base font-bold text-[#f0f0f0]">
                          Order #{ord.orderNumber}
                        </span>
                        <span className="text-[#f0f0f0]/50">
                          · {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[#f0f0f0]/70 mt-0.5">
                        Delivery: <strong className="text-[#d48b7a]">{ord.deliveryDate}</strong> ({ord.deliveryTimeSlot})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 font-mono text-[10px] uppercase font-bold border border-[#d48b7a] bg-[#111113] text-[#d48b7a]">
                        {ord.orderStatus}
                      </span>
                      <span className="font-syne text-base font-bold text-[#f0f0f0] tabular-nums">
                        ₹{ord.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  {ord.orderStatus !== 'Cancelled' ? (
                    <div className="py-2">
                      <div className="flex items-center justify-between relative">
                        {/* Connecting line */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[rgba(240,240,240,0.15)] -translate-y-1/2 -z-0" />
                        {STATUS_STEPS.map((st, i) => {
                          const isDone = i <= currentStepIdx;
                          const isCurrent = i === currentStepIdx;

                          return (
                            <div key={st} className="relative z-10 flex flex-col items-center">
                              <div
                                className={`w-7 h-7 flex items-center justify-center font-mono text-xs font-bold transition-all ${
                                  isCurrent
                                    ? 'bg-[#d48b7a] text-[#111113] ring-2 ring-[#d48b7a]'
                                    : isDone
                                    ? 'bg-[#f0f0f0] text-[#111113]'
                                    : 'bg-[#111113] text-[#f0f0f0]/40 border border-[rgba(240,240,240,0.2)]'
                                }`}
                              >
                                {isDone ? '✓' : i + 1}
                              </div>
                              <span
                                className={`font-mono text-[9px] uppercase mt-1.5 whitespace-nowrap ${
                                  isCurrent ? 'text-[#d48b7a] font-bold' : 'text-[#f0f0f0]/60'
                                }`}
                              >
                                {st}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-950/60 text-red-300 p-3 border border-red-800 font-mono text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span>This order has been cancelled.</span>
                    </div>
                  )}

                  {/* Order Items & Customization Details */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#d48b7a]">
                      Items in this Order
                    </h4>
                    <div className="space-y-3">
                      {ord.items.map((it) => (
                        <div
                          key={it.id}
                          className="flex items-center gap-4 bg-[#111113] p-3 border border-[rgba(240,240,240,0.1)]"
                        >
                          <div className="w-14 h-14 overflow-hidden shrink-0 bg-[#161618]">
                            <CakeFallbackImage src={it.productImage} alt={it.productName} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 font-mono text-xs">
                            <h5 className="font-syne font-bold uppercase text-[#f0f0f0] truncate">{it.productName}</h5>
                            <p className="text-[10px] text-[#f0f0f0]/60 uppercase">
                              Qty: {it.quantity} · {it.customization.weight} · {it.customization.flavour}
                            </p>
                            {it.customization.hasMessage && it.customization.cakeMessage && (
                              <p className="text-[10px] text-[#d48b7a] italic">
                                Message: &ldquo;{it.customization.cakeMessage}&rdquo;
                              </p>
                            )}
                          </div>
                          <div className="text-right font-syne font-bold text-sm text-[#f0f0f0] tabular-nums shrink-0">
                            ₹{it.itemSubtotal.toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
