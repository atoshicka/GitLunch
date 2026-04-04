import React, { useCallback, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgProps } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { CartFeature } from '../../features/cart';
import { CartItem } from '../../features/cart/types';
import { styles } from './dish-cart-styles';

interface DishCardProps {
  item: {
    id: string | number;
    name: string;
    price: number | string;
    imageUrl?: string;
    imageSvg?: React.FC<SvgProps>;
  };
  onPress?: () => void;
}

export const DishCard = React.memo(({ item, onPress }: DishCardProps) => {
  const dispatch = useDispatch();
  const dishId = String(item.id);
  const [isSyncing, setIsSyncing] = useState(false);

  const cartItem = useSelector(CartFeature.selectors.selectCartItemById(dishId)) as CartItem | null;
  const quantity = cartItem?.quantity ?? 0;
  const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;

  const handleAddToCart = useCallback(() => {
    if (isSyncing) return;
    setIsSyncing(true);
    dispatch(
      CartFeature.actions.addToCart({
        id: dishId,
        cartItemId: cartItem?.cartItemId,
        name: item.name,
        price: price,
        imageSvg: item.imageSvg,
        imageUrl: item.imageUrl,
      })
    );
    setTimeout(() => setIsSyncing(false), 500);
  }, [dispatch, dishId, item, cartItem?.cartItemId, price, isSyncing]);

  const handleDecrease = useCallback(() => {
    if (isSyncing) return;
    setIsSyncing(true);
    dispatch(
      CartFeature.actions.decreaseQuantity({
        id: dishId,
        cartItemId: cartItem?.cartItemId,
      })
    );
    setTimeout(() => setIsSyncing(false), 500);
  }, [dispatch, dishId, cartItem?.cartItemId, isSyncing]);

  const renderImage = () => {
    if (item.imageUrl) {
      return <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />;
    }
    if (item.imageSvg) {
      const SvgImage = item.imageSvg;
      return <SvgImage width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />;
    }
    return <Text style={styles.imagePlaceholder}>🍽</Text>;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.wrapper}
      disabled={isSyncing}
    >
      <LinearGradient
        colors={['#86EFAC', '#A8F0B5', '#F4F4F4']}
        locations={[0, 0.2, 0.6]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.card}
      >
        <View style={styles.topContent}>
          <View style={styles.imageContainer}>{renderImage()}</View>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.price}>{price} ₽</Text>
        </View>

        <View style={styles.actionBlock}>
          {quantity > 0 ? (
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecrease}
                disabled={isSyncing}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleAddToCart}
                disabled={isSyncing}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
              disabled={isSyncing}
            >
              <Text style={styles.addToCartButtonText}>В корзину</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
});
