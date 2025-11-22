import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@shared/types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        {product.image && (
          <div className="aspect-square overflow-hidden rounded-md bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 space-y-1">
          <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
          <p className="text-sm text-muted-foreground">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full gap-2"
          onClick={() => onAddToCart?.(product)}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
