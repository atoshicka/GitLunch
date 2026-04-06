import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { CartFeature } from '../../features/cart';
import { OrdersFeature } from '../../features/orders';
import { Images } from '../../shared/constants/images';
import { SCREEN_NAMES } from '../../shared/constants/navigation';
import { paymentStyles } from './payment-screen-styles';

type PaymentNavProp = NativeStackNavigationProp<RootStackParamList, 'Payment'>;

const SubtractIcon = Images.home.wave;
const SettingsIcon = Images.account.setting;
const NavigIcon = Images.navigation.navig;
const SBPIcon = Images.other.sbp;

export const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<PaymentNavProp>();
  const dispatch = useDispatch();

  const items = useSelector(CartFeature.selectors.selectCartItems);
  const totalPrice = useSelector(CartFeature.selectors.selectCartTotalPrice);
  const totalItems = useSelector(CartFeature.selectors.selectCartTotalItems);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const isFormValid = useMemo(() => {
    return cardNumber.length === 16 && expiry.length === 4 && cvc.length === 3;
  }, [cardNumber, expiry, cvc]);

  const formatCardNumber = (text: string) => {
    return text
      .replace(/\D/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .trim();
  };

  const formatExpiry = (text: string) => {
    const clean = text.replace(/\D/g, '');
    if (clean.length >= 2) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  const handlePay = () => {
    if (!isFormValid) return;

    const now = new Date();
    const newOrder = {
      id: Date.now().toString(),
      date: now.toLocaleDateString('ru-RU'),
      dayOfWeek: now.toLocaleDateString('ru-RU', { weekday: 'long' }),
      code: Math.floor(10000 + Math.random() * 90000).toString(),
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice,
      totalItems,
    };

    dispatch(OrdersFeature.actions.addOrder(newOrder));
    dispatch(CartFeature.actions.clearCart());
    navigation.navigate(SCREEN_NAMES.SUCCESS);
  };

  return (
    <View style={paymentStyles.container}>
      <View style={paymentStyles.waveSection} pointerEvents="none">
        <View style={paymentStyles.waveBackground}>
          <SubtractIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>
      </View>

      <SafeAreaView edges={['top']} style={paymentStyles.waveContent}>
        <View style={paymentStyles.topBar}>
          <TouchableOpacity style={paymentStyles.topBarButton} onPress={() => navigation.goBack()}>
            <Text style={paymentStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={paymentStyles.brandTitle}>GitLunch</Text>
          <TouchableOpacity style={paymentStyles.topBarButton}>
            <SettingsIcon width={26} height={26} fill="#1F2937" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={paymentStyles.content}>
        <View style={paymentStyles.section}>
          <Text style={paymentStyles.label}>Адрес доставки</Text>
          <View style={paymentStyles.disabledInput}>
            <Text style={paymentStyles.disabledInputText}>Чкалова 3</Text>
          </View>
        </View>
        <View style={{ width: '100%', marginBottom: 5 }}>
          <Text style={paymentStyles.label}>Способ оплаты</Text>
        </View>

        <View style={paymentStyles.sbpContainer}>
          <TouchableOpacity activeOpacity={0.7}>
            <SBPIcon width={100} height={50} />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={['#86EFAC', '#1CD961']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={paymentStyles.cardBlock}
        >
          <Text style={paymentStyles.cardBlockTitle}>Реквизиты</Text>

          <TextInput
            style={paymentStyles.input}
            placeholder="Номер карты"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            maxLength={19}
            value={formatCardNumber(cardNumber)}
            onChangeText={(t) => setCardNumber(t.replace(/\D/g, ''))}
          />

          <View style={paymentStyles.row}>
            <TextInput
              style={[paymentStyles.input, { flex: 1 }]}
              placeholder="ММ/ГГ"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              maxLength={5}
              value={formatExpiry(expiry)}
              onChangeText={(t) => setExpiry(t.replace(/\D/g, ''))}
            />
            <View style={{ width: 16 }} />
            <TextInput
              style={[paymentStyles.input, { flex: 1 }]}
              placeholder="CVC"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
              value={cvc}
              onChangeText={(t) => setCvc(t.replace(/\D/g, ''))}
            />
          </View>
        </LinearGradient>

        <TouchableOpacity
          style={[paymentStyles.orderButton, !isFormValid && { opacity: 0.5 }]}
          onPress={handlePay}
          disabled={!isFormValid}
          activeOpacity={0.8}
        >
          <Text style={paymentStyles.orderButtonText}>Оплатить</Text>
        </TouchableOpacity>
      </View>

      <View style={paymentStyles.navigSection} pointerEvents="none">
        <View style={paymentStyles.navigBackground}>
          <NavigIcon width="100%" height="100%" preserveAspectRatio="xMidYMax slice" />
        </View>
      </View>
    </View>
  );
};
