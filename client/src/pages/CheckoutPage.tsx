import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/hooks/useUser';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Cart from '@/components/Cart';
import CheckoutForm from '@/components/CheckoutForm';
import { toast } from '@/hooks/useToast';

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCart();
  const { isAuthenticated, isLoading: userLoading } = useUser();
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to proceed with checkout',
        variant: 'destructive',
      });
      setLocation('/login');
    }
  }, [isAuthenticated, userLoading, setLocation]);

  const createOrderMutation = useMutation({
    mutationFn: async (data: {
      shippingAddress: string;
      paymentMethod: 'paypal' | 'payfast';
    }) => {
      // Create order
      const orderResponse = await api.createOrder({
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
      });

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error('Failed to create order');
      }

      const order = orderResponse.data as any;

      // Handle payment based on method
      if (data.paymentMethod === 'paypal') {
        const paypalResponse = await api.createPayPalOrder(order.id);
        if (!paypalResponse.success || !paypalResponse.data) {
          throw new Error('Failed to create PayPal order');
        }
        return { order, paymentData: paypalResponse.data };
      } else {
        const payfastResponse = await api.createPayFastPayment(order.id);
        if (!payfastResponse.success || !payfastResponse.data) {
          throw new Error('Failed to create PayFast payment');
        }
        return { order, paymentData: payfastResponse.data };
      }
    },
    onSuccess: (data) => {
      clearCart();
      toast({
        title: 'Order Created',
        description: 'Redirecting to payment...',
      });
      
      // Handle redirect based on payment method
      const paymentData = data.paymentData as any;
      if (paymentData.id) {
        // PayPal - would normally redirect to PayPal
        console.log('PayPal Order ID:', paymentData.id);
        toast({
          title: 'Payment Ready',
          description: 'In production, you would be redirected to PayPal',
        });
        setLocation('/dashboard');
      } else if (paymentData.url) {
        // PayFast - would normally redirect to PayFast
        console.log('PayFast URL:', paymentData.url);
        toast({
          title: 'Payment Ready',
          description: 'In production, you would be redirected to PayFast',
        });
        setLocation('/dashboard');
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to process order',
        variant: 'destructive',
      });
    },
  });

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Add items to your cart before checking out',
        variant: 'destructive',
      });
      return;
    }
    setShowForm(true);
  };

  const handleSubmitCheckout = (formData: any) => {
    const shippingAddress = `${formData.address}, ${formData.city}, ${formData.postalCode}`;
    createOrderMutation.mutate({
      shippingAddress,
      paymentMethod: formData.paymentMethod,
    });
  };

  if (userLoading) {
    return (
      <div className="container py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Review your order and complete payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Cart
              items={items}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onCheckout={handleCheckout}
            />
          </div>

          {showForm && (
            <div>
              <CheckoutForm
                onSubmit={handleSubmitCheckout}
                isLoading={createOrderMutation.isPending}
                total={getTotal()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
