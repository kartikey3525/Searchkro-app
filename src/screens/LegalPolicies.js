import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function LegalPolicies({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Entypo
          onPress={() => navigation.goBack()}
          name="chevron-thin-left"
          size={20}
          color="rgba(94, 95, 96, 1)"
          style={{marginLeft: 20}}
        />
        <Text style={styles.headerText}>Legal Policies</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Term:</Text>
        <Text style={styles.description}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </Text>

        <Text style={styles.title}>Searchkro Service:</Text>
        <Text style={styles.description}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </Text>

        <Text style={styles.title}>Searchkro Access:</Text>
        <Text style={styles.description}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // Ensures the screen takes the full available height
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Height * 0.1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '26%',
  },
  scrollContent: {
    paddingBottom: 20, // Ensures space at the bottom for better scrolling
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.53)',
    marginTop: 6,
  },
});
