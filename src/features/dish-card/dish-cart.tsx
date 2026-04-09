import React, { useCallback, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgProps } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { CartFeature } from '../cart';
import { CartItem } from '../cart/types';
import { styles } from './dish-cart-styles';
import { DishCardProps } from './types';

export const DishCard = React.memo(({ item, onPress }: DishCardProps) => {
  const dispatch = useDispatch();
  const dishId = String(item.id);
  const [isSyncing, setIsSyncing] = useState(false);

  const isCartInitialized = useSelector(CartFeature.selectors.selectCartInitialized);
  const cartItem = useSelector(CartFeature.selectors.selectCartItemById(dishId)) as CartItem | null;

  const quantity = cartItem?.quantity ?? 0;
  const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;

  const isInteractionDisabled = isSyncing || !isCartInitialized;

  const withSyncGuard = useCallback(
    (fn: () => void) => {
      if (isInteractionDisabled) return;
      setIsSyncing(true);
      fn();
      setTimeout(() => setIsSyncing(false), 300);
    },
    [isInteractionDisabled]
  );

  const handleAddToCart = useCallback(() => {
    withSyncGuard(() => {
      dispatch(
        CartFeature.actions.addToCart({
          id: dishId,
          cartItemId: cartItem?.cartItemId,
          name: item.name,
          price,
          imageSvg: item.imageSvg,
          imageUrl: item.imageUrl,
          weekday: item.weekday,
        })
      );
    });
  }, [withSyncGuard, dispatch, dishId, cartItem?.cartItemId, item, price]);

  const handleDecrease = useCallback(() => {
    withSyncGuard(() => {
      dispatch(
        CartFeature.actions.decreaseQuantity({
          id: dishId,
          cartItemId: cartItem?.cartItemId,
        })
      );
    });
  }, [withSyncGuard, dispatch, dishId, cartItem?.cartItemId]);

  const renderImage = () => {
    if (item.imageUrl) {
      return <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />;
    }
    if (item.imageSvg) {
      const SvgImage = item.imageSvg as React.FC<SvgProps>;
      return <SvgImage width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />;
    }
    return <Text style={styles.imagePlaceholder}>🍽</Text>;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.wrapper}
      disabled={isInteractionDisabled}
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
                disabled={isInteractionDisabled}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleAddToCart}
                disabled={isInteractionDisabled}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.addToCartButton, !isCartInitialized && { opacity: 0.5 }]}
              onPress={handleAddToCart}
              disabled={isInteractionDisabled}
            >
              <Text style={styles.addToCartButtonText}>
                {isCartInitialized ? 'В корзину' : 'Загрузка...'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
});
