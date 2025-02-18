import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { generateBetLink, createQRCode } from '../utils/betUtils';
import { WalletConnect } from '../components/WalletConnect';

const CreateBetScreen: React.FC = () => {
  const [betAmount, setBetAmount] = useState('');
  const [betCondition, setBetCondition] = useState('');

  const handleCreateBet = async () => {
    const betData = {
      amount: betAmount,
      condition: betCondition,
      timestamp: Date.now(),
    };
    
    const betLink = await generateBetLink(betData);
    const qrCode = await createQRCode(betLink);
    // Handle sharing and navigation
  };

  return (
    <View style={styles.container}>
      <WalletConnect />
      <TextInput
        placeholder="Bet Amount (ETH)"
        value={betAmount}
        onChangeText={setBetAmount}
      />
      <TextInput
        placeholder="Bet Condition"
        value={betCondition}
        onChangeText={setBetCondition}
        multiline
      />
      <TouchableOpacity onPress={handleCreateBet}>
        <Text>Create Bet</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateBetScreen; 