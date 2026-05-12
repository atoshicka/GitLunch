import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { Images } from '../../shared/constants/images';
import { TAB_NAMES } from '../../shared/constants/navigation';
import { successStyles } from '../success-screen/success-screen-styles';
import { errorStyles } from './error-screen-styles';

type ErrorNavProp = NativeStackNavigationProp<RootStackParamList, 'Error'>;

const SubtractIcon = Images.home.wave;
const SettingsIcon = Images.account.setting;

export const ErrorScreen: React.FC = () => {
  const navigation = useNavigation<ErrorNavProp>();

  const handleGoBack = () => {
    navigation.navigate(TAB_NAMES.PAYMENT as never);
  };

  return (
    <View style={successStyles.container}>
      <View style={successStyles.waveSection} pointerEvents="none">
        <View style={successStyles.waveBackground}>
          <SubtractIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>
      </View>

      <SafeAreaView edges={['top']} style={successStyles.waveContent}>
        <View style={successStyles.topBar}>
          <TouchableOpacity style={successStyles.topBarButton} onPress={handleGoBack}>
            <Text style={successStyles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={successStyles.brandTitle}>GitLunch</Text>
          <TouchableOpacity style={successStyles.topBarButton}>
            <SettingsIcon width={24} height={24} fill="#1F2937" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={successStyles.centerContent}>
        <Text style={errorStyles.errorEmoji}>✕</Text>
        <Text style={errorStyles.errorTitle}>Возникла ошибка</Text>
        <Text style={errorStyles.errorSubTitle}>Попробуйте ещё раз</Text>

        <TouchableOpacity style={errorStyles.retryButton} onPress={handleGoBack}>
          <Text style={errorStyles.retryButtonText}>Попробовать снова</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
