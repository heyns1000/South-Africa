import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Shield, Truck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Welcome to South Africa E-commerce
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover quality products with secure payments and fast delivery across South Africa
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button size="lg">Shop Now</Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <ShoppingBag className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>Wide Selection</CardTitle>
                <CardDescription>
                  Browse thousands of products across multiple categories
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>Secure Payments</CardTitle>
                <CardDescription>
                  Pay securely with PayPal or PayFast, South Africa's trusted payment gateway
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>Fast Delivery</CardTitle>
                <CardDescription>
                  Quick and reliable delivery to your doorstep across South Africa
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Start Shopping?</h2>
            <p className="text-lg opacity-90">
              Join thousands of satisfied customers and experience the best online shopping in South Africa
            </p>
            <Link href="/products">
              <Button size="lg" variant="secondary">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
