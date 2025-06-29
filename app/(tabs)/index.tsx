// file: app/index.tsx

import axios from 'axios';
import * as MediaLibrary from 'expo-media-library';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Barcode } from 'react-native-svg-barcode';
import ViewShot from 'react-native-view-shot';

// Ganti dengan API Key Gemini Anda
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY; 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

const DismissKeyboard = ({ children }: { children: any }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default function BarcodeGeneratorScreen() { 
  const [inputText, setInputText] = useState('');
  const [generatedValue, setGeneratedValue] = useState('');
  const [generatorType, setGeneratorType] = useState('barcode'); 
  const [isLoading, setIsLoading] = useState(false); 
  
  const viewShotRef = useRef<ViewShot>(null);

  const handleGeneratePress = () => {
    if (inputText) {
      setGeneratedValue(inputText);
      Keyboard.dismiss();
    } else {
      setGeneratedValue(''); 
    }
  };

  const handleAiGenerate = async () => {
    if (!inputText) {
      Alert.alert("Input Kosong", "Mohon masukkan perintah untuk AI.");
      return;
    }
    if (GEMINI_API_KEY === 'MASUKKAN_API_KEY_ANDA_DI_SINI') {
      Alert.alert("API Key Belum Diatur", "Mohon masukkan API Key Gemini Anda di dalam kode.");
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setGeneratedValue('');

    const prompt = `
      Analisa teks berikut dari pengguna: "${inputText}".
      Tugasmu adalah mengekstrak informasi untuk membuat barcode atau QR code.
      Tentukan tipe kode (hanya boleh "barcode" atau "qrcode") dan data yang akan dikodekan.
      Jika pengguna meminta QR code untuk sebuah website, pastikan data diawali dengan "https://".
      
      Hanya berikan jawaban dalam format JSON yang valid, seperti ini:
      {"type": "qrcode", "data": "https://www.tokopedia.com"}
      atau
      {"type": "barcode", "data": "123456789"}
    `;

    try {
      const response = await axios.post(GEMINI_API_URL, {
        contents: [{ parts: [{ text: prompt }] }],
      });
      
      let jsonResponseText = response.data.candidates[0].content.parts[0].text;
      jsonResponseText = jsonResponseText.replace(/```json/g, '').replace(/```/g, '').trim();

      const result = JSON.parse(jsonResponseText);

      if (result.type && result.data) {
        setGeneratorType(result.type);
        setGeneratedValue(result.data);
        setInputText(`Perintah AI: "${inputText}"\nHasil: ${result.data}`);
      } else {
        throw new Error("Format respons AI tidak valid.");
      }

    } catch (error) {
      console.error("Error dari API:", error);
      Alert.alert("Gagal!", "Terjadi kesalahan saat memproses permintaan AI. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveImageAsync = async () => {
    if (!generatedValue) {
      Alert.alert("Tidak ada gambar", "Silakan generate kode terlebih dahulu.");
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Izin Diperlukan", 
        "Aplikasi ini memerlukan izin untuk menyimpan gambar ke galeri Anda."
      );
      return;
    }

    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture?.();
        await MediaLibrary.createAssetAsync(uri!);
        Alert.alert("Sukses!", "Gambar berhasil disimpan ke galeri foto Anda.");
      }
    } catch (error) {
      console.error("Oops, something went wrong!", error);
      Alert.alert("Gagal", "Tidak dapat menyimpan gambar. Silakan coba lagi.");
    }
  };

  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <Text style={styles.headerText}>AI Code Generator</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.typeSelectorContainer}>
              <TouchableOpacity
                style={[styles.typeButton, generatorType === 'barcode' && styles.typeButtonActive]}
                onPress={() => setGeneratorType('barcode')}
              >
                <Text style={styles.typeButtonText}>Barcode</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, generatorType === 'qrcode' && styles.typeButtonActive]}
                onPress={() => setGeneratorType('qrcode')}
              >
                <Text style={styles.typeButtonText}>QR Code</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.cardTitle}>Masukkan Data atau Perintah AI</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: buatkan qrcode untuk https://lampung.dev"
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.manualButton]} onPress={handleGeneratePress}>
                <Text style={styles.buttonText}>Generate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.aiButton]} onPress={handleAiGenerate}>
                <Text style={styles.buttonText}>Generate with AI</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }} style={{backgroundColor: 'white', borderRadius: 12}}>
            <View style={styles.barcodeContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#007AFF" />
              ) : generatedValue ? (
                generatorType === 'barcode' ? (
                  <Barcode value={generatedValue} format="CODE128" height={80} />
                ) : (
                  <QRCode value={generatedValue} size={180} />
                )
              ) : (
                <Text style={styles.placeholderText}>Kode akan muncul di sini</Text>
              )}
            </View>
          </ViewShot>

          {generatedValue && !isLoading && (
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveImageAsync}>
              <Text style={styles.buttonText}>Simpan ke Galeri</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    header: { backgroundColor: '#1F1F1F', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, paddingBottom: 20, paddingHorizontal: 20, alignItems: 'center' },
    headerText: { fontSize: 24, color: '#FFFFFF', fontWeight: 'bold', marginTop: 20 },
    content: { flex: 1, padding: 20 },
    card: { backgroundColor: '#1E1E1E', borderRadius: 12, padding: 20, marginBottom: 20 }, // Mengurangi margin bottom card
    typeSelectorContainer: { flexDirection: 'row', backgroundColor: '#2C2C2C', borderRadius: 8, marginBottom: 20 },
    typeButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    typeButtonActive: { backgroundColor: '#007AFF' },
    typeButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 5, textAlign: 'center' },
    input: { backgroundColor: '#2C2C2C', color: '#FFFFFF', borderRadius: 8, paddingHorizontal: 15, paddingVertical: Platform.OS === 'ios' ? 15 : 10, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#444', marginTop: 10, minHeight: 60, textAlignVertical: 'top' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    button: { flex: 1, paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
    manualButton: { backgroundColor: '#5856D6' },
    aiButton: { backgroundColor: '#FF9500' },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    barcodeContainer: { backgroundColor: '#FFFFFF', padding: 20, alignItems: 'center', justifyContent: 'center', minHeight: 220, borderRadius: 12 },
    placeholderText: { color: '#888', fontSize: 16 },
    saveButton: { backgroundColor: '#34C759', marginTop: 20, marginHorizontal: 0 }, // Mengganti warna jadi Hijau
});